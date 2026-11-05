'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '../layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Subject, Announcement, Class as ClassType, Grade, Enrollment, Profile } from '@/types/database.types'

type EnrollmentWithDetails = Enrollment & {
  subject: Subject & { teacher: Pick<Profile, 'full_name'> | null } | null
  lesson_count: number
  watched_count: number
}

type ClassWithSubject = ClassType & {
  subject: Pick<Subject, 'title'> | null
}

type GradeWithSubject = Grade & {
  subject: Pick<Subject, 'title'> | null
}

type SubjectWithTeacher = Subject & {
  teacher: Pick<Profile, 'full_name'> | null
}

async function enrichEnrollments(supabase: ReturnType<typeof createClient>, studentId: string, enrollmentData: any[]): Promise<EnrollmentWithDetails[]> {
  if (!enrollmentData || enrollmentData.length === 0) return []

  const subjectIds = enrollmentData.map(e => e.subject_id)

  const [{ data: lessonCounts }, { data: progressData }] = await Promise.all([
    subjectIds.length > 0
      ? supabase.from('lessons').select('id, subject_id').in('subject_id', subjectIds)
      : { data: [] },
    subjectIds.length > 0
      ? supabase.from('progress').select('lesson_id').eq('student_id', studentId).eq('watched', true)
      : { data: [] },
  ])

  const lessonCountMap: Record<string, number> = {}
  const lessonSubjectMap: Record<string, string> = {}
  if (lessonCounts) {
    for (const l of lessonCounts) {
      lessonCountMap[l.subject_id] = (lessonCountMap[l.subject_id] || 0) + 1
      lessonSubjectMap[l.id] = l.subject_id
    }
  }

  const watchedSubjectCount: Record<string, number> = {}
  for (const p of progressData || []) {
    const subId = lessonSubjectMap[p.lesson_id]
    if (subId) watchedSubjectCount[subId] = (watchedSubjectCount[subId] || 0) + 1
  }

  return enrollmentData.map(e => ({
    ...(e as EnrollmentWithDetails),
    lesson_count: lessonCountMap[e.subject_id] || 0,
    watched_count: watchedSubjectCount[e.subject_id] || 0,
  }))
}

// --- Blue Vector SVG Icons Library ---
function IconMath() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  )
}

function IconComputerScience() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  )
}

function IconPhysics() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
  )
}

function IconBiology() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}

function IconChemistry() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v4l4 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2l4-11V3z"></path>
      <line x1="9" y1="11" x2="15" y2="11"></line>
    </svg>
  )
}

function IconEnglish() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  )
}

function IconHandWave() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5"></path>
      <path d="M14 10V4a2 2 0 0 0-4 0v6"></path>
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
    </svg>
  )
}

function IconBookCollection() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      <line x1="12" y1="6" x2="16" y2="6"></line>
      <line x1="12" y1="10" x2="16" y2="10"></line>
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <line x1="9" y1="12" x2="15" y2="12"></line>
      <line x1="9" y1="16" x2="13" y2="16"></line>
    </svg>
  )
}

function IconAnalytics() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  )
}

const coreSubjects = [
  { id: 'math', title: 'Math', icon: <IconMath />, desc: 'Algebra, geometry, calculus, and mathematical problem-solving.' },
  { id: 'computer-science', title: 'Computer Science', icon: <IconComputerScience />, desc: 'Programming, algorithms, and software fundamentals.' },
  { id: 'physics', title: 'Physics', icon: <IconPhysics />, desc: 'Mechanics, thermodynamics, wave motion, and electromagnetism.' },
  { id: 'biology', title: 'Biology', icon: <IconBiology />, desc: 'Cellular biology, genetics, anatomy, and ecosystems.' },
  { id: 'chemistry', title: 'Chemistry', icon: <IconChemistry />, desc: 'Organic, inorganic, and physical chemistry principles.' },
  { id: 'english', title: 'English', icon: <IconEnglish />, desc: 'Language mastery, literature analysis, and academic writing.' },
]

export default function StudentDashboard() {
  const profile = useProfile()
  const supabase = createClient()
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<ClassWithSubject[]>([])
  const [grades, setGrades] = useState<GradeWithSubject[]>([])
  const [allSubjects, setAllSubjects] = useState<SubjectWithTeacher[]>([])
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
          { data: enrollmentData },
          { data: annData },
          { data: classData },
          { data: gradeData },
          { data: subData },
        ] = await Promise.all([
          supabase
            .from('enrollments')
            .select('*, subject:subjects(*, teacher:profiles!subjects_teacher_id_fkey(full_name))')
            .eq('student_id', profile.id),
          supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('classes')
            .select('*, subject:subjects(title)')
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true })
            .limit(5),
          supabase
            .from('grades')
            .select('*, subject:subjects(title)')
            .eq('student_id', profile.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('subjects')
            .select('*, teacher:profiles!subjects_teacher_id_fkey(full_name)'),
        ])

        if (cancelled) return

        if (enrollmentData) {
          const enriched = await enrichEnrollments(supabase, profile.id, enrollmentData)
          setEnrollments(enriched)
        }
        if (annData) setAnnouncements(annData)
        if (classData) setUpcomingClasses(classData as ClassWithSubject[])
        if (gradeData) setGrades(gradeData as GradeWithSubject[])
        if (subData) setAllSubjects(subData as SubjectWithTeacher[])

      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [profile])

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
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          willChange: 'transform, opacity',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '36px',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.05)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: '#FFFFFF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
          <IconHandWave /> Student Portal
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Welcome back, {firstName}!
        </h1>
        <p style={{ fontSize: '1rem', color: '#475569', margin: 0 }}>
          You have full access to all <strong style={{ color: '#2563EB' }}>6 core subjects</strong>. Dive into your classes and keep up the great work!
        </p>
      </motion.div>

      {/* Core Subjects Section */}
      <div id="subjects" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconBookCollection /> Core Subjects
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {coreSubjects.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93C5FD'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(37, 99, 235, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px', background: '#EFF6FF',
                    border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {sub.icon}
                  </div>
                  <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', fontWeight: 700, border: '1px solid #BFDBFE' }}>
                    Ready
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  {sub.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
                  {sub.desc}
                </p>
              </div>

              <Link href={`/subjects/${sub.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px',
                    width: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  Dive Into Class →
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grid: Upcoming Classes & Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Upcoming Classes */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconCalendar /> Upcoming Classes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingClasses.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', padding: '24px', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px dashed #CBD5E1', margin: 0 }}>
                No upcoming classes scheduled.
              </p>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls.id} style={{
                  padding: '16px', borderRadius: '16px', background: '#F8FAFC',
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
                      padding: '8px 16px', borderRadius: '10px', background: '#2563EB', color: '#FFFFFF',
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconMegaphone /> Announcements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', padding: '24px', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px dashed #CBD5E1', margin: 0 }}>
                No announcements at this time.
              </p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} style={{
                  padding: '16px', borderRadius: '16px', background: '#F8FAFC',
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

      {/* Grades Section */}
      <div id="grades" style={{ marginBottom: '40px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconClipboard /> My Grades
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                {['Subject', 'Assignment', 'Score', 'Feedback'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>No grades recorded yet.</td></tr>
              ) : (
                grades.map((g) => {
                  const ratio = g.max_score > 0 ? g.score / g.max_score : 0
                  const isPassing = ratio >= 0.7
                  return (
                    <tr key={g.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>{g.subject?.title || 'General'}</td>
                      <td style={{ padding: '16px', color: '#0F172A', fontSize: '0.9rem', fontWeight: 700 }}>{g.assignment_title}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
                          background: isPassing ? '#ECFDF5' : '#FEF2F2',
                          color: isPassing ? '#059669' : '#DC2626',
                          border: `1px solid ${isPassing ? '#A7F3D0' : '#FCA5A5'}`,
                        }}>
                          {g.score} / {g.max_score}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#64748B', fontSize: '0.85rem' }}>{g.feedback || '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Analytics Charts */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconAnalytics /> Progress Analytics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
            <h4 style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Lessons Completed Over Time</h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="lessons" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
            <h4 style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Progress by Core Subject (%)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="progress" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

    </div>
  )
}