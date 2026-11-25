import { useState, type ReactNode } from 'react'
import { DevPanel } from '../modules/dev/DevPanel'
import { StudyPanel } from '../modules/study/StudyPanel'

type Section = 'dashboard' | 'dev' | 'study' | 'account'
type Theme = 'dark' | 'light'

const sections: { id: Section; label: string; title: string; description: string }[] = [
  { id: 'dashboard', label: 'Accueil', title: 'Vue d’ensemble', description: 'Accède à tes espaces de travail.' },
  { id: 'dev', label: 'DEV', title: 'Projets locaux', description: 'Parcours les dossiers de projet enregistrés sur cet appareil.' },
  { id: 'study', label: 'STUDY', title: 'Devoirs', description: 'Ajoute tes prochaines échéances et suis leur avancement.' },
  { id: 'account', label: 'Compte', title: 'Compte', description: 'Les fonctions de compte ne sont pas encore configurées.' },
]

const themeKey = 'orbit.theme'

function readTheme(): Theme {
  try {
    return window.localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    code: <><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m14 4-4 16" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7M8 10h7" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    collapse: <path d="m15 18-6-6 6-6" />,
    expand: <path d="m9 18 6-6-6-6" />,
  }

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function sectionIcon(section: Section) {
  if (section === 'dashboard') return 'grid'
  if (section === 'dev') return 'code'
  if (section === 'study') return 'book'
  return 'user'
}

function ModulePanel({ section, onNavigate }: { section: Section; onNavigate: (next: Section) => void }) {
  if (section === 'dashboard') {
    return (
      <div className="home-layout">
        <section aria-labelledby="modules-title">
          <div className="section-heading">
            <div>
              <h2 id="modules-title">Espaces</h2>
              <p>Choisis ce sur quoi tu veux travailler.</p>
            </div>
          </div>
          <div className="module-list">
            <ModuleRow title="DEV" description="Dossiers et projets présents sur ton ordinateur." icon="code" status="Disponible" onClick={() => onNavigate('dev')} />
            <ModuleRow title="STUDY" description="Devoirs et échéances enregistrés sur cet appareil." icon="book" status="Disponible" onClick={() => onNavigate('study')} />
          </div>
        </section>
        <section className="local-notice" aria-label="Stockage local">
          <span className="local-indicator" />
          <div><strong>Mode local</strong><p>Les devoirs et préférences restent sur cet appareil. Aucun compte n’est connecté.</p></div>
        </section>
      </div>
    )
  }

  if (section === 'dev') return <DevPanel />
  if (section === 'study') return <StudyPanel />
  return <EmptyWorkspace title="Pas encore de compte" body="La connexion et la synchronisation ne sont pas encore disponibles. Tes devoirs restent enregistrés sur cet appareil." action="Retour à l’accueil" onAction={() => onNavigate('dashboard')} />
}

function ModuleRow({ title, description, icon, status, onClick }: { title: string; description: string; icon: string; status: string; onClick: () => void }) {
  return (
    <button className="module-row" onClick={onClick}>
      <span className="module-icon"><Icon name={icon} size={19} /></span>
      <span className="module-copy"><strong>{title}</strong><span>{description}</span></span>
      <span className="module-status">{status}</span>
      <Icon name="arrow" size={17} />
    </button>
  )
}

function EmptyWorkspace({ title, body, action, onAction }: { title: string; body: string; action: string; onAction: () => void }) {
  return (
    <section className="empty-workspace">
      <h2>{title}</h2>
      <p>{body}</p>
      <button className="button button-secondary" onClick={onAction}>{action}</button>
    </section>
  )
}

export function App() {
  const [active, setActive] = useState<Section>('dashboard')
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [collapsed, setCollapsed] = useState(false)
  const current = sections.find((section) => section.id === active) ?? sections[0]!

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      window.localStorage.setItem(themeKey, next)
    } catch {
      // Theme still works for this session when browser storage is unavailable.
    }
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
        <button className="brand" aria-label="ORBIT, aller à l’accueil" onClick={() => setActive('dashboard')}>
          <span className="brand-mark">O</span><span className="brand-name">ORBIT</span>
        </button>
        <div className="workspace-select"><span className="workspace-avatar">L</span><span className="workspace-info"><strong>Espace local</strong><small>Cet appareil</small></span></div>
        <span className="nav-caption">ESPACE</span>
        <nav className="main-nav" aria-label="Navigation principale">
          {sections.map((item) => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}><Icon name={sectionIcon(item.id)} size={17} /><span>{item.label}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sync-note"><span className="sync-indicator" /><div><strong>Enregistré localement</strong><small>Sur cet appareil</small></div></div>
          <div className="sidebar-footer"><span>ORBIT <span className="footer-version">0.1</span></span><button className="icon-button sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'}><Icon name={collapsed ? 'expand' : 'collapse'} size={17} /></button></div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>ORBIT</span><span className="breadcrumb-separator">/</span><span className="breadcrumb-current">{current.label}</span></div>
          <div className="topbar-actions"><span className="connection-state"><i /> Local</span><button className="icon-button theme-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button></div>
        </header>
        <main className="page-content">
          <div className="page-heading"><div><h1>{current.title}</h1><p>{current.description}</p></div></div>
          <ModulePanel section={active} onNavigate={setActive} />
          <footer className="page-footer"><span>ORBIT <b>·</b> Version 0.1</span><span>Les données restent sur cet appareil.</span></footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navigation mobile">{sections.map((item) => <button key={item.id} className={active === item.id ? 'selected' : ''} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}><Icon name={sectionIcon(item.id)} size={18} /><span>{item.label}</span></button>)}</nav>
    </div>
  )
}
