import { Suspense, lazy, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Preloader component that loads Spline in the background
export function SplinePreloader() {
  useEffect(() => {
    // Preload the Spline library
    import('@splinetool/react-spline')
  }, [])
  
  return null
}

export function SplineScene({ scene, className = '' }) {
  return (
    <Suspense fallback={<div className="w-full h-full bg-[#030303]" />}>
      <Spline 
        scene={scene} 
        className={className}
      />
    </Suspense>
  )
}
