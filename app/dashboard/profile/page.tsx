'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useProfile } from '../layout'
import { createClient } from '@/lib/supabase/client'

// --- Custom Minimalist Vector SVG Icons ---
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function ProfilePage() {
  const profile = useProfile()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)

  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isMounted = true

    async function initUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      setUserId(user.id)
      setEmail(user.email || '')

      const initialName = profile?.full_name || user.email?.split('@')[0] || 'User'
      setFullName(initialName)

      // Isolate profile storage per user ID so profiles never cross-contaminate
      const userStorageKey = `bridge_profile_data_${user.id}`
      const savedData = localStorage.getItem(userStorageKey)

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          if (parsed.fullName) setFullName(parsed.fullName)
          if (typeof parsed.bio === 'string') setBio(parsed.bio)
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl)
          if (typeof parsed.emailNotifications === 'boolean') setEmailNotifications(parsed.emailNotifications)
          if (typeof parsed.studyReminders === 'boolean') setStudyReminders(parsed.studyReminders)
        } catch {
          // Fallback gracefully
        }
      }
    }

    initUserAndProfile()
    return () => { isMounted = false }
  }, [profile, supabase])

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setAvatarUrl(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage('')
    setIsError(false)

    if (newPassword) {
      if (!currentPassword) {
        setIsError(true)
        setStatusMessage('Please enter your current password to set a new password.')
        return
      }
      if (newPassword.length < 6) {
        setIsError(true)
        setStatusMessage('New password must be at least 6 characters long.')
        return
      }
      if (newPassword !== confirmPassword) {
        setIsError(true)
        setStatusMessage('New passwords do not match.')
        return
      }
    }

    setLoading(true)

    try {
      if (newPassword && email) {
        // Verify current password via Supabase re-authentication
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: currentPassword,
        })

        if (signInError) {
          setIsError(true)
          setStatusMessage('Incorrect current password provided.')
          setLoading(false)
          return
        }

        // Apply new password
        const { error: pwdError } = await supabase.auth.updateUser({
          password: newPassword
        })
        if (pwdError) {
          setIsError(true)
          setStatusMessage(pwdError.message)
          setLoading(false)
          return
        }
      }

      // Save user profile state privately in localStorage keyed by user ID
      if (userId) {
        const userStorageKey = `bridge_profile_data_${userId}`
        const profileData = {
          fullName,
          email,
          bio,
          avatarUrl,
          emailNotifications,
          studyReminders,
        }
        localStorage.setItem(userStorageKey, JSON.stringify(profileData))

        // Broadcast event so sidebar updates instantly for this account
        window.dispatchEvent(new Event('profile-updated'))
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setStatusMessage('Private profile settings and credentials updated successfully!')
    } catch (err: any) {
      setIsError(true)
      setStatusMessage(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE',
          color: '#2563EB', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px',
        }}>
          <IconUser />
          <span>User Account & Preferences</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
          My Profile & Settings
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Manage your isolated private account profile, avatar, and security settings</p>
      </div>

      {statusMessage && (
        <div style={{ 
          marginBottom: '20px', padding: '12px 16px', 
          background: isError ? '#FEF2F2' : '#F0FDF4', 
          border: `1px solid ${isError ? '#FCA5A5' : '#BBF7D0'}`, 
          color: isError ? '#B91C1C' : '#166534', 
          fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
          {!isError && <IconCheck />} {statusMessage}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* SECTION 1: Personal Information & PFP */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#2563EB', display: 'flex', alignItems: 'center' }}><IconImage /></span>
            Profile Picture & Identity
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '84px', height: '84px', borderRadius: '0px',
              background: avatarUrl ? 'transparent' : '#2563EB',
              border: '1px solid #CBD5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF',
              position: 'relative', overflow: 'hidden', flexShrink: 0
            }}>
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile Avatar" width={84} height={84} style={{ objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>

            <div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange}
              />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 16px', background: '#2563EB', color: '#FFFFFF',
                    border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Upload New Photo
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl(null)
                      if (userId) {
                        const userStorageKey = `bridge_profile_data_${userId}`
                        const savedData = localStorage.getItem(userStorageKey)
                        if (savedData) {
                          try {
                            const parsed = JSON.parse(savedData)
                            delete parsed.avatarUrl
                            localStorage.setItem(userStorageKey, JSON.stringify(parsed))
                            window.dispatchEvent(new Event('profile-updated'))
                          } catch {
                            // Ignore
                          }
                        }
                      }
                    }}
                    style={{
                      padding: '8px 16px', background: '#F1F5F9', color: '#EF4444',
                      border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>Saved securely and privately to your account.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Account Email</label>
              <input 
                type="email" 
                value={email} 
                disabled
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F1F5F9', color: '#64748B' }} 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Academic Bio / Personal Intro</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your academic goals, interests, or subjects..."
              style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* SECTION 2: Security & Password Management */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#2563EB', display: 'flex', alignItems: 'center' }}><IconLock /></span>
            Security & Password Update
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required if setting a new password"
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Notification & Study Preferences */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#2563EB', display: 'flex', alignItems: 'center' }}><IconSettings /></span>
            Study Preferences & Notifications
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Email Notifications</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Receive updates regarding group messages and announcements</div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                style={{
                  width: '48px', height: '26px', background: emailNotifications ? '#2563EB' : '#CBD5E1',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', background: '#FFFFFF', position: 'absolute', top: '3px',
                  left: emailNotifications ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Study Timer Reminders</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Get notified when your focus intervals conclude</div>
              </div>
              <button
                type="button"
                onClick={() => setStudyReminders(!studyReminders)}
                style={{
                  width: '48px', height: '26px', background: studyReminders ? '#2563EB' : '#CBD5E1',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', background: '#FFFFFF', position: 'absolute', top: '3px',
                  left: studyReminders ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            style={{ padding: '14px 28px', background: '#2563EB', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Saving Changes...' : 'Save All Changes'}
          </motion.button>
        </div>

      </form>
    </div>
  )
}