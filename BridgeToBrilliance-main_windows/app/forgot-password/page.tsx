'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyingSession, setVerifyingSession] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Dynamic randomized glowing & twinkling stars
  const stars = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3.5 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }))
  }, [])

  // Listen for Supabase session initialization or URL code exchange from the recovery link
  useEffect(() => {
    const handleSessionExchange = async () => {
      // 1. Check if there's a 'code' query parameter in the URL (Supabase PKCE flow)
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError('Invalid or expired reset link. Please request a new one.')
        }
      }

      // 2. Check if active session now exists
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setVerifyingSession(false)
      } else {
        // Fallback check after short delay for token hash parsing
        setTimeout(async () => {
          const laterData = await supabase.auth.getSession()
          if (laterData.data.session) {
            setVerifyingSession(false)
          } else {
            setVerifyingSession(false)
            setError('Auth session missing or expired. Please request a new password reset link.')
          }
        }, 1500)
      }
    }

    handleSessionExchange()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setVerifyingSession(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A',
      padding: '20px',
      fontFamily: 'var(--font-body), sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <motion.div 
        animate={{ backgroundPosition: ['0px 0px', '220px 220px'] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: '-50px',
          backgroundImage: 'url("/pictures/photo-1605106702734-205df224ecce.avif")',
          backgroundRepeat: 'repeat',
          backgroundSize: '220px',
          zIndex: 0,
        }}
      />

      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{ repeat: Infinity, duration: star.duration, delay: star.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#B3E5FC',
            borderRadius: '50%',
            boxShadow: '0 0 10px #90CAF9, 0 0 18px #003366',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.76)', zIndex: 2 }} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '0px',
          padding: '44px 38px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
          textAlign: 'center',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Image 
              src="/pictures/7925bd32-d73a-411d-ab2a-1a6aaefc0df1 (1).png" 
              alt="BridgeToBrilliance" 
              width={36} 
              height={36} 
              style={{ borderRadius: '0px', objectFit: 'contain' }} 
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#003366', letterSpacing: '-0.5px' }}>
              BridgeToBrilliance
            </span>
          </div>
        </Link>

        {success ? (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#003366' }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Password Updated!
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
              Your password has been successfully reset. You can now log in with your new credentials.
            </p>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '14px', background: '#003366', color: '#FFF', border: 'none', fontWeight: 800, fontSize: '0.9rem', borderRadius: '0px', cursor: 'pointer'
              }}>
                Go to Log In
              </button>
            </Link>
          </>
        ) : verifyingSession ? (
          <div style={{ padding: '40px 0', color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
            Verifying secure session...
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Set New Password
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '28px' }}>
              Enter your new secure password below
            </p>

            <form onSubmit={handleUpdatePassword}>
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {error && (
                <div style={{ padding: '12px 16px', borderRadius: '0px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 600, marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#003366', color: '#FFF', border: 'none', fontWeight: 800, fontSize: '0.9rem', borderRadius: '0px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}