import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const AVATARS = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg',
  '/avatars/avatar7.svg',
  '/avatars/avatar8.svg',
  '/avatars/avatar9.svg',
  '/avatars/avatar10.svg',
  // avatar11 removed
  '/avatars/avatar12.svg',
  '/avatars/avatar13.svg',
  '/avatars/avatar14.svg',
  '/avatars/avatar15.svg',
  '/avatars/avatar16.svg',
  '/avatars/avatar17.svg',
]

export default function EditProfileModal({ onClose }) {
  const { user, profile, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.name ?? '')
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const sliderRef = useRef(null)

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Name cannot be empty')
    setLoading(true)
    setError('')

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: name.trim(), avatar_url: selectedAvatar || null })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    await refreshProfile()
    onClose()
  }

  function scrollLeft() {
    sliderRef.current?.scrollBy({ left: -180, behavior: 'smooth' })
  }

  function scrollRight() {
    sliderRef.current?.scrollBy({ left: 180, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Avatar preview + name input */}
          <div className="flex items-center gap-4">
            {/* Live preview of selected avatar */}
            <div className="relative shrink-0">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#030303]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#030303]">
                  {name.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border-2 border-[#030303] flex items-center justify-center text-xs text-white">
                ✎
              </div>
            </div>

            {/* Name input */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="input-field"
              />
            </div>
          </div>

          {/* Avatar picker */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-3">Choose Avatar</label>

            {/* Slider with left/right arrow buttons */}
            <div className="flex items-center gap-2 overflow-y-visible">

              {/* Left arrow */}
              <button
                type="button"
                onClick={scrollLeft}
                className="shrink-0 w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
              >
                ‹
              </button>

              {/* Scrollable avatar strip — overflow-y visible so scale effect isn't clipped */}
              <div
                ref={sliderRef}
                className="flex gap-2.5 overflow-x-auto overflow-y-visible flex-1 py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* "No avatar" — initial letter option */}
                <button
                  type="button"
                  onClick={() => setSelectedAvatar('')}
                  className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center text-base font-bold text-white transition-all duration-150 ${
                    selectedAvatar === ''
                      ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#030303] scale-110'
                      : 'opacity-50 hover:opacity-80 hover:scale-105'
                  }`}
                >
                  {name.charAt(0).toUpperCase() || '?'}
                </button>

                {/* Avatar images */}
                {AVATARS.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedAvatar(src)}
                    className={`shrink-0 w-12 h-12 rounded-full overflow-hidden transition-all duration-150 ${
                      selectedAvatar === src
                        ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#030303] scale-110'
                        : 'opacity-60 hover:opacity-90 hover:scale-105'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Avatar ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              <button
                type="button"
                onClick={scrollRight}
                className="shrink-0 w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
              >
                ›
              </button>

            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
