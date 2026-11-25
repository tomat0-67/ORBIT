import { useState, type ReactNode } from 'react'
import { DevPanel } from '../modules/dev/DevPanel'
import { StudyPanel } from '../modules/study/StudyPanel'

type Section = 'dashboard' | 'dev' | 'study' | 'account'
type Theme = 'dark' | 'light'

const sections: { id: Section; label: string; eyebrow: string; title: string; description: string }[] = [
  { id: 'dashboard', label: 'Accueil', eyebrow: 'Ton espace', title: 'Tout commence ici.', description: 'Retrouve tes espaces et reprends ton travail là où tu en as besoin.' },
  { id: 'dev', label: 'ORBIT DEV', eyebrow: 'Environnement de développement', title: 'Tes projets, au même endroit.', description: 'Ouvre un dossier local pour consulter les éléments de ton projet.' },
  { id: 'study', label: 'ORBIT STUDY', eyebrow: 'Organisation scolaire', title: 'Une place pour apprendre.', description: 'Garde tes prochaines étapes scolaires à portée de main.' },
  { id: 'account', label: 'Compte', eyebrow: 'Compte ORBIT', title: 'Ton compte ORBIT.', description: 'Le profil et les préférences de compte seront disponibles après la mise en place de l’authentification.' },
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
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    code: <><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m14 4-4 16" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7M8 10h7" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    collapse: <path d="m15 18-6-6 6-6" />,
    expand: <path d="m9 18 6-6-6-6" />,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></>,
  }

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function ModulePanel({ section, onNavigate }: { section: Section; onNavigate: (next: Section) => void }) {
  if (section === 'dashboard') {
    return (
      <>
        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="kicker">Ton point de départ</span>
            <h2>Un espace pour<br /><em>chaque idée.</em></h2>
            <p>ORBIT rassemble tes projets et ton organisation dans un espace simple, pensé pour avancer.</p>
            <button className="button button-primary" onClick={() => onNavigate('dev')}>Découvrir ORBIT DEV <Icon name="arrow" size={16} /></button>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="orbit orbit-outer" /><div className="orbit orbit-inner" /><div className="orbit-center"><span>O</span></div>
            <span className="orbit-dot dot-top" /><span className="orbit-dot dot-side" /><span className="orbit-dot dot-low" />
          </div>
          <div className="welcome-index"><span>01</span><span className="index-line" /><span>04</span></div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="kicker">Tes espaces</span><h3>Choisis ton terrain.</h3></div><span className="section-note">Un seul compte, plusieurs façons d’avancer.</span></div>
          <div className="space-grid">
            <SpaceCard number="01" title="ORBIT DEV" description="Un environnement pour tes projets et ton code." icon="code" tone="coral" onClick={() => onNavigate('dev')} />
            <SpaceCard number="02" title="ORBIT STUDY" description="Tes cours, tes matières et tes prochaines étapes." icon="book" tone="blue" onClick={() => onNavigate('study')} />
          </div>
        </section>

        <section className="setup-banner"><div className="setup-icon"><Icon name="sparkle" size={19} /></div><div><strong>Le socle est prêt à grandir.</strong><span>Les fonctions en ligne viendront après la configuration des comptes et des permissions.</span></div><span className="local-badge"><i /> Mode local</span></section>
      </>
    )
  }

  if (section === 'dev') {
    return <DevPanel />
  }
  if (section === 'study') {
    return <StudyPanel />
  }
  return <EmptyWorkspace icon="user" title="Aucun compte connecté." body="L’authentification n’est pas encore configurée. Pour l’instant, tes préférences de thème restent enregistrées sur cet appareil." action="Retour à l’overview" onAction={() => onNavigate('dashboard')} />
}

function SpaceCard({ number, title, description, icon, tone, onClick }: { number: string; title: string; description: string; icon: string; tone: string; onClick: () => void }) {
  return <button className={`space-card ${tone}`} onClick={onClick}><span className="card-number">{number} <span>—</span> ESPACE</span><span className="card-icon"><Icon name={icon} size={20} /></span><span className="card-title">{title}</span><span className="card-description">{description}</span><span className="card-action">Ouvrir l’espace <Icon name="arrow" size={15} /></span></button>
}

function EmptyWorkspace({ icon, title, body, action, onAction }: { icon: string; title: string; body: string; action: string; onAction: () => void }) {
  return <section className="empty-workspace"><div className="empty-mark"><Icon name={icon} size={24} /></div><span className="kicker">En préparation</span><h2>{title}</h2><p>{body}</p><button className="button button-secondary" onClick={onAction}>{action}</button></section>
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
        <button className="brand" aria-label="ORBIT, aller à l’overview" onClick={() => setActive('dashboard')}><span className="brand-mark">O</span><span className="brand-name">ORBIT<span className="brand-period">.</span></span></button>
        <div className="workspace-select"><span className="workspace-avatar">E</span><span className="workspace-info"><strong>Aperçu personnel</strong><small>Configuration locale</small></span></div>
        <span className="nav-caption">ESPACE DE TRAVAIL</span>
        <nav className="main-nav" aria-label="Navigation principale">
          {sections.map((item) => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} aria-label={item.label} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}><Icon name={item.id === 'dashboard' ? 'grid' : item.id === 'dev' ? 'code' : item.id === 'study' ? 'book' : 'user'} size={17} /><span>{item.label}</span>{item.id === 'dashboard' && <span className="nav-live" />}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="sync-note"><span className="sync-indicator" /><div><strong>Préférences enregistrées</strong><small>Sur cet appareil</small></div></div><div className="sidebar-footer"><span>ORBIT <span className="footer-version">v0.1</span></span><button className="icon-button sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'}><Icon name={collapsed ? 'expand' : 'collapse'} size={17} /></button><button className="icon-button sidebar-theme" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button></div></div>
      </aside>

      <div className="main-area">
        <header className="topbar"><div className="breadcrumbs"><span>ORBIT</span><span className="breadcrumb-separator">/</span><span className="breadcrumb-current">{current.label}</span></div><div className="topbar-actions"><span className="connection-state"><i /> Aucun service connecté</span><button className="icon-button theme-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button><button className="profile-button" onClick={() => setActive('account')} aria-label="Ouvrir le compte"><span>E</span></button></div></header>
        <main className="page-content">
          <div className="page-heading"><div><span className="kicker">{current.eyebrow}</span><h1>{current.title}</h1><p>{current.description}</p></div><span className="date-chip"><span className="date-dot" />{new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace('.', '')}</span></div>
          <ModulePanel section={active} onNavigate={setActive} />
          <footer className="page-footer"><span>Fait pour les idées qui prennent forme.</span><span>ORBIT <b>•</b> Un projet à la fois.</span></footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navigation mobile">{sections.map((item) => <button key={item.id} className={active === item.id ? 'selected' : ''} aria-current={active === item.id ? 'page' : undefined} onClick={() => setActive(item.id)}><Icon name={item.id === 'dashboard' ? 'grid' : item.id === 'dev' ? 'code' : item.id === 'study' ? 'book' : 'user'} size={18} /><span>{item.label === 'Accueil' ? 'Accueil' : item.label.replace('ORBIT ', '')}</span></button>)}</nav>
    </div>
  )
}
