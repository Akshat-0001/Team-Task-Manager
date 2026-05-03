import { motion } from 'framer-motion'
import UserAvatar from './UserAvatar'

const priorityStyles = {
  High:   'bg-rose-500/15 text-rose-300 border-rose-500/25',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  Low:    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete, isAdmin, currentUserId }) {
  const isAssignedToMe = task.assigned_to === currentUserId
  const canChangeStatus = isAdmin || isAssignedToMe

  const statusOptions = ['To Do', 'In Progress', 'Done']
  const nextStatus = statusOptions[(statusOptions.indexOf(task.status) + 1) % statusOptions.length]

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done'

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.2, ease: 'easeOut' },
        opacity: { duration: 0.15 }
      }}
      className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-200 group"
    >
      {/* Priority badge + overdue warning */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {isOverdue && (
          <span className="text-xs text-red-400 font-medium">⚠ Overdue</span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-white text-sm font-semibold mb-1 leading-snug">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-slate-400 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Assignee & due date */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1.5">
          <UserAvatar
            avatarUrl={task.profiles?.avatar_url}
            name={task.profiles?.name}
            size={4}
          />
          <span>{task.profiles?.name ?? 'Unassigned'}</span>
        </div>
        {task.due_date && (
          <span className={isOverdue ? 'text-red-400' : ''}>
            📅 {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Move to next status — available to admin or the assigned user */}
        {canChangeStatus && (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/20 transition-colors"
          >
            → {nextStatus}
          </button>
        )}
        {/* Edit and delete — admin only */}
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="text-xs py-1.5 px-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              title="Edit task"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-xs py-1.5 px-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Delete task"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
