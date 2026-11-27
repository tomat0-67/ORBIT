export interface ProjectEntry {
  name: string
  kind: 'directory' | 'file'
}

export interface FileSystemPort {
  isAvailable(): boolean
  chooseProjectDirectory(): Promise<string | null>
  readDirectory(path: string): Promise<ProjectEntry[]>
  readTextFile(path: string, maxBytes: number): Promise<string>
}
