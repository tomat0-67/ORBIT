import { isTauri } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { readDir } from '@tauri-apps/plugin-fs'
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
}
