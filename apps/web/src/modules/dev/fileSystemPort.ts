export interface ProjectEntry {
  name: string
  kind: 'directory' | 'file'
}

export interface FileSystemPort {
  isAvailable(): boolean
  chooseProjectDirectory(): Promise<string | null>
  readDirectory(path: string): Promise<ProjectEntry[]>
}
