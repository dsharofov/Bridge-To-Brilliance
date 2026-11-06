'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  const stats = [
    { count: 'Infinity', label: 'potential' },
    { count: '6', label: 'core subjects' },
    { count: '13', label: 'expert staff' },
    { count: '100%', label: 'free access' },
    { count: '3+ yrs', label: 'focused on one mission' },
  ]

  return (
    <section style={{
      position: 'relative',
      background: '#FFFFFF',
      overflow: 'hidden',
      paddingTop: '75px', // 10px wide empty space before hero
    }}>
      {/* Background Image with 87% Opacity */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        opacity: 0.73,
        pointerEvents: 'none',
      }}>
        <Image
          src="/pictures/cbeb8b4a1542686a0c313bae67298d48.jpeg"
          alt="Bridge to Brilliance Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Hero Main Content */}
      <div style={{
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 60px 80px 80px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          maxWidth: '1300px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          
          {/* Text & CTAs Container */}
          <div style={{ maxWidth: '720px' }}>
            
            {/* Top Status Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '0px',
                background: '#EFF6FF',
                borderLeft: '3px solid #003E6B',
                borderTop: '1px solid #DBEAFE',
                borderRight: '1px solid #DBEAFE',
                borderBottom: '1px solid #DBEAFE',
                marginBottom: '28px',
              }}>
                <span style={{ color: '#003E6B', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Open Access Learning Initiative
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                fontWeight: 800,
                //color: '#040404',
                color: '#0F172A',
                lineHeight: 1.1,
                marginBottom: '24px',
                letterSpacing: '-0.03em',
              }}
            >
              Bridge the Gap to{' '}
              <span style={{ color: '#003E6B', fontWeight: 800 }}>
                Brilliance
              </span>
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontSize: '1.14rem',
                color: '#475569',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '600px',
              }}
            >
              A nonprofit learning platform providing free access to quality education. 
              Video lessons, live classes, progress tracking, 
              and more — built 
              for those who deserve brilliance
            </motion.p>

            {/* Equalized Rectangular Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ 
                display: 'flex', 
                gap: '16px', 
                flexWrap: 'wrap',
              }}
            >
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '180px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '0px',
                  background: '#003E6B',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 62, 107, 0.25)',
                  transition: 'background 0.2s ease',
                }}>
                  Get Started Free
                </button>
              </Link>

              <a href="#about" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '160px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: '0px',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  Learn More
                </button>
              </a>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Full-width Stats Bar Section Directly Below Hero */}
      <div style={{
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        padding: '50px 24px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '30px',
          textAlign: 'center',
        }}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
              }}
            >
              <div style={{
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                fontWeight: 800,
                color: '#003E6B',
                fontFamily: 'var(--font-body), sans-serif',
                letterSpacing: '-0.03em',
                marginBottom: '4px',
              }}>
                {stat.count}
              </div>
              
              <div style={{
                fontSize: '0.95rem',
                color: '#0F172A',
                fontWeight: 600,
                fontFamily: 'var(--font-body), sans-serif',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}