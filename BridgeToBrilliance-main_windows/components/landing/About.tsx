'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState<'student' | 'analytics' | 'live'>('student')

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
        background: 'radial-gradient(circle, rgba(0, 62, 107, 0.04) 0%, transparent 70%)',
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
        {/* Left: Mission Text */}
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
            color: '#003E6B',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(0, 62, 107, 0.1)',
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
            <span style={{ color: '#003E6B' }}>
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
              {
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                ),
                label: 'Free Quality Education'
              },
              {
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                label: 'Global Access'
              },
              {
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                label: 'Community Driven'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: '#EFF6FF', border: '1px solid #DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.svg}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Interactive Complex Platform Preview Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '28px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)',
            position: 'relative',
          }}
        >
          {/* Top Control Bar & Mode Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #E2E8F0',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginLeft: '6px' }}>
                bridgetobrilliance.uz
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div style={{
              display: 'flex',
              background: '#EFF6FF',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid #DBEAFE',
            }}>
              {[
                { id: 'student', label: 'Learner' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'live', label: 'Live Desk' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === tab.id ? '#003E6B' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Dynamic Body */}
          <div style={{ minHeight: '300px' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'student' && (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {/* Hero Course Progress Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#003E6B', textTransform: 'uppercase' }}>Active Path</span>
                      <span style={{ fontSize: '0.75rem', color: '#10B981', background: '#ECFDF5', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>85% Completed</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Advanced Algorithmic Logic & Physics</h4>
                    
                    {/* Dynamic Progress Bar */}
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#F1F5F9', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1 }}
                        style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #003E6B, #2563EB)' }}
                      />
                    </div>
                  </div>

                  {/* Dual Mini Widget Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Study Hours</span>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#003E6B' }}>24.5 hrs</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>+4.2 hrs this week</span>
                    </div>

                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003E6B" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Certificates</span>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>3 Verified</div>
                      <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>1 Ready to claim</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Weekly Engagement Frequency</h4>
                      <span style={{ fontSize: '0.75rem', color: '#003E6B', fontWeight: 600 }}>+32% Growth</span>
                    </div>
                    {/* Bar Chart Visualization */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingTop: '20px' }}>
                      {[40, 65, 30, 85, 95, 70, 100].map((val, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '10%' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            style={{
                              width: '100%',
                              background: idx === 6 ? '#003E6B' : '#DBEAFE',
                              borderRadius: '6px',
                            }}
                          />
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{['M','T','W','T','F','S','S'][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'live' && (
                <motion.div
                  key="live"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{
                    background: '#10B981',
                    borderRadius: '18px',
                    padding: '24px',
                    color: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#F8FAFC' }}>Online Recorded Video Lesson</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>Biology : the Classification of Living Organisms</h4>
                    <p style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '20px' }}>Instructor: Shuxratov Amirxon • 142 Students Watched</p>
                    <button style={{
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                    }}>
                      Join Workspace →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}