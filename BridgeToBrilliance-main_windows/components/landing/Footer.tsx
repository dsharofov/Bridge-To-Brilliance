'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#FFFFFF',
      padding: '80px 60px 40px',
      borderTop: '1px solid #E2E8F0',
      fontFamily: 'var(--font-body), sans-serif',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Main Grid Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
          marginBottom: '60px',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //background: '#EFF6FF',
                //border: '1px solid #2563EB',
              }}>
                <Image src="/pictures/7925bd32-d73a-411d-ab2a-1a6aaefc0df1 (1).png" alt="BridgeToBrilliance" width={22} height={22} style={{ borderRadius: '0px', objectFit: 'contain' }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#003E6B',
                letterSpacing: '-0.02em',
              }}>
                BridgeToBrilliance
              </span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '280px',
            }}>
              Empowering students worldwide with free, quality education. 
              Because brilliance knows no boundaries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Quick Links
            </h4>
            {[
              { label: 'About', href: '#about' },
              { label: 'Features', href: '#features' },
              { label: 'Team', href: '/team' },
            ].map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    color: '#475569',
                    textDecoration: 'none',
                    marginBottom: '10px',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    color: '#475569',
                    textDecoration: 'none',
                    marginBottom: '10px',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Platform Platform */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Platform
            </h4>
            {[
              { label: 'Sign In', href: '/login' },
              { label: 'Register', href: '/register' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#475569',
                  textDecoration: 'none',
                  marginBottom: '10px',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect Section */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['X', 'in', 'fb', 'yt'].map((platform, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2, backgroundColor: '#EFF6FF', borderColor: '#2563EB', color: '#2563EB' }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '0px',
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    color: '#475569',
                    textDecoration: 'none',
                    fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                >
                  {platform}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: '#E2E8F0',
          marginBottom: '24px',
        }} />

        {/* Copyright & Motto */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
            © 2026 BridgeToBrilliance. All rights reserved. A nonprofit initiative.
          </p>
          <p style={{
            fontSize: '0.8rem',
            color: '#2563EB',
            fontWeight: 600,
          }}>
            &quot;Building bridges to a brighter future&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}