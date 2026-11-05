'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '../layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Subject, Announcement, Class as ClassType, Grade, Profile } from '@/types/database.types'

type ClassWithSubject = ClassType & {
  subject: Pick<Subject, 'title'> | null
}

type GradeWithSubject = Grade & {
  subject: Pick<Subject, 'title'> | null
}

// --- Updated Minimalist Vector SVG Icons Library matching Teacher Dashboard ---
function IconMath() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="4" y1="20" x2="20" y2="4"></line>
      <polyline points="4 4 20 4 20 20"></polyline>
    </svg>
  )
}

function IconComputerScience() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
      <line x1="13.5" y1="4" x2="10.5" y2="20"></line>
    </svg>
  )
}

function IconPhysics() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.2" fill="currentColor"></circle>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(0 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(60 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(120 12 12)"></ellipse>
      </svg>
  )
}

function IconBiology() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4c0 3 4 6 6 8-2 2-6 5-6 8"></path>
        <path d="M18 4c0 3-4 6-6 8 2 2 6 5 6 8"></path>
        <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
      </svg>
  )
}

function IconChemistry() {
  return (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6v4l5 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1l5-14V2z"></path>
        <line x1="7" y1="13" x2="17" y2="13"></line>
        <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
        <circle cx="10" cy="15" r="0.8" fill="currentColor"></circle>
      </svg>
  )
}

function IconEnglish() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  )
}

// Core subjects updated to match the new folder structure paths[cite: 9]
const coreSubjects = [
  { id: 'math', title: 'Math', path: '/dashboard/student/math', icon: <IconMath />, desc: 'Advanced calculus, algebra, geometry, and competitive Olympiad problem solving.', color: '#1565C0', bg: '#E3F2FD' },
  { id: 'computer-science', title: 'Computer Science', path: '/dashboard/student/computer-science', icon: <IconComputerScience />, desc: 'Algorithms, data structures, C++ standard template libraries, and full-stack web development.', color: '#6A1B9A', bg: '#F3E5F5' },
  { id: 'physics', title: 'Physics', path: '/dashboard/student/physics', icon: <IconPhysics />, desc: 'Classical mechanics, horizontal projectile motion, electromagnetism, and physical equations.', color: '#9B59B6', bg: '#F4ECF7' },
  { id: 'biology', title: 'Biology', path: '/dashboard/student/biology', icon: <IconBiology />, desc: 'Cellular structures, genetics, organic matter classification, and ecological systems.', color: '#2E7D32', bg: '#E8F5E9' },
  { id: 'chemistry', title: 'Chemistry', path: '/dashboard/student/chemistry', icon: <IconChemistry />, desc: 'Atomic structures, chemical bonding mechanisms, stoichiometry, and periodic trends.', color: '#FFB300', bg: '#FFF8E1' },
  { id: 'english', title: 'English', path: '/dashboard/student/english', icon: <IconEnglish />, desc: 'IELTS writing preparation, critical literary analysis, essays, and global communication.', color: '#C62828', bg: '#FFEBEE' },
]

function IconHandWave() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}

function IconBookCollection() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="4" width="18" height="18" rx="0"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="3" width="18" height="18" rx="0"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  )
}

function IconAnalytics() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  )
}

export default function StudentDashboard() {
  const profile = useProfile()
  const supabase = createClient()
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<ClassWithSubject[]>([])
  const [grades, setGrades] = useState<GradeWithSubject[]>([])
  const [dbSubjects, setDbSubjects] = useState<any[]>([])
  const [dbProfiles, setDbProfiles] = useState<any[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchData = async () => {
      try {
        const [
          { data: annData },
          { data: classData },
          { data: gradeData },
          { data: subData, error: subError },
          { data: profData, error: profError },
        ] = await Promise.all([
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('classes').select('*, subject:subjects(title)').gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(5),
          supabase.from('grades').select('*, subject:subjects(title)').eq('student_id', profile.id).order('created_at', { ascending: false }),
          supabase.from('subjects').select('*'),
          supabase.from('profiles').select('*'),
        ])

        if (cancelled) return

        if (subError) console.error('Subject fetch error:', subError.message)
        if (profError) {
          console.error('Profile fetch error:', profError.message)
          setFetchError(`RLS Error reading profiles: ${profError.message}`)
        }

        if (annData) setAnnouncements(annData)
        if (classData) setUpcomingClasses(classData as ClassWithSubject[])
        if (gradeData) setGrades(gradeData as GradeWithSubject[])
        if (subData) setDbSubjects(subData)
        if (profData) setDbProfiles(profData)

      } catch (err: any) {
        console.error('Dashboard fetch exception:', err)
        setFetchError(err.message || 'Unknown error occurred')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [profile, supabase])

  const progressData = useMemo(() => [
    { week: 'W1', lessons: 2 }, { week: 'W2', lessons: 5 }, { week: 'W3', lessons: 3 },
    { week: 'W4', lessons: 7 }, { week: 'W5', lessons: 4 }, { week: 'W6', lessons: 8 },
  ], [])

  const subjectProgress = useMemo(() =>
    coreSubjects.map(sub => ({
      name: sub.title.slice(0, 12),
      progress: Math.floor(Math.random() * 60) + 20,
    })),
    []
  )

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="spinner" />
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #2563EB',
          borderRadius: '0px',
          padding: '36px',
          marginBottom: '36px',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.04)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '0px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
          <IconHandWave /> Student Portal
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Welcome back, {firstName}!
        </h1>
        <p style={{ fontSize: '1rem', color: '#475569', margin: 0 }}>
          Explore your core subjects, view your assigned instructors, and stay on top of upcoming classes.
        </p>

        {/* Live Diagnostic Status Bar */}
        {/* <div style={{ marginTop: '16px', padding: '8px 12px', background: fetchError ? '#FEF2F2' : '#F8FAFC', border: `1px solid ${fetchError ? '#FCA5A5' : '#E2E8F0'}`, fontSize: '0.8rem', color: fetchError ? '#DC2626' : '#64748B', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Supabase Status:</strong> {fetchError ? `⚠️ ${fetchError}` : `Connected (${dbSubjects.length} subjects, ${dbProfiles.length} profiles loaded)`}</span>
        </div> */}
      </motion.div>

      {/* Core Subjects Section */}
      <div id="subjects" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconBookCollection /> Core Subjects & Instructors
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {coreSubjects.map((sub, i) => {
            const matchingSubs = dbSubjects.filter(
              s => s.title && s.title.toLowerCase().trim() === sub.title.toLowerCase().trim()
            )

            const teacherNames = Array.from(
              new Set(
                matchingSubs.map(s => {
                  const tId = s.teacher_id || s.user_id || s.profile_id
                  const matchedProfile = dbProfiles.find(p => p.id === tId || p.user_id === tId)
                  return matchedProfile?.full_name || matchedProfile?.email || null
                }).filter((name): name is string => Boolean(name))
              )
            )

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderTop: `4px solid ${sub.color}`,
                  borderRadius: '0px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)',
                  minHeight: '340px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '0px', background: sub.bg,
                      border: `1px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub.color
                    }}>
                      {sub.icon}
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '0px', background: sub.bg, color: sub.color, fontWeight: 700, border: `1px solid ${sub.color}30`, textTransform: 'uppercase' }}>
                      Active
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    {sub.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' }}>
                    {sub.desc}
                  </p>

                  {/* Teachers Section */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Instructors
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {teacherNames.length === 0 ? (
                        <span style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>No teachers assigned yet</span>
                      ) : (
                        teacherNames.map((name) => (
                          <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sub.color }} />
                            {name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Link wrapper pointing to correct subfolder route[cite: 9] */}
                <Link href={sub.path} style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      padding: '12px',
                      width: '100%',
                      textAlign: 'center',
                      borderRadius: '0px',
                      background: sub.color,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: `0 4px 12px ${sub.color}30`,
                    }}
                  >
                    Dive Into Class →
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Grid: Upcoming Classes & Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Upcoming Classes */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0px', padding: '24px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconCalendar /> Upcoming Classes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingClasses.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', padding: '24px', background: '#F8FAFC', borderRadius: '0px', textAlign: 'center', border: '1px dashed #CBD5E1', margin: 0 }}>
                No upcoming classes scheduled.
              </p>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls.id} style={{
                  padding: '16px', borderRadius: '0px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                }}>
                  <div>
                    <h4 style={{ color: '#0F172A', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px' }}>{cls.title}</h4>
                    <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, fontWeight: 500 }}>
                      {cls.subject?.title} &middot; {new Date(cls.scheduled_at).toLocaleDateString()} at {new Date(cls.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {cls.meeting_link && (
                    <a href={cls.meeting_link} target="_blank" rel="noreferrer" style={{
                      padding: '8px 16px', borderRadius: '0px', background: '#2563EB', color: '#FFFFFF',
                      fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0, boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                    }}>
                      Join Class
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0px', padding: '24px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconMegaphone /> Announcements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', padding: '24px', background: '#F8FAFC', borderRadius: '0px', textAlign: 'center', border: '1px dashed #CBD5E1', margin: 0 }}>
                No announcements at this time.
              </p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} style={{
                  padding: '16px', borderRadius: '0px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ color: '#0F172A', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{ann.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                      {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{ann.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}