'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useProfile } from '@/app/dashboard/layout'
import * as timerService from '@/services/timer.service'
import * as groupsService from '@/services/study-groups.service'

const features = [
  { href: '/dashboard/student/study/groups', icon: '👥', title: 'Study Groups', desc: 'Join or create study groups with chat, file sharing, and collaboration', color: '#3B82F6', tag: 'Social' },
  { href: '/dashboard/student/study/flashcards', icon: '🃏', title: 'Flashcards', desc: 'Create and review flashcard decks with spaced repetition', color: '#8B5CF6', tag: 'Revision' },
  { href: '/dashboard/student/study/notes', icon: '📝', title: 'My Notes', desc: 'Take organized notes with tags, colors, and pinning', color: '#10B981', tag: 'Organize' },
  { href: '/dashboard/student/study/timer', icon: '⏱️', title: 'Study Timer', desc: 'Pomodoro timer with session tracking and streaks', color: '#EF4444', tag: 'Focus' },
  { href: '/dashboard/student/study/quizzes', icon: '💡', title: 'Quizzes', desc: 'Take practice quizzes and track your scores', color: '#F59E0B', tag: 'Practice' },
  { href: '/dashboard/student/study/bookmarks', icon: '🔖', title: 'Bookmarks', desc: 'Save lessons and resources for quick access', color: '#06B6D4', tag: 'Saved' },
  { href: '/dashboard/student/study/plans', icon: '📋', title: 'Study Plans', desc: 'Create personalized study schedules with tasks', color: '#2563EB', tag: 'Planning' },
  { href: '/dashboard/student/study/achievements', icon: '🏆', title: 'Achievements', desc: 'Unlock achievements and track your progress', color: '#F97316', tag: 'Rewards' },
]

export default function StudyHubPage() {
  const profile = useProfile()
  const [stats, setStats] = useState<{ totalMinutes: number; sessionsCompleted: number; currentStreak: number } | null>(null)
  const [groupCount, setGroupCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, groupsRes, notesRes] = await Promise.all([
        timerService.getStudyStats(),
        groupsService.getMyGroups(),
        import('@/services/notes.service').then(ns => ns.getNotes()),
      ])
      if (statsRes.success && statsRes.data) setStats(statsRes.data)
      if (groupsRes.success && groupsRes.data) setGroupCount(groupsRes.data.length)
      if (notesRes.success && notesRes.data) setNoteCount(notesRes.data.length)
    }
    fetchData()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
          padding: '36px 32px',
          color: '#FFFFFF',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(37, 99, 235, 0.22)',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Blur Orbs */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '120px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px',
            letterSpacing: '0.02em',
          }}>
            <span>🎓</span> Learning Workspace
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 800,
            marginBottom: '10px',
            lineHeight: 1.2,
          }}>
            Ready to focus, {firstName}? 🎯
          </h1>

          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            Track your study progress, collaborate in real-time with your peers, and master your subjects step by step.
          </p>

          <Link href="/dashboard/student/study/timer" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#1E3A8A',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              <span>⏱️</span> Start Focus Session
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      {stats && (
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>📊</span> Your Study Overview
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Study Time', value: `${stats.totalMinutes}m`, icon: '⏱️', color: '#EF4444', bg: '#FEF2F2' },
              { label: 'Sessions Completed', value: stats.sessionsCompleted.toString(), icon: '📚', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Day Streak', value: `${stats.currentStreak} Days`, icon: '🔥', color: '#F59E0B', bg: '#FEF3C7' },
              { label: 'Active Groups', value: groupCount.toString(), icon: '👥', color: '#8B5CF6', bg: '#F5F3FF' },
              { label: 'Saved Notes', value: noteCount.toString(), icon: '📝', color: '#10B981', bg: '#ECFDF5' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                style={{
                  willChange: 'transform, opacity',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 12px rgba(30, 41, 59, 0.03)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Side Color Accent Strip */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: stat.color,
                }} />

                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}>
                  {stat.icon}
                </div>

                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Tools Grid */}
      <div>
        <h2 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>🚀</span> Learning Tools & Resources
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {features.map((feature, i) => (
            <Link key={feature.href} href={feature.href} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -6, scale: 1.01 }}
                style={{
                  willChange: 'transform, opacity',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  //justify: 'space-between',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#93C5FD'
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    //justify: 'space-between',
                    marginBottom: '18px',
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: `${feature.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                    }}>
                      {feature.icon}
                    </div>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: feature.color,
                      background: `${feature.color}12`,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {feature.tag}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '8px',
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#64748B',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    {feature.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: feature.color,
                }}>
                  <span>Open Tool</span>
                  <span>→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}