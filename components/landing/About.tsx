'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: '120px 40px',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body), sans-serif',
      }}
    >
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '-100px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '60px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left: Text (Exact original text preserved) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#EFF6FF',
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(37, 99, 235, 0.1)',
          }}>
            Our Mission
          </span>

          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '24px',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>
            Education is a Right,{' '}
            <span style={{ color: '#3B82F6' }}>
              Not a Privilege
            </span>
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#475569',
            lineHeight: 1.8,
            marginBottom: '20px',
          }}>
            BridgeToBrilliance is a nonprofit initiative dedicated to breaking down barriers 
            to quality education. We believe every student, regardless of background or circumstance, 
            deserves access to world-class learning resources.
          </p>

          <p style={{
            fontSize: '1.05rem',
            color: '#475569',
            lineHeight: 1.8,
            marginBottom: '36px',
          }}>
            Our platform connects passionate teachers with eager learners through structured 
            video lessons, live interactive classes, progress tracking, and personalized feedback — 
            all completely free.
          </p>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { icon: '🎓', label: 'Free Quality Education' },
              { icon: '🌍', label: 'Global Access' },
              { icon: '❤️', label: 'Community Driven' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Reimagined Modern Feature Mosaic Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {/* Card 1 */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
            border: '1px solid #DBEAFE',
            borderRadius: '24px',
            padding: '32px 24px',
            gridColumn: 'span 2',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.05)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌟</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Empowering Every Student
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
              Designed with care to ensure students can focus entirely on growth, curiosity, and academic success.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚀</div>
            <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
              Interactive Growth
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Track milestones effortlessly with tailored teacher feedback.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🛡️</div>
            <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
              Secure & Open
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              A safe, modern platform built with enterprise-grade privacy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}