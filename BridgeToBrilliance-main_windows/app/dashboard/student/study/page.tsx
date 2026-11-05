'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useProfile } from '@/app/dashboard/layout'
import * as timerService from '@/services/timer.service'
import * as groupsService from '@/services/study-groups.service'
import * as notesService from '@/services/notes.service'

const features = [
  { 
    href: '/dashboard/student/study/groups', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, 
    title: 'Study Groups', 
    desc: 'Join or create study groups with chat, file sharing, and collaboration', 
    color: '#2563EB', 
    tag: 'Social' 
  },
  { 
    href: '/dashboard/student/study/flashcards', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M14 12h4"/></svg>, 
    title: 'Flashcards', 
    desc: 'Create and review flashcard decks with spaced repetition', 
    color: '#8B5CF6', 
    tag: 'Revision' 
  },
  { 
    href: '/dashboard/student/study/notes', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, 
    title: 'My Notes', 
    desc: 'Take organized notes with tags, colors, and pinning', 
    color: '#10B981', 
    tag: 'Organize' 
  },
  { 
    href: '/dashboard/student/study/timer', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M19 3l3 3"/></svg>, 
    title: 'Study Timer', 
    desc: 'Pomodoro timer with session tracking and streaks', 
    color: '#EF4444', 
    tag: 'Focus' 
  },
  { 
    href: '/dashboard/student/study/quizzes', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"/><path d="M9 9h6"/><path d="M9 13h6"/></svg>, 
    title: 'Quizzes', 
    desc: 'Take practice quizzes and track your scores', 
    color: '#F59E0B', 
    tag: 'Practice' 
  },
  { 
    href: '/dashboard/student/study/bookmarks', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>, 
    title: 'Bookmarks', 
    desc: 'Save lessons and resources for quick access', 
    color: '#06B6D4', 
    tag: 'Saved' 
  },
  { 
    href: '/dashboard/student/study/plans', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, 
    title: 'Study Plans', 
    desc: 'Create personalized study schedules with tasks', 
    color: '#2563EB', 
    tag: 'Planning' 
  },
  { 
    href: '/dashboard/student/study/achievements', 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>, 
    title: 'Achievements', 
    desc: 'Unlock achievements and track your progress', 
    color: '#F97316', 
    tag: 'Rewards' 
  },
]

export default function StudyHubPage() {
  const profile = useProfile()
  const [stats, setStats] = useState<{ totalMinutes: number; sessionsCompleted: number; currentStreak: number } | null>(null)
  const [groupCount, setGroupCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)
  const [unlockedVideosCount, setUnlockedVideosCount] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(1)
  const [maxStreak, setMaxStreak] = useState(1)
  const [platformTime, setPlatformTime] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, groupsRes, notesRes] = await Promise.all([
        timerService.getStudyStats(),
        groupsService.getMyGroups(),
        notesService.getNotes(),
      ])
      if (statsRes.success && statsRes.data) setStats(statsRes.data)
      if (groupsRes.success && groupsRes.data) setGroupCount(groupsRes.data.length)
      if (notesRes.success && notesRes.data) setNoteCount(notesRes.data.length)

      // Fetch sum of unlocked video lessons across subjects if available
      try {
        const subjectsRes = await fetch('/api/student/subjects').then(r => r.json()).catch(() => null)
        if (subjectsRes && subjectsRes.unlockedVideos) {
          setUnlockedVideosCount(subjectsRes.unlockedVideos)
        } else {
          // Fallback check from localStorage or default
          const storedUnlocked = localStorage.getItem('unlocked_videos_count')
          setUnlockedVideosCount(storedUnlocked ? parseInt(storedUnlocked, 10) : 4)
        }
      } catch {
        setUnlockedVideosCount(4)
      }
    }
    fetchData()

    // Platform time tracking (Time spent in platform since first visit/account creation)
    const joinKey = profile ? `platform_join_timestamp_${profile.id}` : 'platform_join_timestamp_default'
    let joinTime = parseInt(localStorage.getItem(joinKey) || '0', 10)
    if (!joinTime) {
      joinTime = Date.now()
      localStorage.setItem(joinKey, joinTime.toString())
    }

    const updatePlatformTimer = () => {
      const diffMs = Date.now() - joinTime
      const totalSecs = Math.floor(diffMs / 1000)
      const years = Math.floor(totalSecs / (365 * 24 * 3600))
      const months = Math.floor((totalSecs % (365 * 24 * 3600)) / (30 * 24 * 3600))
      const days = Math.floor((totalSecs % (30 * 24 * 3600)) / (24 * 3600))
      const hours = Math.floor((totalSecs % (24 * 3600)) / 3600)
      const minutes = Math.floor((totalSecs % 3600) / 60)
      const seconds = totalSecs % 60
      setPlatformTime({ years, months, days, hours, minutes, seconds })
    }

    updatePlatformTimer()
    const timerInterval = setInterval(updatePlatformTimer, 1000)

    // Active streak calculation logic with reset and max streak record
    const todayStr = new Date().toISOString().split('T')[0]
    const streakKey = profile ? `active_streak_${profile.id}` : 'active_streak_default'
    const maxStreakKey = profile ? `max_streak_${profile.id}` : 'max_streak_default'
    const lastVisitKey = profile ? `last_active_date_${profile.id}` : 'last_active_date_default'

    const savedStreak = parseInt(localStorage.getItem(streakKey) || '1', 10)
    const savedMax = parseInt(localStorage.getItem(maxStreakKey) || '1', 10)
    const lastVisit = localStorage.getItem(lastVisitKey)

    let newStreak = savedStreak
    let newMax = savedMax

    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const currentDate = new Date(todayStr)
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24))

      if (diffDays === 1) {
        newStreak = savedStreak + 1
      } else if (diffDays > 1) {
        newStreak = 1
      }
    }

    if (newStreak > newMax) {
      newMax = newStreak
    }

    setCurrentStreak(newStreak)
    setMaxStreak(newMax)
    localStorage.setItem(streakKey, newStreak.toString())
    localStorage.setItem(maxStreakKey, newMax.toString())
    localStorage.setItem(lastVisitKey, todayStr)

    return () => clearInterval(timerInterval)
  }, [profile])

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  // Format platform time string nicely
  const timeParts = []
  if (platformTime.years > 0) timeParts.push(`${platformTime.years}y`)
  if (platformTime.months > 0 || platformTime.years > 0) timeParts.push(`${platformTime.months}m`)
  if (platformTime.days > 0 || platformTime.months > 0 || platformTime.years > 0) timeParts.push(`${platformTime.days}d`)
  timeParts.push(`${platformTime.hours}h ${platformTime.minutes}m ${platformTime.seconds}s`)
  const formattedPlatformTime = timeParts.join(' ')

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          borderRadius: '0px',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
          padding: '36px 32px',
          color: '#FFFFFF',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(37, 99, 235, 0.22)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          borderRadius: '0px',
          background: 'rgba(255, 255, 255, 0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '120px',
          width: '180px',
          height: '180px',
          borderRadius: '0px',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '0px',
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px',
            letterSpacing: '0.02em',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span>Learning Workspace</span>
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
                borderRadius: '0px',
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Start Focus Session</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section with Updated Live Counters */}
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span>Your Study Overview</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { 
              label: 'Platform Time', 
              value: formattedPlatformTime, 
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, 
              color: '#EF4444', 
              bg: '#FEF2F2',
              isTime: true 
            },
            { 
              label: 'Unlocked Lessons', 
              value: unlockedVideosCount.toString(), 
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, 
              color: '#2563EB', 
              bg: '#EFF6FF' 
            },
            { 
              label: 'Active Streak', 
              value: `${currentStreak} Days`, 
              subValue: `Max: ${maxStreak} Days`, 
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-2.5-4.5-2.5-7 0 0 7 2 7 9a5 5 0 0 1-10 0c0-.88.23-1.71.64-2.43"/></svg>, 
              color: '#F59E0B', 
              bg: '#FEF3C7' 
            },
            { 
              label: 'Active Groups', 
              value: groupCount.toString(), 
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, 
              color: '#8B5CF6', 
              bg: '#F5F3FF' 
            },
            { 
              label: 'Saved Notes', 
              value: noteCount.toString(), 
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, 
              color: '#10B981', 
              bg: '#ECFDF5' 
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              style={{
                willChange: 'transform, opacity',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '0px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(30, 41, 59, 0.03)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
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
                borderRadius: '0px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {stat.svg}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ 
                  fontSize: stat.isTime ? '0.95rem' : '1.4rem', 
                  fontWeight: 800, 
                  color: '#0F172A', 
                  lineHeight: 1.2,
                  wordBreak: 'break-word'
                }}>
                  {stat.value}
                </div>
                {stat.subValue && (
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: '1px' }}>
                    {stat.subValue}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Learning Tools &amp; Resources</span>
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
                  borderRadius: '0px',
                  padding: '24px',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                    marginBottom: '18px',
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '0px',
                      background: `${feature.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {feature.svg}
                    </div>

                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: feature.color,
                      background: `${feature.color}12`,
                      padding: '4px 10px',
                      borderRadius: '0px',
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