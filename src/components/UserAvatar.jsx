// Reusable avatar component — shows the selected avatar image,
// or falls back to the user's initial letter in a gradient circle.
export default function UserAvatar({ avatarUrl, name, size = 8 }) {
  // Map size prop to actual Tailwind classes
  const sizeClasses = {
    4: 'w-4 h-4',
    5: 'w-5 h-5',
    6: 'w-6 h-6',
    8: 'w-8 h-8',
    10: 'w-10 h-10',
    12: 'w-12 h-12',
    16: 'w-16 h-16',
  }
  
  const sizeClass = sizeClasses[size] || 'w-8 h-8'
  const initial = name?.charAt(0).toUpperCase() ?? '?'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center text-xs font-bold text-white shrink-0`}>
      {initial}
    </div>
  )
}
