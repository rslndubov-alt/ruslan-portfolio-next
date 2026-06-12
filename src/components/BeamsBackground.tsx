'use client'

import dynamic from 'next/dynamic'

// Dynamic import disables SSR — Three.js requires browser APIs
const Beams = dynamic(
  () => import('@/components/ui/ethereal-beams').then(m => m.Beams),
  { ssr: false, loading: () => <div className="w-full h-full bg-black" /> },
)

/**
 * BeamsBackground — fixed full-screen 3D animated beams.
 * Replaces the SVG ornament as the global site background.
 * Tuned to be dark and subtle so content remains readable.
 */
export default function BeamsBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.45,  // subtle — content sits above this
      }}
    >
      <Beams
        beamWidth={1.8}
        beamHeight={20}
        beamNumber={10}
        lightColor="#aaaaaa"
        speed={1.5}
        noiseIntensity={1.4}
        scale={0.13}
        rotation={40}
      />
    </div>
  )
}
