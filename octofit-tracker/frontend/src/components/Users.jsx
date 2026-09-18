import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('Loading users...')

  useEffect(() => {
    fetchCollection('/api/users')
      .then(({ items }) => { setUsers(items); setStatus('') })
      .catch((error) => setStatus(error.message))
  }, [])

  return (
    <section className="page-section">
      <div className="section-heading"><p className="eyebrow">Community</p><h1>Members</h1><p>Find your training crew and see where everyone is starting.</p></div>
      {status && <p className="status">{status}</p>}
      <div className="data-grid">
        {users.map((user) => <article className="data-card" key={user._id || user.id || user.username}><span className="avatar">{(user.displayName || user.username || '?').slice(0, 1).toUpperCase()}</span><div><h2>{user.displayName || user.username}</h2><p>@{user.username}</p><span className="tag">{user.fitnessLevel || 'beginner'}</span></div></article>)}
      </div>
    </section>
  )
}
