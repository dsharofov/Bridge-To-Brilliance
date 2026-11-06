'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ['about', 'features']
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveHash(`#${section}`)
            return
          }
        }
      }
      if (window.scrollY < 300) setActiveHash('')
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '/team', label: 'Staff' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#FFFFFF',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
          transition: 'background 0.3s ease, border-bottom 0.3s ease',
          fontFamily: 'var(--font-body), sans-serif',
          color: '#0F172A',
          height: '64px',
        }}
      >
        {/* Main Wrapper matching website content container width and padding */}
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5px',
        }}>
          
          {/* Left: Logo & Nav Links Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <Link 
              href="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center',
              }}
            >
              <motion.div
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  position: 'relative',
                  width: '52px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image 
                  src="/pictures/7925bd32-d73a-411d-ab2a-1a6aaefc0df1 (1).png" 
                  alt="BridgeToBrilliance Logo" 
                  fill
                  sizes="100px"
                  priority
                  style={{ objectFit: 'contain' }} 
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
              {navLinks.map(link => {
                const isActive = link.href.startsWith('/') ? pathname === link.href : activeHash === link.href
                return (
                  <div key={link.href} style={{ position: 'relative', padding: '6px 0' }}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        href={link.href} 
                        style={{ 
                          color: '#003E6B', 
                          textDecoration: 'none', 
                          fontSize: '0.85rem', 
                          fontWeight: 700, 
                          letterSpacing: '0.08em', 
                          transition: 'color 0.2s' 
                        }}
                      >
                        {link.label.toUpperCase()}
                      </Link>
                    ) : (
                      <a 
                        href={link.href} 
                        onClick={() => setActiveHash(link.href)} 
                        style={{ 
                          color: '#003E6B', 
                          textDecoration: 'none', 
                          fontSize: '0.85rem', 
                          fontWeight: 700, 
                          letterSpacing: '0.08em', 
                          transition: 'color 0.2s' 
                        }}
                      >
                        {link.label.toUpperCase()}
                      </a>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: '#003E6B',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Profile Icon & Auth Links (Log In / Sign Up) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-top-auth">
            {/* Profile Icon Link */}
            <Link 
              href="/login" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#003E6B',
                textDecoration: 'none',
                background: '#F1F5F9',
                borderRadius: '0px',
                width: '32px',
                height: '32px',
                transition: 'background 0.2s ease',
              }}
              title="User Account"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            <Link 
              href="/login" 
              style={{ 
                color: '#475569', 
                textDecoration: 'none', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                transition: 'color 0.2s' 
              }}
            >
              LOG IN
            </Link>
            <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>|</span>
            <Link 
              href="/register" 
              style={{ 
                color: '#003E6B', 
                textDecoration: 'none', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                transition: 'color 0.2s' 
              }}
            >
              SIGN UP
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '0px',
              color: '#0F172A',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </motion.button>

        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '280px',
              background: '#FFFFFF',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              padding: '80px 24px 32px',
              gap: '12px',
              borderLeft: '1px solid #CBD5E1',
              boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', color: '#0F172A' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Account</span>
            </div>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#475569',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '10px 14px',
              }}
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#2563EB',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '10px 14px',
              }}
            >
              Sign Up
            </Link>
            <div style={{ borderTop: '1px solid #E2E8F0', margin: '8px 0' }} />
            {navLinks.map(link => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#0F172A',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '10px 14px',
                    background: pathname === link.href ? '#EFF6FF' : 'transparent',
                    borderLeft: pathname === link.href ? '3px solid #2563EB' : '3px solid transparent',
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#0F172A',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '10px 14px',
                  }}
                >
                  {link.label}
                </a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              zIndex: 98,
            }}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-top-auth { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  )
}