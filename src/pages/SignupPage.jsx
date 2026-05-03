import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { registerUser, loginWithGithub } from '../services/authService'
import { SplineScene } from '../components/ui/splite'
import { Spotlight } from '../components/ui/spotlight'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    try {
      await registerUser(name, email, password)
      navigate('/check-email', { state: { email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGithubSignup() {
    setGithubLoading(true)
    setError('')
    try {
      await loginWithGithub()
    } catch (err) {
      setError(err.message)
      setGithubLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] relative overflow-hidden flex">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Left side - Signup Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gradient mb-1">Team Task Manager</h1>
            <p className="text-white/40 text-xs">Create your account to get started</p>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Create account</h2>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                      focusedInput === 'name' ? 'text-indigo-400' : 'text-white/40'
                    }`}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/10 text-white placeholder:text-white/30 h-10 rounded-lg pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Email</label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                      focusedInput === 'email' ? 'text-indigo-400' : 'text-white/40'
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/10 text-white placeholder:text-white/30 h-10 rounded-lg pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                      focusedInput === 'password' ? 'text-indigo-400' : 'text-white/40'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/10 text-white placeholder:text-white/30 h-10 rounded-lg pl-10 pr-12 text-sm outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 overflow-hidden"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-10 text-sm font-semibold mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0B0F19] px-3 text-white/40">Or continue with</span>
              </div>
            </div>

            {/* GitHub Sign Up */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGithubSignup}
              disabled={githubLoading}
              className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              {githubLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaGithub className="w-4 h-4" />
                  <span>Continue with GitHub</span>
                </>
              )}
            </motion.button>

            {/* Footer */}
            <p className="text-center text-xs text-white/40 mt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4">
            <Link
              to="/"
              className="text-xs text-white/30 hover:text-white/50 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right side - Spline 3D Robot */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="w-full h-full">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
