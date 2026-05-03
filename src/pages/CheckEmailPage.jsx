import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CheckEmailPage() {
  const location = useLocation()
  const email = location.state?.email ?? ''
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')

  async function handleResend() {
    if (!email) return
    setResending(true)
    setError('')
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email })
    if (resendError) setError(resendError.message)
    else setResent(true)
    setResending(false)
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center px-4">

      {/* Same purple gradient background as login */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
      />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="relative group">
          {/* Traveling light beam border */}
          <div className="absolute -inset-px rounded-2xl overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-0.5 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              animate={{ left: ['-50%', '100%'] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              className="absolute top-0 right-0 h-1/2 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              animate={{ top: ['-50%', '100%'] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.6 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-0.5 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              animate={{ right: ['-50%', '100%'] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-1/2 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              animate={{ bottom: ['-50%', '100%'] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.8 }}
            />
          </div>

          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mx-auto mb-5"
            >
              ✉️
            </motion.div>

            <h1 className="text-xl font-bold text-white mb-1">Check your email</h1>
            <p className="text-white/50 text-xs mb-1">We sent a confirmation link to</p>
            {email && <p className="text-indigo-300 font-semibold text-sm mb-4">{email}</p>}
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              Click the link to activate your account, then come back to sign in.
            </p>

            {/* Steps */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-6 text-left space-y-3">
              {[
                { n: '1', text: 'Open your email inbox' },
                { n: '2', text: 'Click the confirmation link from Team Task Manager' },
                { n: '3', text: "You'll be redirected back and signed in automatically" },
              ].map(item => (
                <div key={item.n} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                    {item.n}
                  </div>
                  <p className="text-xs text-white/60">{item.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/login"
              className="btn-primary w-full py-2.5 text-sm block mb-3"
            >
              Go to Sign In →
            </Link>

            {email && (
              <div>
                {resent ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-xs">
                    ✓ Confirmation email resent
                  </motion.p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    {resending ? 'Resending...' : "Didn't receive it? Resend email"}
                  </button>
                )}
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
