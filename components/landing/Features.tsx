'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Custom complex vector icon components avoiding simple emojis
function IconPlatformAbout() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  )
}

function IconOnlineLessons() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )
}

function IconLiveChallenges() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}

function IconQuizzes() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
}

function IconOlympiads() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  )
}

function IconStudyPlanning() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

const features = [
  {
    icon: <IconPlatformAbout />,
    title: 'Platform Overview',
    description: 'A comprehensive, modern digital ecosystem designed to unify students, teachers, and administrators seamlessly.',
  },
  {
    icon: <IconOnlineLessons />,
    title: 'Online Video Lessons',
    description: 'Structured high-definition modules with synchronized note-taking, progress tracking, and on-demand playback.',
  },
  {
    icon: <IconLiveChallenges />,
    title: 'Live Interactive Challenges',
    description: 'Engage in real-time collaborative coding battles, live Q&A sessions, and competitive peer problem-solving.',
  },
  {
    icon: <IconQuizzes />,
    title: 'Adaptive Quizzes',
    description: 'Dynamic testing environments equipped with instant performance analytics and spaced-repetition logic.',
  },
  {
    icon: <IconOlympiads />,
    title: 'Olympiad Preparation',
    description: 'Advanced-tier problem sets, algorithmic competitions, and mentorship pipelines tailored for elite academic contests.',
  },
  {
    icon: <IconStudyPlanning />,
    title: 'Advanced Study Planning',
    description: 'Intelligent scheduling tools, Pomodoro integration, and milestone roadmaps to keep your academic goals on track.',
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="features"
      ref={ref}
      style={{
        padding: '120px 40px',
        background: 'linear-gradient(180deg, #090D16 0%, #0F172A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow Gradients */}
      <div style={{
        position: 'absolute', top: '20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Platform Ecosystem
          </span>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Excel
            </span>
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#94A3B8',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            An advanced suite of high-performance tools engineered for a comprehensive, immersive learning experience.
          </p>
        </motion.div>

        {/* 2x3 Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.12)',
                borderRadius: '20px',
                padding: '36px',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Top Accent Line on Hover / Default */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)',
              }} />

              <div style={{
                width: '60px', height: '60px',
                borderRadius: '16px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)',
              }}>
                {feature.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#F8FAFC',
                marginBottom: '12px',
                letterSpacing: '-0.01em',
              }}>
                {feature.title}
              </h3>

              <p style={{
                fontSize: '0.95rem',
                color: '#94A3B8',
                lineHeight: 1.7,
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}