import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchDashboardStats } from '../services/taskService'
import DashboardStats from '../components/DashboardStats'
import UserAvatar from '../components/UserAvatar'

const statusColors = {
  'To Do':       'bg-white/5 text-white/40 border-white/10',
  'In Progress': 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'Done':        'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
}

const priorityColors = {
  High:   'text-rose-400',
  Medium: 'text-amber-400',
  Low:    'text-emerald-400',
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchDashboardStats(user.id)
      .then(setStats)
      .catch(err => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false))
  }, [user])

  // Group all project tasks by assigned user name for the tasks-per-user widget
  const tasksPerUser = Object.values(
    (stats?.allProjectTasks ?? []).reduce((acc, task) => {
      const name = task.profiles?.name ?? 'Unassigned'
      if (!acc[name]) acc[name] = { name, avatarUrl: task.profiles?.avatar_url ?? null, total: 0, done: 0 }
      acc[name].total++
      if (task.status === 'Done') acc[name].done++
      return acc
    }, {})
  ).sort((a, b) => b.total - a.total).slice(0, 6)

  const recentTasks = stats?.allProjectTasks?.slice(0, 8) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good morning, {profile?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening across your projects</p>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          View Projects
        </button>
      </motion.div>

      {/* Stat cards: total, completed, in progress, overdue */}
      <DashboardStats stats={stats} />

      {/* Bottom row: recent tasks list + tasks per user breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5"
        >
          <h2 className="text-base font-semibold text-white mb-4">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks yet. Create a project to get started.</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {task.profiles?.name ?? 'Unassigned'} · {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tasks per user */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h2 className="text-base font-semibold text-white mb-4">Tasks per User</h2>
          {tasksPerUser.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {tasksPerUser.map(({ name, avatarUrl, total, done }) => {
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar avatarUrl={avatarUrl} name={name} size={6} />
                        <span className="text-sm text-slate-300 truncate max-w-28">{name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{done}/{total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, #a5b4fc, #ffffff, #fda4af)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
