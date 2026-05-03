import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthConfirmPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => { confirmEmail() }, [])

  async function confirmEmail() {
    const code = new URLSearchParams(window.location.search).get('code')
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    try {
      let session = null

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error
        session = data.session
      } else if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        if (error) throw error
        session = data.session
      } else {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (!currentSession) throw new Error('Confirmation link is invalid or has expired.')
        session = currentSession
      }

      // For OAuth users (like GitHub), ensure profile exists
      if (session?.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()

        // Create profile if it doesn't exist (OAuth users)
        if (!existingProfile) {
          const name = session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name || 
                      session.user.email?.split('@')[0] || 
                      'User'
          
          const avatar_url = session.user.user_metadata?.avatar_url || null

          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            name: name,
            avatar_url: avatar_url,
          })
        }
      }

      setStatus('success')
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] relative overflow-hidden flex items-center justify-center px-4">

      {/* Subtle gradient overlay matching login page */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5 pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative">
          <div className="relative glass-strong rounded-2xl p-8 border border-white/10 shadow-2xl text-center">

            {status === 'verifying' && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Confirming your email</h1>
                <p className="text-white/50 text-sm">Just a moment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto mb-6"
                >
                  ✓
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">Email confirmed!</h1>
                <p className="text-white/50 text-sm mb-6">Taking you to your dashboard...</p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-indigo-400 via-white to-rose-400 rounded-full"
                  />
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mx-auto mb-6">
                  ✕
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Confirmation failed</h1>
                <p className="text-white/50 text-sm mb-6">{errorMessage}</p>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/signup')}
                    className="btn-primary w-full h-11 text-sm font-semibold"
                  >
                    Back to Sign Up
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/login')}
                    className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-lg font-medium text-sm transition-all duration-300"
                  >
                    Try Sign In
                  </motion.button>
                </div>
              </>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}
