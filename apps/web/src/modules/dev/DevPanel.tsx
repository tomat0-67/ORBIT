import { useState } from 'react'
import type { ProjectEntry } from './fileSystemPort'
import { tauriFileSystem } from './tauriFileSystem'

type Folder = { name: string; path: string }
const MAX_PREVIEW_BYTES = 512 * 1024

function folderLabel(path: string) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path
}

function joinPath(parent: string, child: string) {
  if (!child || child === '.' || child === '..' || child.includes('/')) {
    throw new Error('Nom de dossier invalide.')
  }
  const trimmedParent = parent.replace(/[\\/]+$/, '')
  if (!trimmedParent) return `${parent.startsWith('/') ? '/' : ''}${child}`
  return `${trimmedParent}/${child}`
}

export function DevPanel() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [entries, setEntries] = useState<ProjectEntry[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ name: string; content: string } | null>(null)
  const currentFolder = folders.at(-1) ?? null

  async function chooseProject() {
    if (!tauriFileSystem.isAvailable()) {
      setError('La sélection de dossiers est disponible dans l’application desktop ORBIT.')
      return
    }

    setBusy(true)
    setError('')
    try {
      const selected = await tauriFileSystem.chooseProjectDirectory()
      if (!selected) return
      const items = await tauriFileSystem.readDirectory(selected)
      setFolders([{ name: folderLabel(selected), path: selected }])
      setEntries(items)
      setPreview(null)
    } catch {
      setError('Impossible d’ouvrir ce dossier. Vérifie les droits de ton compte et réessaie.')
    } finally {
      setBusy(false)
    }
  }

  async function openFolder(entry: ProjectEntry) {
    if (!currentFolder || entry.kind !== 'directory' || busy) return
    setBusy(true)
    setError('')
    try {
      const path = joinPath(currentFolder.path, entry.name)
      const items = await tauriFileSystem.readDirectory(path)
      setFolders((current) => [...current, { name: entry.name, path }])
      setEntries(items)
      setPreview(null)
    } catch {
      setError(`Impossible d’ouvrir le dossier « ${entry.name} ».`)
    } finally {
      setBusy(false)
    }
  }

  async function navigateTo(index: number) {
    if (busy || index < 0 || index >= folders.length) return
    setBusy(true)
    setError('')
    try {
      const nextFolders = folders.slice(0, index + 1)
      const items = await tauriFileSystem.readDirectory(nextFolders[index]!.path)
      setFolders(nextFolders)
      setEntries(items)
      setPreview(null)
    } catch {
      setError('Impossible de relire ce dossier. Il a peut-être été déplacé ou supprimé.')
    } finally {
      setBusy(false)
    }
  }

  async function openFile(entry: ProjectEntry) {
    if (!currentFolder || entry.kind !== 'file' || busy) return
    setBusy(true)
    setError('')
    try {
      const content = await tauriFileSystem.readTextFile(joinPath(currentFolder.path, entry.name), MAX_PREVIEW_BYTES)
      setPreview({ name: entry.name, content })
    } catch (cause) {
      setPreview(null)
      if (cause instanceof Error && cause.message === 'FILE_TOO_LARGE') {
        setError('Ce fichier dépasse la limite d’aperçu de 512 Kio.')
      } else if (cause instanceof Error && cause.message === 'NOT_TEXT') {
        setError('Ce fichier ne contient pas du texte UTF‑8 valide.')
      } else {
        setError(`Impossible de lire le fichier « ${entry.name} ».`)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="dev-workspace">
      <div className="dev-toolbar">
        <div>
          <span className="kicker">Explorateur local</span>
          <h2>{currentFolder ? currentFolder.name : 'Aucun dossier ouvert'}</h2>
          <p>{currentFolder ? currentFolder.path : 'Choisis un dossier de projet pour parcourir son arborescence.'}</p>
        </div>
        <button className="button button-primary" onClick={chooseProject} disabled={busy}>{busy ? 'Lecture…' : currentFolder ? 'Changer de dossier' : 'Ouvrir un dossier'}</button>
      </div>

      {error && <p className="dev-message" role="status">{error}</p>}

      {currentFolder && <>
        <nav className="project-breadcrumbs" aria-label="Chemin du projet">
          {folders.map((folder, index) => <span className="project-crumb" key={`${folder.path}-${index}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === folders.length - 1 ? <span aria-current="location">{folder.name}</span> : <button onClick={() => navigateTo(index)} disabled={busy}>{folder.name}</button>}
          </span>)}
        </nav>

        <div className="file-list-heading"><span>Contenu du dossier</span><span>{entries.length} élément{entries.length === 1 ? '' : 's'}</span></div>
        <div className="file-list" aria-label={`Contenu de ${currentFolder.name}`}>
          {entries.length === 0 ? <p className="task-empty">Ce dossier est vide.</p> : entries.map((entry) => entry.kind === 'directory' ? (
            <button className="file-row folder-button" key={entry.name} onClick={() => openFolder(entry)} disabled={busy} aria-label={`Ouvrir le dossier ${entry.name}`}>
              <span className="file-type folder" aria-hidden="true">D</span>
              <span>{entry.name}</span>
              <small>Dossier&nbsp; ›</small>
            </button>
          ) : (
            <button className="file-row folder-button" key={entry.name} onClick={() => openFile(entry)} disabled={busy} aria-label={`Afficher le fichier ${entry.name}`}>
              <span className="file-type" aria-hidden="true">F</span>
              <span>{entry.name}</span>
              <small>Aperçu</small>
            </button>
          ))}
        </div>
        {preview && <section className="dev-file-preview" aria-label={`Aperçu de ${preview.name}`}>
          <div className="file-list-heading"><span>{preview.name}</span><button className="button button-secondary" onClick={() => setPreview(null)}>Fermer</button></div>
          <pre style={{ maxHeight: '60vh', overflow: 'auto', margin: 0, padding: 14, whiteSpace: 'pre', fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.6 }}>{preview.content || 'Fichier vide.'}</pre>
        </section>}
        <p className="task-storage-note">Les fichiers texte sont lus en lecture seule pour l’aperçu, avec une limite de 512 Kio. Aucun fichier n’est modifié.</p>
      </>}
    </section>
  )
}
