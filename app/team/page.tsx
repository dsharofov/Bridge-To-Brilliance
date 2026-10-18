'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { founder, teamMembers } from '@/data/team'

// Helper function to assign colors by sphere
function getRoleColor(role: string): string {
  if (role.includes('Math')) return '#1565C0'
  if (role.includes('CS') || role.includes('web')) return '#6A1B9A'
  if (role.includes('Physics')) return '#9B59B6'
  if (role.includes('English')) return '#C62828'
  if (role.includes('Biology')) return '#2E7D32'
  if (role.includes('Chemistry')) return '#FFB300'
  if (role.includes("Media Manager")) return "#E67E22"
  if (role.includes("Academic Coordinator")) return "#78281F"
  return '#5D6D7E'
}

const CATEGORIES = [
  'All',
  'Math',
  'CS & Web',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Management',
]

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter team members based on category badge click
  const filteredMembers = teamMembers.filter((member) => {
    if (selectedCategory === 'All') return true
    if (selectedCategory === 'CS & Web') return member.role.includes('CS') || member.role.includes('web')
    if (selectedCategory === 'Management') return member.role.includes('Manager') || member.role.includes('Coordinator')
    return member.role.includes(selectedCategory)
  })

  return (
    <main style={{ overflowX: 'hidden' }}>
      <Navbar />

      {/* Modern, Complex Hero Section */}
      <section style={{
        position: 'relative',
        padding: '140px 24px 80px',
        background: 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F0F4FF 60%, #E8EEFF 100%)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(65, 105, 225, 0.08)',
        overflow: 'hidden',
      }}>
        {/* Animated Background Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-100px',
            left: 'calc(50% - 250px)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255, 179, 0, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            top: '40px',
            right: '10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(65, 105, 225, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(65, 105, 225, 0.08)',
              border: '1px solid rgba(65, 105, 225, 0.18)',
              color: '#4169E1',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>✨</span>
            <span>Passionate Educators & Leaders</span>
          </motion.div>

          {/* Main Brand Logo & Title Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                <Image src="/pictures/logo.png" alt="BridgeToBrilliance" width={44} height={44} style={{ borderRadius: '12px', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#4169E1', letterSpacing: '-0.02em' }}>
                  BridgeToBrilliance
                </span>
              </div>
            </Link>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
              fontWeight: 800,
              color: '#1A1A2E',
              lineHeight: 1.15,
              marginBottom: '18px',
              letterSpacing: '-0.02em',
            }}>
              Meet the Minds Behind <br />
              <span style={{
                background: 'linear-gradient(135deg, #FFB300 0%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Our Mission
              </span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'rgba(26, 26, 46, 0.7)', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.6 }}>
              A collective of dedicated mentors, educators, and innovators working together to make world-class learning completely accessible to everyone.
            </p>
          </motion.div>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginBottom: '40px',
              padding: '16px 28px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 10px 30px rgba(65, 105, 225, 0.05)',
              backdropFilter: 'blur(10px)',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E' }}>15+</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Mentors & Staff</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(0,0,0,0.1)' }} />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1565C0' }}>6</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Subject Spheres</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(0,0,0,0.1)' }} />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFB300' }}>100%</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Free Education</div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Content Section */}
      <div style={{ padding: '80px 40px', background: '#dddde9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Founder Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <div style={{
              width: '160px', height: '213px',
              borderRadius: '16px',
              backgroundImage: "url('/pictures/01K71K2S5XA57560QMPWM9F6MD.jpg')",
              backgroundSize: 'cover',      
              backgroundPosition: 'calc(50% - 30px) center',   
              backgroundRepeat: 'no-repeat',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>
              {founder.name}
            </h2>
            <p style={{ fontSize: '1rem', color: '#D4AF37', fontWeight: 600, marginBottom: '12px' }}>
              {founder.role}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.65)', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
              {founder.bio}
            </p>
          </motion.div>

          {/* Sphere Filter Category Pills (Moved right below founder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '60px',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    border: isActive ? '1px solid #4169E1' : '1px solid rgba(0,0,0,0.08)',
                    background: isActive ? '#4169E1' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.7)',
                    boxShadow: isActive ? '0 4px 14px rgba(65, 105, 225, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </motion.div>

          {/* Filtered Team Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}>
            {filteredMembers.map((member, i) => {
              const isLastRowOdd = filteredMembers.length % 3 === 1 && i >= filteredMembers.length - 1
              const isLastRowTwo = filteredMembers.length % 3 === 2 && i >= filteredMembers.length - 2

              return (
                <motion.div
                  key={member.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{
                    background: '#dddde9',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    gridColumn: isLastRowOdd ? '2 / 3' : isLastRowTwo ? undefined : undefined,
                  }}
                >
                  <div style={{
                    width: '120px', 
                    height: '160px',
                    borderRadius: '12px',
                    background: member.BackgroundImage ? member.BackgroundImage : '#b0b0b0',
                    backgroundSize: 'cover',
                    backgroundPosition: member.backgroundPosition || 'center',
                    backgroundRepeat: 'no-repeat',
                    margin: '0 auto 20px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: getRoleColor(member.role), fontWeight: 600, marginBottom: '10px' }}>
                    {member.role}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>
                    {member.bio}
                  </p>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}