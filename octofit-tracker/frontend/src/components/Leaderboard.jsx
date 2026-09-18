import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [status, setStatus] = useState('Loading leaderboard...')

  useEffect(() => {
    fetchCollection('leaderboard')
      .then(({ items }) => { setLeaders(items); setStatus('') })
      .catch((error) => setStatus(error.message))
  }, [])

  return <section className="page-section"><div className="section-heading"><p className="eyebrow">All time</p><h1>Leaderboard</h1><p>A little friendly pressure for your next session.</p></div>{status && <p className="status">{status}</p>}<div className="list-panel">{leaders.map((leader, index) => <article className="list-row rank-row" key={leader.userId || leader._id || index}><span className={`rank rank-${index + 1}`}>{index + 1}</span><div><strong>{leader.displayName || leader.username || 'Athlete'}</strong><p>{leader.activities ?? 0} activities</p></div><span className="metric">{leader.points ?? 0}<small> pts</small></span></article>)}</div></section>
}
