'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  role: string
}

type Subject = {
  id: string
  title: string
  description: string
  teacher_name?: string
  icon?: string
}

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('*')
          .order('title', { ascending: true })

        if (subjectsData) {
          setSubjects(subjectsData)
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [supabase, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '60px', fontFamily: 'var(--font-body), sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#0F172A' }}>
      
      {/* Welcome Banner */}
      <div style={{ background: '#003366', color: '#FFF', padding: '32px 36px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,51,102,0.1)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#90CAF9' }}>
          Student Portal Workstation
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '600px' }}>
          Select a subject curriculum below to access your video playlists, interactive quizzes, class stream materials, and direct communication with instructors.
        </p>
      </div>

      {/* Subjects Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          Enrolled Subjects & Portals
        </h2>

        {subjects.length === 0 ? (
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '48px', textAlign: 'center', color: '#64748B' }}>
            No subjects published yet. Please check back soon or contact administration.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {subjects.map((sub) => {
              const isMath = sub.title.toLowerCase().includes('math')
              const portalLink = isMath ? '/dashboard/student/math' : `/dashboard/student/${sub.id}`

              return (
                <div 
                  key={sub.id} 
                  style={{ 
                    background: '#FFF', 
                    border: '1px solid #E2E8F0', 
                    borderTop: '6px solid #003366', 
                    padding: '24px', 
                    boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#003366', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Active Curriculum
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                      {sub.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                      {sub.description || 'Explore sequenced video lessons, learning notes, instructor chat, and assessment quizzes.'}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                      Instructor: {sub.teacher_name || 'Assigned Faculty'}
                    </span>
                    <Link 
                      href={portalLink}
                      style={{ 
                        padding: '10px 18px', 
                        background: '#003366', 
                        color: '#FFF', 
                        fontSize: '0.85rem', 
                        fontWeight: 800, 
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Open Portal →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}