'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  // Dynamic randomized glowing & twinkling stars
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3.5 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }))
  }, [])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Get user role for redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      const role = profile?.role || 'student'
      router.push(`/dashboard/${role}`)
      router.refresh()
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '0px',
    border: `1px solid ${hasError ? '#DC2626' : '#CBD5E1'}`,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body), sans-serif',
    boxSizing: 'border-box' as const,
    background: '#FFFFFF',
    color: '#0F172A',
  })

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
      {/* Dynamic Animated Repeating Pattern Layer */}
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

      {/* Interactive Glowing Stars Layer */}
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

      {/* Slightly Lighter Dark Contrast Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.72)', zIndex: 2 }} />

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
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '6px',
          }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
            Log in to continue your learning workstation
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              style={inputStyle(!!errors.email)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#003366'}
              onBlur={(e) => e.currentTarget.style.borderColor = errors.email ? '#DC2626' : '#CBD5E1'}
            />
            {errors.email && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              style={inputStyle(!!errors.password)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#003366'}
              onBlur={(e) => e.currentTarget.style.borderColor = errors.password ? '#DC2626' : '#CBD5E1'}
            />
            {errors.password && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.password.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: '#003366', textDecoration: 'none', fontWeight: 700 }}>
              Forgot password?
            </Link>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                borderRadius: '0px',
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                color: '#DC2626',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#003366',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              borderRadius: '0px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)',
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748B' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#003366', textDecoration: 'none', fontWeight: 700 }}>
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}