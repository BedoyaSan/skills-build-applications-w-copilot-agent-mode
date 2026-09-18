import { useEffect, useState } from 'react'
import { fetchCollection, formatDate } from '../api'

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('Loading activity...')

  useEffect(() => {
    fetchCollection('activities')
      .then(({ items }) => { setActivities(items); setStatus('') })
      .catch((error) => setStatus(error.message))
  }, [])

  return (
    <section className="page-section"><div className="section-heading"><p className="eyebrow">Momentum</p><h1>Activity feed</h1><p>Every session counts. Keep an eye on the latest wins.</p></div>
      {status && <p className="status">{status}</p>}
      <div className="list-panel">{activities.map((activity) => { const user = activity.userId && typeof activity.userId === 'object' ? activity.userId : null; return <article className="list-row" key={activity._id || activity.id}><div><strong>{activity.type || 'Workout'}</strong><p>{user?.displayName || user?.username || 'Team member'} · {formatDate(activity.completedAt)}</p></div><span className="metric">{activity.points ?? 0}<small> pts</small></span></article> })}</div>
    </section>
  )
}
