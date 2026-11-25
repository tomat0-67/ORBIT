export const studyDatabaseName = 'orbit-local'
const studyDatabaseVersion = 1
const studyTasksStore = 'studyTasks'

export interface StudyTask {
  id: string
  title: string
  subject: string
  dueDate: string
  completed: boolean
  createdAt: string
}

export interface NewStudyTask {
  title: string
  subject: string
  dueDate: string
}

function isStudyTask(value: unknown): value is StudyTask {
  if (!value || typeof value !== 'object') return false
  const task = value as Partial<StudyTask>
  return typeof task.id === 'string'
    && typeof task.title === 'string'
    && typeof task.subject === 'string'
    && typeof task.dueDate === 'string'
    && typeof task.completed === 'boolean'
    && typeof task.createdAt === 'string'
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(studyDatabaseName, studyDatabaseVersion)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(studyTasksStore)) {
        database.createObjectStore(studyTasksStore, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB could not be opened'))
  })
}

function transactionComplete(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction was aborted'))
  })
}

export async function loadStudyTasks(): Promise<StudyTask[]> {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(studyTasksStore, 'readonly')
    const complete = transactionComplete(transaction)
    const request = transaction.objectStore(studyTasksStore).getAll()
    const records: unknown = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('Study tasks could not be read'))
    })
    await complete
    return Array.isArray(records) ? records.filter(isStudyTask).slice(0, 200) : []
  } finally {
    database.close()
  }
}

export async function saveStudyTask(task: StudyTask): Promise<void> {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(studyTasksStore, 'readwrite')
    const complete = transactionComplete(transaction)
    transaction.objectStore(studyTasksStore).put(task)
    await complete
  } finally {
    database.close()
  }
}

export async function deleteStudyTask(taskId: string): Promise<void> {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(studyTasksStore, 'readwrite')
    const complete = transactionComplete(transaction)
    transaction.objectStore(studyTasksStore).delete(taskId)
    await complete
  } finally {
    database.close()
  }
}

export function createStudyTask(input: NewStudyTask, now = new Date()): StudyTask | null {
  const title = input.title.trim()
  const subject = input.subject.trim()
  if (!title || title.length > 120 || subject.length > 60) return null
  if (input.dueDate && Number.isNaN(Date.parse(`${input.dueDate}T00:00:00`))) return null

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random().toString(36).slice(2)}`,
    title,
    subject: subject || 'Sans matière',
    dueDate: input.dueDate,
    completed: false,
    createdAt: now.toISOString(),
  }
}
