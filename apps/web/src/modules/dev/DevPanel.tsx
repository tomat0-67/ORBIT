import { useState } from 'react'
import { isTauri } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { readDir, type DirEntry } from '@tauri-apps/plugin-fs'

function folderLabel(path: string) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path
}

export function DevPanel() {
  const [projectPath, setProjectPath] = useState<string | null>(null)
  const [entries, setEntries] = useState<DirEntry[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const desktop = isTauri()

  async function chooseProject() {
    if (!desktop) {
      setError('La sélection de dossiers est disponible dans l’application desktop ORBIT.')
      return
    }

    setBusy(true)
    setError('')
    try {
      const selected = await open({ directory: true, multiple: false, title: 'Choisir un dossier de projet' })
      if (typeof selected !== 'string') return
      const items = await readDir(selected)
      setProjectPath(selected)
      setEntries(items.sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory) || a.name.localeCompare(b.name)))
    } catch {
      setError('Impossible de lire ce dossier. Choisis un dossier auquel ton compte a accès.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="dev-workspace">
      <div className="dev-toolbar">
        <div><span className="kicker">Fichiers locaux</span><h2>{projectPath ? folderLabel(projectPath) : 'Choisis un projet à ouvrir.'}</h2>
          <p>{projectPath ? projectPath : 'ORBIT demande l’accès uniquement au dossier que tu sélectionnes.'}</p></div>
        <button className="button button-primary" onClick={chooseProject} disabled={busy}>{busy ? 'Ouverture…' : projectPath ? 'Changer de dossier' : 'Ouvrir un dossier'}</button>
      </div>
      {error && <p className="dev-message" role="status">{error}</p>}
      {projectPath ? <>
        <div className="file-list-heading"><span>Éléments à la racine</span><span>{entries.length} élément{entries.length === 1 ? '' : 's'}</span></div>
        <div className="file-list" aria-label="Fichiers du projet">
          {entries.length === 0 ? <p className="task-empty">Ce dossier est vide.</p> : entries.map((entry) => <div className="file-row" key={entry.name}>
            <span className={`file-type ${entry.isDirectory ? 'folder' : ''}`} aria-hidden="true">{entry.isDirectory ? 'D' : 'F'}</span>
            <span>{entry.name}</span>
            <small>{entry.isDirectory ? 'Dossier' : 'Fichier'}</small>
          </div>)}
        </div>
        <p className="task-storage-note">Lecture de la liste uniquement. ORBIT ne modifie ni n’envoie les fichiers.</p>
      </> : <div className="dev-first-open"><span className="empty-mark"><span aria-hidden="true">⌘</span></span><h3>Ton code reste sur ton disque.</h3><p>La première version affiche les éléments du dossier choisi. Elle ne modifie pas tes projets et ne les envoie pas vers un serveur.</p><span className="local-badge"><i /> Accès demandé dossier par dossier</span></div>}
    </section>
  )
}
