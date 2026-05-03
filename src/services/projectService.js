import { supabase } from '../lib/supabase'

export async function createProject(name, description, userId) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ name, description, created_by: userId })
    .select()
    .single()

  if (projectError) throw projectError

  const { error: memberError } = await supabase
    .from('project_members')
    .insert({ project_id: project.id, user_id: userId, role: 'admin' })

  if (memberError) throw memberError

  return project
}

export async function fetchUserProjects(userId) {
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      role,
      projects (
        id,
        name,
        description,
        created_by,
        created_at
      )
    `)
    .eq('user_id', userId)

  if (error) throw error

  return data.map(item => ({ ...item.projects, userRole: item.role }))
}

export async function fetchProjectById(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw error
  return data
}

export async function fetchProjectMembers(projectId) {
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      id,
      role,
      profiles (
        id,
        name,
        email,
        avatar_url
      )
    `)
    .eq('project_id', projectId)

  if (error) throw error
  return data.map(item => ({ ...item.profiles, membershipId: item.id, role: item.role }))
}

export async function addMemberToProject(projectId, email, role = 'member') {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (profileError) throw new Error('User not found with that email')

  const { error } = await supabase
    .from('project_members')
    .insert({ project_id: projectId, user_id: profile.id, role })

  if (error) throw error
}

export async function removeMemberFromProject(membershipId) {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('id', membershipId)

  if (error) throw error
}

export async function getUserRoleInProject(projectId, userId) {
  const { data, error } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data.role
}
