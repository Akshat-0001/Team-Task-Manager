import { motion } from 'framer-motion'

const statConfig = [
  { key: 'totalTasks',     label: 'Total Tasks',  icon: '📋', border: 'border-indigo-500/20',  text: 'text-indigo-300'  },
  { key: 'completedTasks', label: 'Completed',    icon: '✅', border: 'border-emerald-500/20', text: 'text-emerald-300' },
  { key: 'inProgressTasks',label: 'In Progress',  icon: '🔄', border: 'border-violet-500/20',  text: 'text-violet-300'  },
  { key: 'overdueTasks',   label: 'Overdue',      icon: '⚠️', border: 'border-rose-500/20',    text: 'text-rose-300'    },
]

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((config, index) => (
        <motion.div
          key={config.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className={`glass rounded-2xl p-5 border ${config.border}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{config.icon}</span>
            <span className={`text-3xl font-bold ${config.text}`}>
              {stats?.[config.key] ?? 0}
            </span>
          </div>
          <p className="text-sm text-white/40 font-medium">{config.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
