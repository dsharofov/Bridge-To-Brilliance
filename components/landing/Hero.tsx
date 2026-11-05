'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

function FloatingOrb({ size, x, y, delay, duration, color }: { size: number; x: string; y: string; delay: number; duration: number; color: string }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        left: x,
        top: y,
        filter: 'blur(2px)',
        willChange: 'transform, opacity',
      }}
      animate={{
        y: [0, -35, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function Star({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
      }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function ComplexBridgeSVG() {
  const towerX1 = 140
  const towerX2 = 460
  const towerTop = 30
  const towerBottom = 240
  const deckY = 195
  const anchorX1 = 20
  const anchorX2 = 580

  const quadY = (y0: number, y1: number, y2: number, t: number) =>
    (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2

  const mid1X = (anchorX1 + towerX1) / 2
  const mid2X = (towerX1 + towerX2) / 2
  const mid3X = (towerX2 + anchorX2) / 2
  const sag1 = towerTop + 65
  const sag2 = towerTop + 90
  const sag3 = towerTop + 65

  // Generate multi-tier hangers
  const hangers = []
  for (let x = 40; x < 565; x += 15) {
    let cableY: number
    if (x <= towerX1) {
      const t = (x - anchorX1) / (towerX1 - anchorX1)
      cableY = quadY(deckY, sag1, towerTop, t)
    } else if (x <= towerX2) {
      const t = (x - towerX1) / (towerX2 - towerX1)
      cableY = quadY(towerTop, sag2, towerTop, t)
    } else {
      const t = (x - towerX2) / (anchorX2 - towerX2)
      cableY = quadY(towerTop, sag3, deckY, t)
    }
    if (cableY < deckY - 10) {
      hangers.push({ x, y: cableY })
    }
  }

  const mainCablePath = `M${anchorX1} ${deckY} Q${mid1X} ${sag1}, ${towerX1} ${towerTop} Q${mid2X} ${sag2}, ${towerX2} ${towerTop} Q${mid3X} ${sag3}, ${anchorX2} ${deckY}`

  return (
    <motion.svg
      viewBox="0 0 600 300"
      style={{ width: '100%', maxWidth: '560px', height: 'auto', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      <defs>
        <linearGradient id="deepWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(14, 165, 233, 0.15)" />
          <stop offset="50%" stopColor="rgba(37, 99, 235, 0.08)" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0.6)" />
        </linearGradient>
        <linearGradient id="towerMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="cyanBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Moon / Energy Core Glow behind center */}
      <circle cx="300" cy={deckY - 40} r="110" fill="url(#moonGlow)" />
      
      {/* Water Body & Reflection Foundation */}
      <rect x="0" y={deckY + 15} width="600" height="90" fill="url(#deepWater)" rx="4" />
      <ellipse cx="300" cy={deckY + 20} rx="290" ry="6" fill="rgba(56, 189, 248, 0.15)" />
      
      {/* Water Ripple Lines */}
      {[0, 1, 2, 3].map(i => (
        <motion.line key={`water-line-${i}`}
          x1={40 + i * 20} y1={deckY + 35 + i * 12} x2={560 - i * 20} y2={deckY + 35 + i * 12}
          stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1"
          animate={{ x1: [40 + i * 20, 60 + i * 20, 40 + i * 20], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Complex Foundation Piers */}
      <polygon points={`${towerX1 - 25},${deckY + 20} ${towerX1 + 25},${deckY + 20} ${towerX1 + 18},${deckY} ${towerX1 - 18},${deckY}`} fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <polygon points={`${towerX2 - 25},${deckY + 20} ${towerX2 + 25},${deckY + 20} ${towerX2 + 18},${deckY} ${towerX2 - 18},${deckY}`} fill="#1E293B" stroke="#334155" strokeWidth="1" />

      {/* --- TOWER 1 (Complex Truss System) --- */}
      <g>
        {/* Left Leg */}
        <rect x={towerX1 - 14} y={towerTop} width="10" height={deckY - towerTop} fill="url(#towerMetal)" stroke="#475569" strokeWidth="0.7" />
        {/* Right Leg */}
        <rect x={towerX1 + 4} y={towerTop} width="10" height={deckY - towerTop} fill="url(#towerMetal)" stroke="#475569" strokeWidth="0.7" />
        
        {/* Cross Bracing X-Webbing */}
        {Array.from({ length: 7 }, (_, i) => {
          const yPos = towerTop + 20 + i * 26
          if (yPos < deckY - 10) {
            return (
              <g key={`truss-1-${i}`}>
                <line x1={towerX1 - 14} y1={yPos} x2={towerX1 + 14} y2={yPos + 22} stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
                <line x1={towerX1 + 14} y1={yPos} x2={towerX1 - 14} y2={yPos + 22} stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
                <line x1={towerX1 - 14} y1={yPos + 11} x2={towerX1 + 14} y2={yPos + 11} stroke="#64748B" strokeWidth="1" />
              </g>
            )
          }
          return null
        })}

        {/* Tower Top Pinnacle & Beacon */}
        <polygon points={`${towerX1 - 18},${towerTop} ${towerX1},${towerTop - 18} ${towerX1 + 18},${towerTop}`} fill="url(#cyanBeam)" />
        <motion.circle cx={towerX1} cy={towerTop - 22} r="3.5" fill="#38BDF8" filter="url(#neonGlow)"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </g>

      {/* --- TOWER 2 (Complex Truss System) --- */}
      <g>
        {/* Left Leg */}
        <rect x={towerX2 - 14} y={towerTop} width="10" height={deckY - towerTop} fill="url(#towerMetal)" stroke="#475569" strokeWidth="0.7" />
        {/* Right Leg */}
        <rect x={towerX2 + 4} y={towerTop} width="10" height={deckY - towerTop} fill="url(#towerMetal)" stroke="#475569" strokeWidth="0.7" />
        
        {/* Cross Bracing X-Webbing */}
        {Array.from({ length: 7 }, (_, i) => {
          const yPos = towerTop + 20 + i * 26
          if (yPos < deckY - 10) {
            return (
              <g key={`truss-2-${i}`}>
                <line x1={towerX2 - 14} y1={yPos} x2={towerX2 + 14} y2={yPos + 22} stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
                <line x1={towerX2 + 14} y1={yPos} x2={towerX2 - 14} y2={yPos + 22} stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
                <line x1={towerX2 - 14} y1={yPos + 11} x2={towerX2 + 14} y2={yPos + 11} stroke="#64748B" strokeWidth="1" />
              </g>
            )
          }
          return null
        })}

        {/* Tower Top Pinnacle & Beacon */}
        <polygon points={`${towerX2 - 18},${towerTop} ${towerX2},${towerTop - 18} ${towerX2 + 18},${towerTop}`} fill="url(#cyanBeam)" />
        <motion.circle cx={towerX2} cy={towerTop - 22} r="3.5" fill="#38BDF8" filter="url(#neonGlow)"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
      </g>

      {/* --- MULTI-TIER SUSPENSION CABLES --- */}
      {/* Primary Main Cable */}
      <motion.path
        d={mainCablePath}
        stroke="#38BDF8" strokeWidth="2.2" fill="none" strokeLinecap="round" filter="url(#neonGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Secondary Parallel Cable for Depth */}
      <motion.path
        d={`M${anchorX1} ${deckY + 4} Q${mid1X} ${sag1 + 4}, ${towerX1} ${towerTop + 4} Q${mid2X} ${sag2 + 4}, ${towerX2} ${towerTop + 4} Q${mid3X} ${sag3 + 4}, ${anchorX2} ${deckY + 4}`}
        stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />

      {/* Dense Hanger Rod Network */}
      {hangers.map((h, i) => (
        <motion.line key={`complex-hanger-${i}`}
          x1={h.x} y1={h.y} x2={h.x} y2={deckY}
          stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.9 + i * 0.015 }}
        />
      ))}

      {/* --- MULTI-TIER ROADWAY DECK & TRUSSES --- */}
      {/* Lower deck beam */}
      <motion.rect x="15" y={deckY - 5} width="570" height="10" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1"
        initial={{ width: 0 }} animate={{ width: 570 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      {/* Upper road plate */}
      <rect x="20" y={deckY - 3} width="560" height="3" fill="#38BDF8" opacity="0.8" filter="url(#neonGlow)" />

      {/* Under-deck Truss Webbing */}
      {Array.from({ length: 35 }, (_, i) => i * 16 + 25).map((x, i) => (
        <line key={`deck-truss-${i}`} x1={x} y1={deckY + 5} x2={x + 8} y2={deckY + 12} stroke="#334155" strokeWidth="1" />
      ))}
      {Array.from({ length: 35 }, (_, i) => i * 16 + 25).map((x, i) => (
        <line key={`deck-truss-inv-${i}`} x1={x + 8} y1={deckY + 5} x2={x + 16} y2={deckY + 12} stroke="#334155" strokeWidth="1" />
      ))}

      {/* Deck Lane Dividers / Lights */}
      {Array.from({ length: 28 }, (_, i) => i * 20 + 30).map((x, i) => (
        <rect key={`lane-light-${i}`} x={x} y={deckY - 2} width="8" height="1" rx="0.5" fill="#FFFFFF" opacity="0.6" />
      ))}

      {/* Anchor Blocks / Portals at ends */}
      <polygon points="10,${deckY + 15} 35,${deckY - 10} 45,${deckY - 10} 25,${deckY + 15}" fill="#1E293B" stroke="#475569" strokeWidth="1" />
      <polygon points="590,${deckY + 15} 565,${deckY - 10} 555,${deckY - 10} 575,${deckY + 15}" fill="#1E293B" stroke="#475569" strokeWidth="1" />
    </motion.svg>
  )
}

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #090D16 0%, #0F172A 50%, #090D16 100%)',
      overflow: 'hidden',
      padding: '120px 40px 80px',
    }}>
      {/* Twinkling Background Starfield */}
      <Star x="12%" y="18%" size={2} delay={0.2} />
      <Star x="25%" y="10%" size={3} delay={1.1} />
      <Star x="45%" y="22%" size={1.5} delay={0.5} />
      <Star x="65%" y="12%" size={2.5} delay={1.8} />
      <Star x="82%" y="25%" size={3} delay={0.8} />
      <Star x="90%" y="15%" size={1.5} delay={2.2} />
      <Star x="8%" y="65%" size={2.5} delay={1.4} />
      <Star x="18%" y="80%" size={2} delay={0.3} />
      <Star x="88%" y="70%" size={3} delay={1.6} />
      <Star x="75%" y="85%" size={1.5} delay={0.9} />

      {/* Dark Styled Floating Orbs (Cyan & Electric Blue, No Yellow) */}
      <FloatingOrb size={14} x="10%" y="25%" delay={0} duration={7} color="rgba(56, 189, 248, 0.15)" />
      <FloatingOrb size={10} x="80%" y="20%" delay={1} duration={5} color="rgba(59, 130, 246, 0.12)" />
      <FloatingOrb size={18} x="75%" y="65%" delay={2} duration={8} color="rgba(14, 165, 233, 0.1)" />
      <FloatingOrb size={8} x="20%" y="75%" delay={0.5} duration={6} color="rgba(56, 189, 248, 0.15)" />
      <FloatingOrb size={12} x="50%" y="15%" delay={3} duration={9} color="rgba(59, 130, 246, 0.12)" />
      <FloatingOrb size={16} x="88%" y="45%" delay={1.5} duration={7} color="rgba(37, 99, 235, 0.1)" />

      {/* Ambient Dark Glow Background Gradients */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 40%, rgba(56, 189, 248, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        width: '100%',
        gap: '60px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px',
            }}>
              Free Education for Everyone
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#F8FAFC',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            Bridge the Gap to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Brilliance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: '1.15rem',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            A nonprofit learning platform providing free access to quality education.
            Video lessons, live classes, progress tracking, and more — built for those who deserve brilliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <Link href="/register">
              <button style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.2s',
              }}>
                Get Started Free →
              </button>
            </Link>
            <a href="#about">
              <button style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'transparent',
                border: '2px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                Learn More
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { num: '5', label: 'Subjects' },
              { num: '13', label: 'Staff' },
              { num: '100%', label: 'Free' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>{stat.num}</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', justifyContent: 'center' }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ComplexBridgeSVG />
        </motion.div>
      </div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div style={{
          width: '24px', height: '40px',
          borderRadius: '12px',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '8px',
        }}>
          <motion.div
            style={{ width: '4px', height: '8px', borderRadius: '2px', background: '#38BDF8' }}
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}