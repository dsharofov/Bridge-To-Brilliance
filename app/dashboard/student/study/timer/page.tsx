'use client'

import { useState, useRef, useEffect } from 'react'
import * as timerService from '@/services/timer.service'
import type { StudySession } from '@/types/database.types'

// Traditional Geometric SVG Icons for Stats
function IconClockGeo({ size = 20, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconLayersGeo({ size = 20, color = '#7C3AED' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconFlameGeo({ size = 20, color = '#F59E0B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-3-3-4.5-3-7.5 0 0 3 1.5 3 4.5a2.5 2.5 0 0 1 5 0c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.78.67-3.4 1.77-4.63C7.2 8.37 8.5 10.5 8.5 14.5Z" />
    </svg>
  )
}

function IconStarGeo({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconTraditionalStar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#starGradTimer)" />
      <defs>
        <linearGradient id="starGradTimer" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function TimerPage() {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [stats, setStats] = useState<{ totalMinutes: number; sessionsCompleted: number; currentStreak: number; longestStreak?: number } | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sessionNotes, setSessionNotes] = useState('')

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const modeRef = useRef(mode)
  const activeSessionRef = useRef(activeSessionId)
  const notesRef = useRef(sessionNotes)

  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { activeSessionRef.current = activeSessionId }, [activeSessionId])
  useEffect(() => { notesRef.current = sessionNotes }, [sessionNotes])

  const MODES = {
    work: { label: 'Focus', duration: 25 * 60, color: '#0EA5E9' },
    short: { label: 'Short Break', duration: 5 * 60, color: '#10B981' },
    long: { label: 'Long Break', duration: 15 * 60, color: '#7C3AED' },
  }

  // Load initial data and recover timer state from localStorage on mount
  useEffect(() => {
    let cancelled = false
    const loadData = async () => {
      const [sessionsRes, statsRes] = await Promise.all([
        timerService.getSessions({ limit: 10 }),
        timerService.getStudyStats(),
      ])
      if (!cancelled) {
        if (sessionsRes.success && sessionsRes.data) setSessions(sessionsRes.data)
        if (statsRes.success && statsRes.data) setStats(statsRes.data)
      }
    }
    loadData()

    // Restore timer from local storage if running
    const savedState = localStorage.getItem('pomodoro_timer_state')
    if (savedState) {
      try {
        const { endTime, savedMode, savedActiveSessionId, savedNotes } = JSON.parse(savedState)
        const now = Date.now()
        const remaining = Math.round((endTime - now) / 1000)

        if (remaining > 0) {
          setMode(savedMode)
          setTimeLeft(remaining)
          setIsRunning(true)
          if (savedActiveSessionId) setActiveSessionId(savedActiveSessionId)
          if (savedNotes) setSessionNotes(savedNotes)
        } else {
          localStorage.removeItem('pomodoro_timer_state')
        }
      } catch (e) {
        console.error('Failed to parse timer state', e)
      }
    }

    return () => { cancelled = true }
  }, [])

  const handleComplete = async () => {
    setIsRunning(false)
    localStorage.removeItem('pomodoro_timer_state')

    if (modeRef.current === 'work' && activeSessionRef.current) {
      await timerService.completeSession(activeSessionRef.current, MODES.work.duration, notesRef.current || undefined)
      setActiveSessionId(null)
      setSessionNotes('')
    }
    const [sessionsRes, statsRes] = await Promise.all([
      timerService.getSessions({ limit: 10 }),
      timerService.getStudyStats(),
    ])
    if (sessionsRes.success && sessionsRes.data) setSessions(sessionsRes.data)
    if (statsRes.success && statsRes.data) setStats(statsRes.data)
  }

  // Timer interval with localStorage synchronization
  useEffect(() => {
    if (isRunning) {
      // Set end time target in localStorage if not already set
      const targetDuration = MODES[mode].duration
      const existingState = localStorage.getItem('pomodoro_timer_state')
      let endTime: number

      if (existingState) {
        endTime = JSON.parse(existingState).endTime
      } else {
        endTime = Date.now() + timeLeft * 1000
        localStorage.setItem('pomodoro_timer_state', JSON.stringify({
          endTime,
          savedMode: mode,
          savedActiveSessionId: activeSessionId,
          savedNotes: sessionNotes,
        }))
      }

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const remaining = Math.round((endTime - now) / 1000)

        if (remaining <= 0) {
          setTimeLeft(0)
          setIsRunning(false)
          localStorage.removeItem('pomodoro_timer_state')
          if (intervalRef.current) clearInterval(intervalRef.current)
          handleComplete()
        } else {
          setTimeLeft(remaining)
        }
      }, 1000)
    } else {
      localStorage.removeItem('pomodoro_timer_state')
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, mode])

  const handleStart = async () => {
    if (mode === 'work' && !activeSessionId) {
      const res = await timerService.startSession(null, 'pomodoro')
      if (res.success && res.data) setActiveSessionId(res.data.id)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
    localStorage.removeItem('pomodoro_timer_state')
  }

  const handleReset = () => {
    setIsRunning(false)
    localStorage.removeItem('pomodoro_timer_state')
    setTimeLeft(MODES[mode].duration)
  }

  const switchMode = (newMode: 'work' | 'short' | 'long') => {
    setIsRunning(false)
    localStorage.removeItem('pomodoro_timer_state')
    setMode(newMode)
    setTimeLeft(MODES[newMode].duration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const currentMode = MODES[mode]
  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100
  const circumference = 2 * Math.PI * 120

  // Calculate exact completion clock time
  const completionTime = new Date(Date.now() + timeLeft * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '0px',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
          border: '1px solid #CBD5E1',
          color: '#0F766E',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          <IconTraditionalStar size={16} /> Pomodoro Focus Session
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
          Study Timer
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Maintain peak productivity with structured intervals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Timer Box */}
        <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.05)' }}>
          
          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {(Object.entries(MODES) as Array<['work' | 'short' | 'long', typeof currentMode]>).map(([key, m]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                style={{
                  padding: '10px 20px', borderRadius: '0px', border: `1px solid ${mode === key ? m.color : '#CBD5E1'}`,
                  background: mode === key ? m.color : '#F8FAFC',
                  color: mode === key ? '#FFFFFF' : '#475569',
                  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Circular Timer */}
          <div style={{ position: 'relative', width: '260px', height: '260px', marginBottom: '20px' }}>
            <svg width="260" height="260" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="130" cy="130" r="120" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="130" cy="130" r="120" fill="none"
                stroke={currentMode.color}
                strokeWidth="8"
                strokeLinecap="square"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentMode.color, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {currentMode.label}
              </div>
            </div>
          </div>

          {/* Target End Time Display */}
          {isRunning && (
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '24px', background: '#F8FAFC', padding: '6px 14px', border: '1px solid #CBD5E1' }}>
              🎯 Finishes at <strong>{completionTime}</strong>
            </div>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '320px', justifyContent: 'center' }}>
            {!isRunning ? (
              <button
                onClick={handleStart}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: '0px', border: 'none',
                  background: currentMode.color, color: '#FFFFFF',
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 4px 14px ${currentMode.color}40`,
                }}
              >
                {timeLeft === currentMode.duration ? 'Start Timer' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: '0px', border: '1px solid #CBD5E1',
                  background: '#F1F5F9', color: '#0F172A',
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              style={{
                padding: '14px 24px', borderRadius: '0px',
                border: '1px solid #CBD5E1', background: '#FFFFFF',
                color: '#64748B', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>

          {/* Session Notes */}
          {mode === 'work' && (
            <div style={{ marginTop: '24px', width: '100%', maxWidth: '360px' }}>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Session notes (optional)..."
                rows={2}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '0px',
                  background: '#F8FAFC', border: '1px solid #CBD5E1',
                  color: '#0F172A', fontSize: '0.88rem', outline: 'none', resize: 'none',
                  fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        {/* Stats & History Section */}
        <div>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Time', value: `${stats.totalMinutes}m`, icon: <IconClockGeo size={22} color="#0EA5E9" /> },
                { label: 'Sessions', value: stats.sessionsCompleted.toString(), icon: <IconLayersGeo size={22} color="#7C3AED" /> },
                { label: 'Day Streak', value: stats.currentStreak.toString(), icon: <IconFlameGeo size={22} color="#F59E0B" /> },
                { label: 'Best Streak', value: (stats.longestStreak ?? stats.currentStreak).toString(), icon: <IconStarGeo size={22} color="#10B981" /> },
              ].map(s => (
                <div key={s.label} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ color: '#0F172A', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.06em', fontWeight: 700 }}>
            Recent Sessions
          </h3>
          {sessions.length === 0 ? (
            <div style={{ color: '#64748B', textAlign: 'center', padding: '32px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.9rem' }}>
              No sessions yet. Start studying!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.map(session => (
                <div key={session.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 18px', borderRadius: '0px',
                  background: '#ffffff', border: '1px solid #E2E8F0',
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 700 }}>
                      {Math.round(session.duration_seconds / 60)} min session
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '0px', fontSize: '0.72rem', fontWeight: 700,
                    background: session.completed ? '#F0FDF4' : '#F8FAFC',
                    color: session.completed ? '#166534' : '#64748B',
                    border: `1px solid ${session.completed ? '#BBF7D0' : '#CBD5E1'}`,
                  }}>
                    {session.completed ? 'Completed' : 'Incomplete'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}