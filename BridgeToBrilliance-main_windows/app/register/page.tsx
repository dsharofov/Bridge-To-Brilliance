'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  staffCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  // Generate randomized positions and animation timings for glowing stars
  const stars = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }))
  }, [])

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')

    // SECURITY CHECK: If role is teacher, enforce secret staff code validation
    if (selectedRole === 'teacher') {
      const SECRET_TEACHER_CODE = 'BRIDGETB_STAFF_2026' // Change this to your preferred secure staff code
      if (!data.staffCode || data.staffCode.trim() !== SECRET_TEACHER_CODE) {
        setError('Invalid staff secret code. Teacher registration is restricted to authorized faculty members.')
        setLoading(false)
        return
      }
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: selectedRole,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (signUpData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: signUpData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: selectedRole,
      })

      if (profileError) {
        setError('Profile creation failed: ' + profileError.message)
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
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
        {/* Animated Background Pattern Layer */}
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

        {/* Glowing & Disappearing Stars Layer */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.3, 0.8] }}
            transition={{ repeat: Infinity, duration: star.duration, delay: star.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#90CAF9',
              borderRadius: '50%',
              boxShadow: '0 0 8px #90CAF9, 0 0 16px #1565C0',
              zIndex: 1,
            }}
          />
        ))}

        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.86)', zIndex: 2 }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            maxWidth: '440px',
            background: '#FFFFFF',
            borderRadius: '0px',
            padding: '48px 40px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#003366' }}>✓</div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '12px',
          }}>
            Check Your Email!
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
            We&apos;ve sent a verification link to your email. Please verify your account before signing in.
          </p>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '12px 32px',
              background: '#003366',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '0px',
              cursor: 'pointer',
            }}>
              Go to Sign In
            </button>
          </Link>
        </motion.div>
      </div>
    )
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
      {/* Animated Background Pattern Layer */}
      <motion.div 
        animate={{ backgroundPosition: ['0px 0px', '220px 220px'] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: '-50px',
          backgroundImage: 'url("/pictures/photo-1605106702734-205df224ecce.avif")',
          backgroundRepeat: 'repeat',
          backgroundSize: '220px',
          zIndex: 0,
        }}
      />

      {/* Glowing & Disappearing Stars Constellation Layer */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.1, scale: 0.8 }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.4, 0.8] }}
          transition={{ repeat: Infinity, duration: star.duration, delay: star.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#90CAF9',
            borderRadius: '50%',
            boxShadow: '0 0 8px #90CAF9, 0 0 16px #1565C0',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Dark Frosted Contrast Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.86)', zIndex: 2 }} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: '0px',
          padding: '40px 36px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            Create Account
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
            Select your role and setup credentials
          </p>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            I am signing up as a:
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              onClick={() => setSelectedRole('student')}
              style={{
                flex: 1,
                padding: '14px 12px',
                borderRadius: '0px',
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedRole === 'student' ? '2px solid #003366' : '1px solid #CBD5E1',
                background: selectedRole === 'student' ? '#E3F2FD' : '#F8FAFC',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRole === 'student' ? '#003366' : '#475569' }}>Student</div>
            </div>

            <div
              onClick={() => setSelectedRole('teacher')}
              style={{
                flex: 1,
                padding: '14px 12px',
                borderRadius: '0px',
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedRole === 'teacher' ? '2px solid #003366' : '1px solid #CBD5E1',
                background: selectedRole === 'teacher' ? '#E3F2FD' : '#F8FAFC',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRole === 'teacher' ? '#003366' : '#475569' }}>Teacher</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              {...register('full_name')}
              type="text"
              placeholder="Your Name"
              style={inputStyle(!!errors.full_name)}
            />
            {errors.full_name && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.full_name.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="example@example.com"
              style={inputStyle(!!errors.email)}
            />
            {errors.email && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.email.message}</p>}
          </div>

          {/* TEACHER SECRET CODE FIELD (Only renders when Teacher role is picked) */}
          <AnimatePresence>
            {selectedRole === 'teacher' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#003366', marginBottom: '6px' }}>
                  Staff Secret Access Code *
                </label>
                <input
                  {...register('staffCode')}
                  type="password"
                  placeholder="Enter authorized faculty code"
                  style={inputStyle(false)}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Required for faculty registration. Contact admin if you do not have this code.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              style={inputStyle(!!errors.password)}
            />
            {errors.password && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.password.message}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              style={inputStyle(!!errors.confirmPassword)}
            />
            {errors.confirmPassword && <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>{errors.confirmPassword.message}</p>}
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
            {loading ? 'Creating Account...' : `Create ${selectedRole === 'teacher' ? 'Teacher' : 'Student'} Account`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#003366', textDecoration: 'none', fontWeight: 700 }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}