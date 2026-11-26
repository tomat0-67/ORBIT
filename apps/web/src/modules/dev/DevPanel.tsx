import { useState } from 'react'
import type { ProjectEntry } from './fileSystemPort'
import { tauriFileSystem } from './tauriFileSystem'

type Folder = { name: string; path: string }

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
    } catch {
      setError('Impossible de relire ce dossier. Il a peut-être été déplacé ou supprimé.')
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
            <div className="file-row" key={entry.name}>
              <span className="file-type" aria-hidden="true">F</span>
              <span>{entry.name}</span>
              <small>Fichier</small>
            </div>
          ))}
        </div>
        <p className="task-storage-note">La navigation reste dans le dossier choisi. ORBIT affiche les noms, sans lire ni modifier le contenu des fichiers.</p>
      </>}
    </section>
  )
}
