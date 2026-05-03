import { supabase } from '../lib/supabase'

export async function fetchTasksByProject(projectId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, profiles(id, name, email, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTask(taskData) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTaskStatus(taskId, status) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
}

export async function fetchDashboardStats(userId) {
  const { data: memberships, error: memberError } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId)

  if (memberError) throw memberError

  const projectIds = memberships?.map(m => m.project_id) ?? []

  if (projectIds.length === 0) {
    return { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, overdueTasks: 0, allProjectTasks: [] }
  }

  const { data: allProjectTasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*, profiles(id, name, avatar_url)')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })

  if (tasksError) throw tasksError

  const today = new Date().toISOString().split('T')[0]

  return {
    totalTasks: allProjectTasks.length,
    completedTasks: allProjectTasks.filter(t => t.status === 'Done').length,
    inProgressTasks: allProjectTasks.filter(t => t.status === 'In Progress').length,
    overdueTasks: allProjectTasks.filter(t => t.due_date && t.due_date < today && t.status !== 'Done').length,
    allProjectTasks,
  }
}
