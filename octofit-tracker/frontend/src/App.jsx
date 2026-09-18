import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

const navigation = [
  ['/', 'Overview'],
  ['/activities', 'Activity'],
  ['/leaderboard', 'Leaderboard'],
  ['/teams', 'Teams'],
  ['/users', 'Members'],
  ['/workouts', 'Workouts'],
]

function Overview() {
  return <section className="overview"><p className="eyebrow">Octofit tracker</p><h1>Make movement<br /><em>your daily ritual.</em></h1><p className="lede">A focused space for logging the work, finding your people, and keeping your momentum visible.</p><div className="overview-links">{navigation.slice(1, 4).map(([path, label]) => <NavLink className="overview-link" to={path} key={path}><span>{label}</span><span aria-hidden="true">↗</span></NavLink>)}</div></section>
}

export default function App() {
  return <div className="app-shell"><header className="topbar"><NavLink className="brand" to="/"><span className="brand-mark">O</span><span>octofit</span></NavLink><nav aria-label="Primary navigation">{navigation.map(([path, label]) => <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end={path === '/'} to={path} key={path}>{label}</NavLink>)}</nav></header><main><Routes><Route path="/" element={<Overview />} /><Route path="/activities" element={<Activities />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/teams" element={<Teams />} /><Route path="/users" element={<Users />} /><Route path="/workouts" element={<Workouts />} /></Routes></main><footer><span>Octofit / 2026</span><span>Train with intention.</span></footer></div>
}
