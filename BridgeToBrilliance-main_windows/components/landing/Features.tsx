'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

// Custom vector icon components matching #003E6B theme
function IconPlatformAbout() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  )
}

function IconOnlineLessons() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="0" ry="0"></rect>
    </svg>
  )
}

function IconLiveChallenges() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}

function IconQuizzes() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
}

function IconOlympiads() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  )
}

function IconStudyPlanning() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="0" ry="0"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

const features = [
  {
    icon: <IconPlatformAbout />,
    title: 'A Home for All Learners',
    description: 'Everything you need in one clean, distraction-free space. Teachers, students, and mentors connect effortlessly.',
  },
  {
    icon: <IconOnlineLessons />,
    title: 'Crystal Clear Video Lessons',
    description: 'Bite-sized, high-definition lessons designed to make tough concepts feel simple and intuitive.',
  },
  {
    icon: <IconLiveChallenges />,
    title: 'Live Challenges & Battles',
    description: 'Test your skills in real-time problem-solving rounds and friendly coding competitions with peers.',
  },
  {
    icon: <IconQuizzes />,
    title: 'Smart Practice Quizzes',
    description: 'Interactive quizzes that adapt to your pace, helping you remember what you learn without burnout.',
  },
  {
    icon: <IconOlympiads />,
    title: 'Olympiad & Exam Prep',
    description: 'Curated elite problem sets and expert guidance to help you aim for the highest academic medals.',
  },
  {
    icon: <IconStudyPlanning />,
    title: 'Stress-Free Study Planning',
    description: 'Built-in schedules and smart roadmaps that keep you organized so you always know what is next.',
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="features"
      ref={ref}
      style={{
        padding: '120px 60px',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body), sans-serif',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header Section */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: '0', y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '0px',
            background: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderLeft: '3px solid #003E6B',
            color: '#003E6B',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Platform Features
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
          }}>
            Built to Make Learning{' '}
            <span style={{ color: '#003E6B' }}>
              Effortless
            </span>
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#475569',
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Explore the powerful tools we built from the ground up to support your academic journey every single day.
          </p>
        </motion.div>

        {/* Interactive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '28px',
        }}>
          {features.map((feature, i) => {
            const isHovered = hoveredIndex === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{ y: -6 }}
                style={{
                  background: isHovered ? '#F8FAFC' : '#FFFFFF',
                  border: isHovered ? '1px solid #003E6B' : '1px solid #E2E8F0',
                  borderRadius: '0px',
                  padding: '40px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isHovered ? '0 15px 30px rgba(0, 62, 107, 0.08)' : '0 4px 15px rgba(15, 23, 42, 0.02)',
                  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Top Accent Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: isHovered ? '#003E6B' : 'transparent',
                  transition: 'background 0.2s',
                }} />

                {/* Icon Container */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '0px',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em',
                }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.95rem',
                  color: '#475569',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                }}>
                  {feature.description}
                </p>

                {/* Interactive Action Prompt */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#003E6B',
                  opacity: isHovered ? 1 : 0.6,
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.2s ease',
                }}>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}