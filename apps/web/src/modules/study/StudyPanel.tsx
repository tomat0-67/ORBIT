import { useEffect, useState, type FormEvent } from 'react'
import { createStudyTask, deleteStudyTask, loadStudyTasks, saveStudyTask, type StudyTask } from './taskStore'

function formatDueDate(value: string) {
  if (!value) return 'Sans échéance'
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
}

export function StudyPanel() {
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    loadStudyTasks().then((storedTasks) => {
      if (active) setTasks(storedTasks)
    }).catch(() => {
      if (active) setMessage('Le stockage local est indisponible sur cet appareil.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const task = createStudyTask({
      title: String(values.get('title') ?? ''),
      subject: String(values.get('subject') ?? ''),
      dueDate: String(values.get('dueDate') ?? ''),
    })

    if (!task) {
      setMessage('Ajoute un titre de 120 caractères maximum.')
      return
    }
    if (tasks.length >= 200) {
      setMessage('La limite locale de 200 devoirs est atteinte. Supprime un ancien devoir pour en ajouter un autre.')
      return
    }

    try {
      await saveStudyTask(task)
    } catch {
      setMessage('Le navigateur ne peut pas enregistrer ces données sur cet appareil.')
      return
    }
    setTasks((current) => [task, ...current])
    setMessage('Devoir ajouté sur cet appareil.')
    form.reset()
  }

  async function updateTask(taskId: string, update: (task: StudyTask) => StudyTask) {
    const existing = tasks.find((task) => task.id === taskId)
    if (!existing) return
    const updated = update(existing)
    try {
      await saveStudyTask(updated)
    } catch {
      setMessage('La modification n’a pas pu être enregistrée.')
      return
    }
    setTasks((current) => current.map((task) => task.id === taskId ? updated : task))
    setMessage('Modifications enregistrées sur cet appareil.')
  }

  async function removeTask(taskId: string) {
    try {
      await deleteStudyTask(taskId)
    } catch {
      setMessage('La suppression n’a pas pu être enregistrée.')
      return
    }
    setTasks((current) => current.filter((task) => task.id !== taskId))
    setMessage('Devoir supprimé de cet appareil.')
  }

  const openTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <section className="study-layout" aria-labelledby="study-list-title">
      <div className="study-overview">
        <div>
          <span className="kicker">Ton organisation</span>
          <h2 id="study-list-title">Les prochaines étapes.</h2>
          <p>{openTasks.length} devoir{openTasks.length === 1 ? '' : 's'} à faire · {completedTasks.length} terminé{completedTasks.length === 1 ? '' : 's'}</p>
        </div>
        <span className="local-badge"><i /> Stockage local</span>
      </div>

      <form className="task-form" onSubmit={submitTask}>
        <label className="task-title-field">Nouveau devoir<input name="title" maxLength={120} placeholder="Ex. Réviser le chapitre 4" required /></label>
        <label>Matière<input name="subject" maxLength={60} placeholder="Ex. Histoire" /></label>
        <label>À rendre<input name="dueDate" type="date" /></label>
        <button className="button button-primary" type="submit">Ajouter</button>
      </form>
      <p className="task-storage-note" role="status" aria-live="polite">{message || 'Ces devoirs restent sur cet appareil. La synchronisation de compte n’est pas encore configurée.'}</p>

      <div className="task-list" aria-label="Devoirs à faire">
        {loading ? <p className="task-empty">Chargement de tes devoirs…</p> : openTasks.length === 0 ? <p className="task-empty">Aucun devoir à faire. Ajoute une prochaine étape ci-dessus.</p> : openTasks.map((task) => (
          <article className="task-row" key={task.id}>
            <button className="task-check" aria-label={`Marquer « ${task.title} » comme terminé`} onClick={() => updateTask(task.id, (current) => ({ ...current, completed: true }))} />
            <div className="task-copy"><strong>{task.title}</strong><span>{task.subject}</span></div>
            <time className="task-date" dateTime={task.dueDate || undefined}>{formatDueDate(task.dueDate)}</time>
            <button className="task-delete" aria-label={`Supprimer « ${task.title} »`} onClick={() => removeTask(task.id)}>Supprimer</button>
          </article>
        ))}
      </div>

      {completedTasks.length > 0 && <details className="completed-tasks">
        <summary>Terminés ({completedTasks.length})</summary>
        {completedTasks.map((task) => <article className="task-row is-complete" key={task.id}>
          <button className="task-check checked" aria-label={`Rouvrir « ${task.title} »`} onClick={() => updateTask(task.id, (current) => ({ ...current, completed: false }))}>✓</button>
          <div className="task-copy"><strong>{task.title}</strong><span>{task.subject}</span></div>
          <time className="task-date" dateTime={task.dueDate || undefined}>{formatDueDate(task.dueDate)}</time>
          <button className="task-delete" aria-label={`Supprimer « ${task.title} »`} onClick={() => removeTask(task.id)}>Supprimer</button>
        </article>)}
      </details>}
    </section>
  )
}
