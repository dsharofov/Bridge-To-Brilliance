'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database.types'

const ProfileContext = createContext<Profile | null>(null)
export const useProfile = () => useContext(ProfileContext)

// --- Blue Vector SVG Icons for Sidebar Navigation ---
function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>
  )
}

function IconStudyHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  )
}

function IconStudyGroups() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

function IconFlashcards() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="6" y1="10" x2="18" y2="10"></line>
    </svg>
  )
}

function IconNotes() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  )
}

function IconTimer() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8"></circle>
      <path d="M12 9v4l2 2"></path>
      <path d="M5 3L2 6"></path>
      <path d="M19 3l3 3"></path>
    </svg>
  )
}

function IconQuizzes() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
}

function IconBookmarks() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}

function IconPlans() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M9 14l2 2 4-4"></path>
    </svg>
  )
}

function IconAchievements() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  )
}

function IconSubjects() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  )
}

function IconGradebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <line x1="9" y1="12" x2="15" y2="12"></line>
      <line x1="9" y1="16" x2="13" y2="16"></line>
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

function IconTeachers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}

function IconSecurity() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  )
}

function IconAnnouncements() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  )
}

const navItems: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  student: [
    { href: '/dashboard/student', label: 'Dashboard', icon: <IconDashboard /> },
    { href: '/dashboard/student/study', label: 'Study Hub', icon: <IconStudyHub /> },
    { href: '/dashboard/student/study/groups', label: 'Study Groups', icon: <IconStudyGroups /> },
    { href: '/dashboard/student/study/flashcards', label: 'Flashcards', icon: <IconFlashcards /> },
    { href: '/dashboard/student/study/notes', label: 'My Notes', icon: <IconNotes /> },
    { href: '/dashboard/student/study/timer', label: 'Timer', icon: <IconTimer /> },
    { href: '/dashboard/student/study/quizzes', label: 'Quizzes', icon: <IconQuizzes /> },
    { href: '/dashboard/student/study/bookmarks', label: 'Bookmarks', icon: <IconBookmarks /> },
    { href: '/dashboard/student/study/plans', label: 'Study Plans', icon: <IconPlans /> },
    { href: '/dashboard/student/study/achievements', label: 'Achievements', icon: <IconAchievements /> },
  ],
  teacher: [
    { href: '/dashboard/teacher', label: 'Dashboard', icon: <IconDashboard /> },
    { href: '/dashboard/teacher#subjects', label: 'My Subjects', icon: <IconSubjects /> },
    { href: '/dashboard/teacher#gradebook', label: 'Gradebook', icon: <IconGradebook /> },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: <IconDashboard /> },
    { href: '/dashboard/admin/users', label: 'Users', icon: <IconUsers /> },
    { href: '/dashboard/admin/teachers', label: 'Teachers', icon: <IconTeachers /> },
    { href: '/dashboard/admin/security', label: 'Security', icon: <IconSecurity /> },
    { href: '/dashboard/admin#subjects', label: 'Subjects', icon: <IconSubjects /> },
    { href: '/dashboard/admin#announcements', label: 'Announcements', icon: <IconAnnouncements /> },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile inside layout:', error.message)
        }

        if (data && !cancelled) {
          setProfile(data as Profile)
        }
      } catch (err) {
        console.error('Unexpected profile fetch error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getProfile()
    return () => { cancelled = true }
  }, [supabase, router])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }, [router, supabase])

  const handleAdminLogin = useCallback(async () => {
    setAdminLoading(true)
    setAdminError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@bridgetobrilliance.com',
      password: adminPassword,
    })
    setAdminLoading(false)
    if (error) {
      setAdminError('Invalid password')
      return
    }
    setShowAdminLogin(false)
    setAdminPassword('')
    router.push('/dashboard/admin')
  }, [adminPassword, router, supabase])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8F9FA',
        fontFamily: 'var(--font-body), sans-serif',
      }}>
        <div className="spinner" />
      </div>
    )
  }

  const role = profile?.role || 'student'
  const items = navItems[role] || navItems['student']
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'

  return (
    <ProfileContext.Provider value={profile}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA', fontFamily: 'var(--font-body), sans-serif' }}>
        <aside
          style={{
            width: sidebarOpen ? '280px' : '0',
            minWidth: sidebarOpen ? '280px' : '0',
            overflow: 'hidden',
            background: '#ffffff',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            transition: 'width 0.3s, min-width 0.3s',
            fontFamily: 'var(--font-body), sans-serif',
          }}
        >
          {/* Top Brand Logo Section */}
          <div style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            opacity: sidebarOpen ? 1 : 0,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                <Image src="/pictures/logo.png" alt="BridgeToBrilliance" width={32} height={32} style={{ borderRadius: '8px', objectFit: 'contain' }} />
                <button
                  onClick={() => setShowAdminLogin(true)}
                  aria-label="Admin Access"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.08)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.1rem',
                fontWeight: 700, color: '#4169E1',
              }}>BridgeToBrilliance</span>
            </Link>
          </div>

          {/* Scrollable Navigation List */}
          <nav style={{ 
            padding: '16px 12px', 
            flex: 1, 
            overflowY: 'auto', 
            opacity: sidebarOpen ? 1 : 0, 
            transition: 'opacity 0.2s', 
            fontFamily: 'var(--font-body), sans-serif' 
          }}>
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      marginBottom: '4px',
                      background: isActive ? 'rgba(65, 105, 225, 0.1)' : 'transparent',
                      color: isActive ? '#4169E1' : 'rgba(0,0,0,0.5)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body), sans-serif',
                    }}
                    className="nav-item"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, fontFamily: 'var(--font-body), sans-serif' }}>{item.label}</span>
                    {isActive && (
                      <div style={{
                        marginLeft: 'auto', width: '6px', height: '6px',
                        borderRadius: '50%', background: '#4169E1',
                      }} />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Pinned Bottom User Profile & Sign Out Section */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            opacity: sidebarOpen ? 1 : 0,
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-body), sans-serif',
            background: '#ffffff',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: 'white',
                fontFamily: 'var(--font-body), sans-serif',
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', fontFamily: 'var(--font-body), sans-serif' }}>
                  {profile?.full_name || 'User'}
                </div>
                <div style={{
                  fontSize: '0.7rem', color: '#2563EB', textTransform: 'capitalize',
                  fontWeight: 600, fontFamily: 'var(--font-body), sans-serif',
                }}>
                  {role}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                color: '#64748B',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body), sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF6FF'
                e.currentTarget.style.color = '#2563EB'
                e.currentTarget.style.borderColor = '#BFDBFE'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F8FAFC'
                e.currentTarget.style.color = '#64748B'
                e.currentTarget.style.borderColor = '#E2E8F0'
              }}
            >
              {/* Clean Custom Blue Vector Sign Out Icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </motion.button>
          </div>
        </aside>

        <main style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s',
          minHeight: '100vh',
          fontFamily: 'var(--font-body), sans-serif',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: '#ffffff',
            fontFamily: 'var(--font-body), sans-serif',
          }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)',
                fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px',
              }}
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(65, 105, 225, 0.1)', border: '1px solid rgba(65, 105, 225, 0.2)',
                color: '#4169E1', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                fontFamily: 'var(--font-body), sans-serif',
              }}>
                {role}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '32px', fontFamily: 'var(--font-body), sans-serif' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowAdminLogin(false); setAdminError(''); setAdminPassword('') }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: '20px',
              fontFamily: 'var(--font-body), sans-serif',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '20px',
                padding: '32px',
                width: '100%',
                maxWidth: '400px',
                fontFamily: 'var(--font-body), sans-serif',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.3rem', color: '#1A1A2E', marginBottom: '8px' }}>
                Admin Access
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', marginBottom: '24px', fontFamily: 'var(--font-body), sans-serif' }}>
                Enter admin password to continue
              </p>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setAdminError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin() }}
                placeholder="Password"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.03)',
                  border: `1px solid ${adminError ? '#dc3545' : 'rgba(0,0,0,0.1)'}`,
                  color: '#1A1A2E',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: adminError ? '8px' : '16px',
                  fontFamily: 'var(--font-body), sans-serif',
                }}
              />
              {adminError && (
                <p style={{ fontSize: '0.8rem', color: '#dc3545', marginBottom: '12px', fontFamily: 'var(--font-body), sans-serif' }}>{adminError}</p>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowAdminLogin(false); setAdminError(''); setAdminPassword('') }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: 'rgba(0,0,0,0.7)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body), sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  disabled={adminLoading || !adminPassword}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: adminPassword ? 'linear-gradient(135deg, #4169E1, #2D4FC8)' : 'rgba(0,0,0,0.03)',
                    color: adminPassword ? 'white' : 'rgba(0,0,0,0.3)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: adminPassword ? 'pointer' : 'default',
                    fontFamily: 'var(--font-body), sans-serif',
                  }}
                >
                  {adminLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProfileContext.Provider>
  )
}