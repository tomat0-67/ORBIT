import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createStudyTask, deleteStudyTask, loadStudyTasks, saveStudyTask, studyDatabaseName } from './taskStore'

function clearStudyDatabase() {
  return new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(studyDatabaseName)
    request.onsuccess = request.onerror = request.onblocked = () => resolve()
  })
}

describe('Study task storage', () => {
  beforeEach(clearStudyDatabase)
  afterEach(clearStudyDatabase)

  it('creates a trimmed task and defaults an empty subject', () => {
    const task = createStudyTask({ title: '  Lire le cours  ', subject: '', dueDate: '' }, new Date('2026-11-25T10:00:00Z'))
    expect(task).toMatchObject({ title: 'Lire le cours', subject: 'Sans matière', completed: false })
  })

  it('rejects an empty title and titles over the limit', () => {
    expect(createStudyTask({ title: '  ', subject: '', dueDate: '' })).toBeNull()
    expect(createStudyTask({ title: 'x'.repeat(121), subject: '', dueDate: '' })).toBeNull()
  })

  it('persists task data locally and deletes it by id', async () => {
    const task = createStudyTask({ title: 'Lire', subject: 'Français', dueDate: '' })!
    await saveStudyTask(task)
    expect(await loadStudyTasks()).toEqual([task])
    await deleteStudyTask(task.id)
    expect(await loadStudyTasks()).toEqual([])
  })
})
