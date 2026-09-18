import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('Loading teams...')

  useEffect(() => {
    fetchCollection('teams').then(({ items }) => { setTeams(items); setStatus('') }).catch((error) => setStatus(error.message))
  }, [])

  return <section className="page-section"><div className="section-heading"><p className="eyebrow">Together is better</p><h1>Teams</h1><p>See who is training together and find your next challenge.</p></div>{status && <p className="status">{status}</p>}<div className="data-grid">{teams.map((team) => <article className="data-card team-card" key={team._id || team.id || team.name}><div className="team-mark">{(team.name || 'T').slice(0, 1).toUpperCase()}</div><div><h2>{team.name}</h2><p>{Array.isArray(team.memberIds) ? team.memberIds.length : 0} members</p></div></article>)}</div></section>
}
