import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { studyDatabaseName } from '../modules/study/taskStore'

function clearStudyDatabase() {
  return new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(studyDatabaseName)
    request.onsuccess = request.onerror = request.onblocked = () => resolve()
  })
}

describe('ORBIT workspace shell', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    await clearStudyDatabase()
  })
  afterEach(async () => {
    cleanup()
    window.localStorage.clear()
    await clearStudyDatabase()
  })

  it('opens each workspace through the primary navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    const nav = within(screen.getByRole('navigation', { name: 'Navigation principale' }))

    await user.click(nav.getByRole('button', { name: 'DEV' }))
    expect(screen.getByRole('heading', { name: 'Aucun dossier ouvert' })).toBeInTheDocument()

    await user.click(nav.getByRole('button', { name: 'STUDY' }))
    expect(screen.getByRole('heading', { name: 'À faire' })).toBeInTheDocument()

    await user.click(nav.getByRole('button', { name: 'Compte' }))
    expect(screen.getByRole('heading', { name: 'Pas encore de compte' })).toBeInTheDocument()
  })

  it('toggles the theme and remembers the choice on this device', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    const shell = container.firstElementChild as HTMLElement
    expect(shell).toHaveAttribute('data-theme', 'dark')

    await user.click(screen.getAllByRole('button', { name: 'Activer le thème clair' })[0]!)
    expect(screen.getAllByRole('button', { name: 'Activer le thème sombre' })).toHaveLength(1)
    expect(window.localStorage.getItem('orbit.theme')).toBe('light')
  })

  it('collapses and reopens the desktop sidebar', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const sidebar = container.querySelector('.sidebar') as HTMLElement

    await user.click(screen.getByRole('button', { name: 'Réduire la barre latérale' }))
    expect(sidebar).toHaveClass('is-collapsed')

    await user.click(screen.getByRole('button', { name: 'Agrandir la barre latérale' }))
    expect(sidebar).not.toHaveClass('is-collapsed')
  })

  it('adds and completes a Study task saved on this device', async () => {
    const user = userEvent.setup()
    render(<App />)
    const nav = within(screen.getByRole('navigation', { name: 'Navigation principale' }))
    await user.click(nav.getByRole('button', { name: 'ORBIT STUDY' }))

    await user.type(screen.getByRole('textbox', { name: 'Nom du devoir' }), 'Réviser les fractions')
    await user.type(screen.getByRole('textbox', { name: 'Matière' }), 'Mathématiques')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(await screen.findByText('Réviser les fractions')).toBeInTheDocument()
    expect(await screen.findByRole('status')).toHaveTextContent('Devoir ajouté.')

    await user.click(screen.getByRole('button', { name: 'Marquer « Réviser les fractions » comme terminé' }))
    expect(await screen.findByText(/Terminés/)).toBeInTheDocument()
    await user.click(screen.getByText(/Terminés/))
    expect(await screen.findByRole('button', { name: 'Rouvrir « Réviser les fractions »' })).toBeInTheDocument()
  })

  it('explains that folder access requires the desktop app in a browser', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(within(screen.getByRole('navigation', { name: 'Navigation principale' })).getByRole('button', { name: 'DEV' }))
    await user.click(screen.getByRole('button', { name: 'Ouvrir un dossier' }))
    expect(screen.getByRole('status')).toHaveTextContent('disponible dans l’application desktop')
  })
})
