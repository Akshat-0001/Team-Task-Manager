import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchProjectById, fetchProjectMembers, getUserRoleInProject, removeMemberFromProject } from '../services/projectService'
import { fetchTasksByProject, updateTaskStatus, deleteTask } from '../services/taskService'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'
import EditTaskModal from '../components/EditTaskModal'
import EditProjectModal from '../components/EditProjectModal'
import AddMemberModal from '../components/AddMemberModal'
import UserAvatar from '../components/UserAvatar'

const columns = ['To Do', 'In Progress', 'Done']

const columnStyles = {
  'To Do':      { border: 'border-white/[0.06]',    header: 'text-white/50',   dot: 'bg-white/30'    },
  'In Progress':{ border: 'border-violet-500/20',   header: 'text-violet-300', dot: 'bg-violet-400'  },
  'Done':       { border: 'border-emerald-500/20',  header: 'text-emerald-300',dot: 'bg-emerald-400' },
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [editingTask, setEditingTask] = useState(null) // holds the task being edited
  const [memberToRemove, setMemberToRemove] = useState(null) // holds member pending removal confirmation

  useEffect(() => {
    if (!user || !projectId) return
    loadProjectData()
  }, [user, projectId])

  async function loadProjectData() {
    try {
      const [projectData, projectTasks, projectMembers, role] = await Promise.all([
        fetchProjectById(projectId),
        fetchTasksByProject(projectId),
        fetchProjectMembers(projectId),
        getUserRoleInProject(projectId, user.id),
      ])
      setProject(projectData)
      setTasks(projectTasks)
      setMembers(projectMembers)
      setUserRole(role)
    } catch (err) {
      console.error('Project details load error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      await updateTaskStatus(taskId, newStatus)
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Delete task error:', err)
    }
  }

  async function handleRemoveMember(membershipId) {
    try {
      await removeMemberFromProject(membershipId)
      setMembers(prev => prev.filter(m => m.membershipId !== membershipId))
      setMemberToRemove(null)
    } catch (err) {
      console.error('Remove member error:', err)
    }
  }

  function handleTaskCreated(newTask) {
    setTasks(prev => [newTask, ...prev])
    loadProjectData() // reload to get profile data on the new task
  }

  function handleTaskUpdated(updatedTask) {
    // Replace the old task in state with the updated one
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  function handleProjectUpdated(updatedProject) {
    // Update the project in state
    setProject(updatedProject)
  }

  const isAdmin = userRole === 'admin'
  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col] = tasks.filter(t => t.status === col)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return <div className="text-slate-400 text-center py-20">Project not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isAdmin ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-white/5 text-white/40 border border-white/10'
            }`}>
              {userRole}
            </span>
            {isAdmin && (
              <button
                onClick={() => setShowEditProject(true)}
                className="text-white/40 hover:text-indigo-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                title="Edit project"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
          {project.description && (
            <p className="text-slate-400 text-sm">{project.description}</p>
          )}
        </div>

        <div className="flex gap-3">
          {isAdmin && (
            <button onClick={() => setShowAddMember(true)} className="btn-secondary text-sm">
              + Add Member
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setShowCreateTask(true)} className="btn-primary text-sm">
              + New Task
            </button>
          )}
        </div>
      </motion.div>

      {/* Members strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/5"
      >
        <span className="text-xs text-slate-500 font-medium">MEMBERS</span>
        <div className="flex items-center gap-2 flex-wrap">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-2 glass rounded-full px-3 py-1 border border-white/5">
              <UserAvatar avatarUrl={member.avatar_url} name={member.name} size={5} />
              <span className="text-xs text-slate-300">{member.name}</span>
              <span className={`text-xs ${member.role === 'admin' ? 'text-indigo-400' : 'text-white/30'}`}>
                {member.role}
              </span>
              {isAdmin && member.id !== user.id && (
                <button
                  onClick={() => setMemberToRemove(member)}
                  className="text-slate-600 hover:text-red-400 transition-colors ml-1 text-xs"
                  title="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((column, colIndex) => {
          const style = columnStyles[column]
          const columnTasks = tasksByStatus[column]

          return (
            <motion.div
              key={column}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className={`glass rounded-2xl p-4 border ${style.border} min-h-96`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <h3 className={`text-sm font-semibold ${style.header}`}>{column}</h3>
                </div>
                <span className="text-xs text-slate-500 glass rounded-full px-2 py-0.5 border border-white/5">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                      isAdmin={isAdmin}
                      currentUserId={user.id}
                    />
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-sm">
                    No tasks here
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modals */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          members={members}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={loadProjectData}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          members={members}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Edit project modal */}
      {showEditProject && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditProject(false)}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {/* Remove member confirmation */}
      {memberToRemove && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setMemberToRemove(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white mb-3">Remove Member?</h2>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to remove <span className="text-white font-medium">{memberToRemove.name}</span> from this project? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setMemberToRemove(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(memberToRemove.membershipId)}
                className="flex-1 bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/20 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
