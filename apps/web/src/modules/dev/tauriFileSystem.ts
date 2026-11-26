import { isTauri } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { open as openFile, readDir } from '@tauri-apps/plugin-fs'
import type { FileSystemPort } from './fileSystemPort'

export const tauriFileSystem: FileSystemPort = {
  isAvailable: isTauri,

  async chooseProjectDirectory() {
    const selected = await open({
      directory: true,
      recursive: true,
      multiple: false,
      title: 'Choisir un dossier de projet',
    })
    return typeof selected === 'string' ? selected : null
  },

  async readDirectory(path) {
    const entries = await readDir(path)
    return entries
      .filter((entry) => entry.name !== '.' && entry.name !== '..')
      .map((entry) => ({
        name: entry.name,
        kind: entry.isDirectory ? 'directory' as const : 'file' as const,
      }))
      .sort((a, b) => Number(b.kind === 'directory') - Number(a.kind === 'directory') || a.name.localeCompare(b.name))
  },

  async readTextFile(path, maxBytes) {
    const file = await openFile(path, { read: true })
    try {
      const { size } = await file.stat()
      if (size > maxBytes) throw new Error('FILE_TOO_LARGE')

      const bytes = new Uint8Array(size)
      let offset = 0
      while (offset < bytes.length) {
        const count = await file.read(bytes.subarray(offset))
        if (count === null || count === 0) break
        offset += count
      }

      try {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, offset))
        if (text.includes('\0')) throw new Error('NOT_TEXT')
        return text
      } catch {
        throw new Error('NOT_TEXT')
      }
    } finally {
      await file.close()
    }
  },
}
