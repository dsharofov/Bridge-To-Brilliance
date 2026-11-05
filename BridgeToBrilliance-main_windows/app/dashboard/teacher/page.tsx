'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '../layout'
import type { Subject, Announcement, Grade, Profile, Class as ClassType } from '@/types/database.types'

type SubjectWithEnrollments = Subject & {
  enrollments: { id: string }[]
  lessons: { id: string }[]
}

type ClassWithSubject = ClassType & {
  subject: Pick<Subject, 'title'> | null
}

type GradeWithDetails = Grade & {
  subject: Pick<Subject, 'title'> | null
  student: Pick<Profile, 'full_name' | 'email'> | null
}

// Helper to format dates cleanly into numeric format (e.g., 14.03.2026, 14:30)
function formatNumericDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year}, ${hours}:${mins}`
}

const CORE_PLATFORM_SUBJECTS = [
  {
    title: 'Math',
    path: '/dashboard/teacher/math',
    description: 'Advanced calculus, algebra, geometry, and competitive Olympiad problem solving.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="4" y1="20" x2="20" y2="4"></line>
      <polyline points="4 4 20 4 20 20"></polyline>
    </svg>
    ),
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  {
    title: 'Computer Science',
    path: '/dashboard/teacher/computer-science',
    description: 'Algorithms, data structures, C++ standard template libraries, and full-stack web development.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
      <line x1="13.5" y1="4" x2="10.5" y2="20"></line>
    </svg>
    ),
    color: '#6A1B9A',
    bg: '#F3E5F5',
  },
  {
    title: 'Biology',
    path: '/dashboard/teacher/biology',
    description: 'Cellular structures, genetics, organic matter classification, and ecological systems.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4c0 3 4 6 6 8-2 2-6 5-6 8"></path>
        <path d="M18 4c0 3-4 6-6 8 2 2 6 5 6 8"></path>
        <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
      </svg>
    ),
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
  {
    title: 'Chemistry',
    path: '/dashboard/teacher/chemistry',
    description: 'Atomic structures, chemical bonding mechanisms, stoichiometry, and periodic trends.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6v4l5 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1l5-14V2z"></path>
        <line x1="7" y1="13" x2="17" y2="13"></line>
        <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
        <circle cx="10" cy="15" r="0.8" fill="currentColor"></circle>
      </svg>
    ),
    color: '#D97706',
    bg: '#FFF8E1',
  },
  {
    title: 'English',
    path: '/dashboard/teacher/english',
    description: 'IELTS writing preparation, critical literary analysis, essays, and global communication.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    color: '#C62828',
    bg: '#FFEBEE',
  },
  {
    title: 'Physics',
    path: '/dashboard/teacher/physics',
    description: 'Classical mechanics, horizontal projectile motion, electromagnetism, and physical equations.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.2" fill="currentColor"></circle>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(0 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(60 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(120 12 12)"></ellipse>
      </svg>
    ),
    color: '#9B59B6',
    bg: '#F4ECF7',
  },
]

function getSubjectTheme(title: string): { color: string; bg: string; path: string; icon: React.ReactNode } {
  if (title.includes('Math')) return { 
    color: '#1565C0', 
    bg: '#E3F2FD', 
    path: '/dashboard/teacher/math', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg> 
  }
  if (title.includes('Computer Science') || title.includes('CS')) return { 
    color: '#6A1B9A', 
    bg: '#F3E5F5', 
    path: '/dashboard/teacher/computer-science', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> 
  }
  if (title.includes('Biology')) return { 
    color: '#2E7D32', 
    bg: '#E8F5E9', 
    path: '/dashboard/teacher/biology', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4c0 3 4 6 6 8-2 2-6 5-6 8"></path><path d="M18 4c0 3-4 6-6 8 2 2 6 5 6 8"></path><circle cx="12" cy="12" r="2" fill="currentColor"></circle></svg> 
  }
  if (title.includes('Chemistry')) return { 
    color: '#D97706', 
    bg: '#FFF8E1', 
    path: '/dashboard/teacher/chemistry', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6v4l5 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1l5-14V2z"></path><line x1="7" y1="13" x2="17" y2="13"></line><circle cx="12" cy="17" r="1" fill="currentColor"></circle><circle cx="10" cy="15" r="0.8" fill="currentColor"></circle></svg> 
  }
  if (title.includes('English')) return { 
    color: '#C62828', 
    bg: '#FFEBEE', 
    path: '/dashboard/teacher/english', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 
  }
  return { 
    color: '#9B59B6', 
    bg: '#F4ECF7', 
    path: '/dashboard/teacher/physics', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2.2" fill="currentColor"></circle><ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(0 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="3.2" transform="rotate(120 12 12)"></ellipse></svg> 
  }
}

export default function TeacherDashboard() {
  const profile = useProfile()
  const supabase = createClient()
  
  const [subjects, setSubjects] = useState<SubjectWithEnrollments[]>([])
  const [allTeachers, setAllTeachers] = useState<Profile[]>([])
  const [totalStudentsCount, setTotalStudentsCount] = useState(0)
  const [classes, setClasses] = useState<ClassWithSubject[]>([])
  const [grades, setGrades] = useState<GradeWithDetails[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const [classTab, setClassTab] = useState<'upcoming' | 'history'>('upcoming')
  const [classSearchQuery, setClassSearchQuery] = useState('')

  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [selectedCoreSubject, setSelectedCoreSubject] = useState(CORE_PLATFORM_SUBJECTS[0])

  const [showClassModal, setShowClassModal] = useState(false)
  const [classTitle, setClassTitle] = useState('')
  const [classSubjectId, setClassSubjectId] = useState('')
  const [classScheduledAt, setClassScheduledAt] = useState('')
  const [classMeetingLink, setClassMeetingLink] = useState('')
  const [classDescription, setClassDescription] = useState('')
  const [editingClass, setEditingClass] = useState<ClassWithSubject | null>(null)

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchTeacherData = async () => {
      try {
        const [
          { data: subData },
          { data: teacherData },
          { count: studentCount },
          { data: classData },
          { data: gradeData },
          { data: annData }
        ] = await Promise.all([
          supabase.from('subjects').select('*, enrollments(id), lessons(id)').order('title', { ascending: true }),
          supabase.from('profiles').select('*').eq('role', 'teacher'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('classes').select('*, subject:subjects(title)').order('scheduled_at', { ascending: true }),
          supabase.from('grades').select('*, subject:subjects(title), student:profiles!grades_student_id_fkey(full_name, email)').order('created_at', { ascending: false }),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
        ])

        if (cancelled) return

        if (subData) setSubjects(subData as SubjectWithEnrollments[])
        if (teacherData) setAllTeachers(teacherData as Profile[])
        if (studentCount !== null) setTotalStudentsCount(studentCount)
        if (classData) setClasses(classData as ClassWithSubject[])
        if (gradeData) setGrades(gradeData as GradeWithDetails[])
        if (annData) setAnnouncements(annData)

      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTeacherData()
    return () => { cancelled = true }
  }, [profile, supabase])

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    const titleToUse = selectedCoreSubject.title
    const descToUse = selectedCoreSubject.description

    const existingForTeacher = subjects.find(
      s => s.title.toLowerCase() === titleToUse.toLowerCase() && s.teacher_id === profile.id
    )

    if (existingForTeacher) {
      alert('You are already managing this subject!')
      setShowSubjectModal(false)
      return
    }

    const { error } = await supabase.from('subjects').insert({
      title: titleToUse,
      description: descToUse,
      icon: 'minimalist',
      teacher_id: profile.id,
    })

    if (error) { alert('Error: ' + error.message); return }
    setShowSubjectModal(false)
    window.location.reload()
  }

  const handleRemoveSubject = async (subjectId: string, subjectTitle: string) => {
    if (!confirm(`Remove ${subjectTitle}?`)) return
    const { error } = await supabase.from('subjects').delete().eq('id', subjectId).eq('teacher_id', profile?.id)
    if (error) { alert('Error: ' + error.message); return }
    setSubjects(prev => prev.filter(s => s.id !== subjectId))
  }

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClass) {
      const { error } = await supabase.from('classes').update({
        title: classTitle,
        subject_id: classSubjectId,
        scheduled_at: new Date(classScheduledAt).toISOString(),
        meeting_link: classMeetingLink,
        description: classDescription,
      }).eq('id', editingClass.id)

      if (error) { alert('Error: ' + error.message); return }
    } else {
      const { error } = await supabase.from('classes').insert({
        title: classTitle,
        subject_id: classSubjectId,
        scheduled_at: new Date(classScheduledAt).toISOString(),
        meeting_link: classMeetingLink,
        description: classDescription,
      })

      if (error) { alert('Error: ' + error.message); return }
    }

    setShowClassModal(false)
    setEditingClass(null)
    setClassTitle('')
    setClassSubjectId('')
    setClassScheduledAt('')
    setClassMeetingLink('')
    setClassDescription('')
    window.location.reload()
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Delete this scheduled class?')) return
    const { error } = await supabase.from('classes').delete().eq('id', classId)
    if (error) { alert('Error: ' + error.message); return }
    setClasses(prev => prev.filter(c => c.id !== classId))
  }

  const handleOpenEditClass = (c: ClassWithSubject) => {
    setEditingClass(c)
    setClassTitle(c.title)
    setClassSubjectId(c.subject_id)
    setClassScheduledAt(c.scheduled_at ? new Date(c.scheduled_at).toISOString().slice(0, 16) : '')
    setClassMeetingLink(c.meeting_link || '')
    setClassDescription(c.description || '')
    setShowClassModal(true)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}><div className="spinner" /></div>

  const firstName = profile?.full_name?.split(' ')[0] || 'Teacher'
  const mySubjects = subjects.filter(s => s.teacher_id === profile?.id)

  const now = new Date()
  const upcomingClasses = classes.filter(c => new Date(c.scheduled_at) > now)
  const pastClasses = classes.filter(c => new Date(c.scheduled_at) <= now)

  const displayedClasses = (classTab === 'upcoming' ? upcomingClasses : pastClasses).filter(c => 
    c.title.toLowerCase().includes(classSearchQuery.toLowerCase()) || 
    (c.subject?.title && c.subject.title.toLowerCase().includes(classSearchQuery.toLowerCase()))
  )

  return (
    <div style={{ paddingBottom: '40px', fontFamily: 'var(--font-body), sans-serif' }}>
      
      {/* Welcome Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #2563EB', borderRadius: '0px', padding: '36px', marginBottom: '36px', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '0px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
            TEACHER PORTAL
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', margin: 0 }}>
            Pick your subjects, collaborate with co-teachers, and manage live class schedules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSubjectModal(true)} style={{ padding: '12px 22px', borderRadius: '0px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
            + Choose Subject
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setEditingClass(null); setClassTitle(''); setClassSubjectId(''); setClassScheduledAt(''); setClassMeetingLink(''); setClassDescription(''); setShowClassModal(true) }} style={{ padding: '12px 22px', borderRadius: '0px', background: '#FFFFFF', color: '#2563EB', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Schedule Class
          </motion.button>
        </div>
      </motion.div>

      {/* SCHEDULED LIVE CLASSES SECTION WITH TABS & SEARCH */}
      <div style={{ marginBottom: '40px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '0px', padding: '28px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="3" y="4" width="18" height="18" rx="0" ry="0"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Live Classes Management
          </h2>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search live classes..."
                value={classSearchQuery}
                onChange={e => setClassSearchQuery(e.target.value)}
                style={{ padding: '8px 12px 8px 34px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '0px', background: '#F8FAFC', outline: 'none', width: '220px', color: '#0F172A' }}
              />
              <svg style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>

            <button onClick={() => { setEditingClass(null); setClassTitle(''); setClassSubjectId(''); setClassScheduledAt(''); setClassMeetingLink(''); setClassDescription(''); setShowClassModal(true) }} style={{ padding: '8px 16px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', borderRadius: '0px' }}>
              + Schedule Class
            </button>
          </div>
        </div>

        {/* Tabs for Upcoming vs History */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: '24px', gap: '24px' }}>
          <button
            onClick={() => setClassTab('upcoming')}
            style={{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: classTab === 'upcoming' ? '2px solid #2563EB' : '2px solid transparent', marginBottom: '-2px', fontWeight: 700, fontSize: '0.95rem', color: classTab === 'upcoming' ? '#2563EB' : '#64748B', cursor: 'pointer' }}
          >
            Upcoming & Current ({upcomingClasses.length})
          </button>
          <button
            onClick={() => setClassTab('history')}
            style={{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: classTab === 'history' ? '2px solid #2563EB' : '2px solid transparent', marginBottom: '-2px', fontWeight: 700, fontSize: '0.95rem', color: classTab === 'history' ? '#2563EB' : '#64748B', cursor: 'pointer' }}
          >
            History ({pastClasses.length})
          </button>
        </div>

        {displayedClasses.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '32px' }}>
            {classSearchQuery ? 'No matching classes found.' : (classTab === 'upcoming' ? 'No upcoming live classes currently scheduled.' : 'No past live classes in history yet.')}
          </p>
        ) : classTab === 'upcoming' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {displayedClasses.map(c => {
              const subTitle = c.subject?.title || 'General'
              const theme = getSubjectTheme(subTitle)
              return (
                <div key={c.id} style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${theme.color}`, padding: '20px', background: '#F8FAFC', borderRadius: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', background: theme.bg, color: theme.color, textTransform: 'uppercase' }}>{subTitle}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{formatNumericDate(c.scheduled_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>{c.title}</h3>
                    {c.description && <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>{c.description}</p>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                    {c.meeting_link ? (
                      <a href={c.meeting_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>Join Meeting →</a>
                    ) : <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>No link provided</span>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEditClass(c)} style={{ padding: '4px 10px', background: '#E0E7FF', color: '#3730A3', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>Edit</button>
                      <button onClick={() => handleDeleteClass(c.id)} style={{ padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayedClasses.map(c => {
              const subTitle = c.subject?.title || 'General'
              const theme = getSubjectTheme(subTitle)
              return (
                <div key={c.id} style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid #94A3B8`, padding: '14px 18px', background: '#F8FAFC', borderRadius: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', background: theme.bg, color: theme.color, textTransform: 'uppercase' }}>{subTitle}</span>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{c.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Ended: {formatNumericDate(c.scheduled_at)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', background: '#E2E8F0', padding: '2px 8px' }}>Completed</span>
                    <button onClick={() => handleDeleteClass(c.id)} style={{ padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Subjects Section */}
      <div id="subjects" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            My Managed Subjects & Collaboration Hub
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{mySubjects.length} Subject(s)</span>
        </div>

        {mySubjects.length === 0 ? (
          <div style={{ padding: '48px', background: '#FFF', borderRadius: '0px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ color: '#64748B', marginBottom: '16px', fontSize: '1rem' }}>You haven&apos;t chosen any subjects to manage yet.</p>
            <button onClick={() => setShowSubjectModal(true)} style={{ padding: '12px 24px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>Choose Your First Subject</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {mySubjects.map((sub) => {
              const theme = getSubjectTheme(sub.title)
              const coTeachers = allTeachers.filter(t => {
                const teacherSubMatch = subjects.some(s => s.title.toLowerCase() === sub.title.toLowerCase() && s.teacher_id === t.id)
                return teacherSubMatch && t.id !== profile?.id
              })

              return (
                <div key={sub.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: `4px solid ${theme.color}`, borderRadius: '0px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', background: theme.bg, border: `1px solid ${theme.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.color }}>
                        {theme.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ padding: '4px 10px', background: theme.bg, color: theme.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{sub.title}</span>
                        <button onClick={() => handleRemoveSubject(sub.id, sub.title)} title="Remove subject" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0px' }}>×</button>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{sub.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '20px', lineHeight: 1.6, minHeight: '45px' }}>{sub.description || 'Core academic curriculum.'}</p>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Co-Teachers</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {coTeachers.length === 0 ? <span style={{ fontSize: '0.85rem', color: '#64748B' }}>No other co-teachers</span> : coTeachers.map(t => (
                          <span key={t.id} style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{t.full_name || t.email}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link href={theme.path} style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
                      <button style={{ width: '100%', padding: '12px', background: theme.color, color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', borderRadius: '0px' }}>Manage Subject Portal →</button>
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        {totalStudentsCount} Students Enrolled
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        {sub.lessons?.length || 0} Lessons
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL: Pick Subject */}
      <AnimatePresence>
        {showSubjectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', borderRadius: '0px', padding: '32px', width: '100%', maxWidth: '600px', border: '1px solid #CBD5E1', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>Choose Subject to Manage</h3>
              <form onSubmit={handleAddSubject}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
                  {CORE_PLATFORM_SUBJECTS.map((core) => (
                    <div key={core.title} onClick={() => setSelectedCoreSubject(core)} style={{ padding: '16px', border: `2px solid ${selectedCoreSubject.title === core.title ? core.color : '#CBD5E1'}`, background: selectedCoreSubject.title === core.title ? core.bg : '#F8FAFC', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ color: core.color, width: '48px', height: '48px', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${core.color}30` }}>{core.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: core.color }}>{core.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{core.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowSubjectModal(false)} style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', cursor: 'pointer', borderRadius: '0px' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '10px', background: selectedCoreSubject.color, color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>Confirm</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Schedule / Edit Class (Ultra-Smooth Rectangular & English Locale Formatted) */}
      <AnimatePresence>
        {showClassModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFFFFF', borderRadius: '0px', padding: '36px', width: '100%', maxWidth: '460px', border: '1px solid #CBD5E1', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #0F172A', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {editingClass ? 'Edit Live Class' : 'Schedule Live Class'}
                </h3>
                <button type="button" onClick={() => setShowClassModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <form onSubmit={handleSaveClass}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Class Title</label>
                  <input 
                    type="text" 
                    value={classTitle} 
                    onChange={e => setClassTitle(e.target.value)} 
                    required 
                    placeholder="e.g. Chapter 1 Review" 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', background: '#F8FAFC', boxSizing: 'border-box', borderRadius: '0px', fontSize: '0.9rem', outline: 'none', color: '#0F172A' }} 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Subject</label>
                  <select 
                    value={classSubjectId} 
                    onChange={e => setClassSubjectId(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', background: '#F8FAFC', boxSizing: 'border-box', borderRadius: '0px', fontSize: '0.9rem', outline: 'none', color: '#0F172A', cursor: 'pointer' }}
                  >
                    <option value="">Select Subject</option>
                    {mySubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Date & Time (MM/DD/YYYY, HH:MM AM/PM)</label>
                  <input 
                    type="datetime-local" 
                    value={classScheduledAt} 
                    onChange={e => setClassScheduledAt(e.target.value)} 
                    required 
                    lang="en-US"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', background: '#F8FAFC', boxSizing: 'border-box', borderRadius: '0px', fontSize: '0.9rem', outline: 'none', color: '#0F172A' }} 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Meeting Link (URL)</label>
                  <input 
                    type="url" 
                    value={classMeetingLink} 
                    onChange={e => setClassMeetingLink(e.target.value)} 
                    placeholder="https://zoom.us/..." 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', background: '#F8FAFC', boxSizing: 'border-box', borderRadius: '0px', fontSize: '0.9rem', outline: 'none', color: '#0F172A' }} 
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Description / Notes</label>
                  <textarea 
                    value={classDescription} 
                    onChange={e => setClassDescription(e.target.value)} 
                    placeholder="Add class details..." 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', background: '#F8FAFC', height: '90px', boxSizing: 'border-box', resize: 'none', borderRadius: '0px', fontSize: '0.9rem', outline: 'none', color: '#0F172A' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowClassModal(false)} 
                    style={{ flex: 1, padding: '12px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', borderRadius: '0px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ flex: 1, padding: '12px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', borderRadius: '0px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                  >
                    {editingClass ? 'Update Class' : 'Schedule'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}