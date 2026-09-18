import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState('Loading workouts...')

  useEffect(() => {
    fetchCollection('/api/workouts').then(({ items }) => { setWorkouts(items); setStatus('') }).catch((error) => setStatus(error.message))
  }, [])

  return <section className="page-section"><div className="section-heading"><p className="eyebrow">Built for your level</p><h1>Workout library</h1><p>Pick a session that fits the energy you have today.</p></div>{status && <p className="status">{status}</p>}<div className="data-grid workout-grid">{workouts.map((workout) => <article className="data-card workout-card" key={workout._id || workout.id || workout.title}><div className="workout-meta"><span className="tag">{workout.fitnessLevel}</span><span>{workout.durationMinutes} min</span></div><h2>{workout.title}</h2><p>{workout.description}</p><strong className="activity-type">{workout.activityType}</strong></article>)}</div></section>
}
