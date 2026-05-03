import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function ProjectCard({ project, taskCounts = {} }) {
  const navigate = useNavigate()
  const total = (taskCounts.todo ?? 0) + (taskCounts.inProgress ?? 0) + (taskCounts.done ?? 0)
  const progress = total > 0 ? Math.round((taskCounts.done / total) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="glass rounded-2xl p-6 cursor-pointer border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 group"
    >
      {/* Name & role badge */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-semibold text-base group-hover:text-indigo-200 transition-colors">
          {project.name}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
          project.userRole === 'admin'
            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
            : 'bg-white/5 text-white/40 border border-white/10'
        }`}>
          {project.userRole}
        </span>
      </div>

      {/* Description */}
      <p className="text-white/30 text-sm mb-5 line-clamp-2">
        {project.description || 'No description provided.'}
      </p>

      {/* Task counts */}
      <div className="flex gap-3 mb-4 text-xs">
        <span className="text-white/30">{taskCounts.todo ?? 0} to do</span>
        <span className="text-violet-400">{taskCounts.inProgress ?? 0} in progress</span>
        <span className="text-emerald-400">{taskCounts.done ?? 0} done</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #a5b4fc, #ffffff, #fda4af)' }}
        />
      </div>
      <p className="text-xs text-white/20 mt-1.5">{progress}% complete</p>
    </motion.div>
  )
}
