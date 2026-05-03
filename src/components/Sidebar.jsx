import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import UserAvatar from './UserAvatar'
import EditProfileModal from './EditProfileModal'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⚡' },
  { label: 'Projects', path: '/projects', icon: '📁' },
]

export default function Sidebar() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [showEditProfile, setShowEditProfile] = useState(false)

  async function handleLogout() {
    await logoutUser()
    navigate('/')
  }

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 border-r border-white/[0.06]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <span className="text-base font-bold text-gradient">Team Task Manager</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User profile card */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200 group"
          >
            <UserAvatar avatarUrl={profile?.avatar_url} name={profile?.name} size={8} />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate group-hover:text-indigo-200 transition-colors">
                {profile?.name}
              </p>
              <p className="text-xs text-white/30 truncate">{profile?.email}</p>
            </div>
            <span className="text-white/20 group-hover:text-indigo-400 transition-colors text-xs">✎</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-xs text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
          >
            Sign out →
          </button>
        </div>
      </motion.aside>

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
    </>
  )
}
