'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { founder, teamMembers } from '@/data/team'

const CATEGORIES = [
  'All',
  'Math',
  'CS & Web',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Management',
] as const

type Category = (typeof CATEGORIES)[number]


function resolveCategoryFromRole(role: string): Category {
  const r = role.toLowerCase()
  if (r.includes('physics')) return 'Physics'
  if (r.includes('math')) return 'Math'
  if (r.includes('chemistry')) return 'Chemistry'
  if (r.includes('biology')) return 'Biology'
  if (r.includes('english')) return 'English'
  if (/\bcs\b/.test(r) || r.includes('web') || r.includes('computer') || r.includes('software')) {
    return 'CS & Web'
  }
  if (r.includes('manager') || r.includes('coordinator') || r.includes('director') || r.includes('lead')) {
    return 'Management'
  }
  return 'All'
}

function getCategoryAccent(category: Category): { primary: string; tint: string } {
  switch (category) {
    case 'Math':
      return { primary: '#1D4ED8', tint: '#EFF6FF' }
    case 'CS & Web':
      return { primary: '#6D28D9', tint: '#F5F3FF' }
    case 'Physics':
      return { primary: '#9B59B6', tint: '#F0F9FF' }
    case 'Chemistry':
      return { primary: '#B45309', tint: '#FFFBEB' }
    case 'Biology':
      return { primary: '#047857', tint: '#ECFDF5' }
    case 'English':
      return { primary: '#B91C1C', tint: '#FEF2F2' }
    case 'Management':
      return { primary: '#C2410C', tint: '#FFF7ED' }
    default:
      return { primary: '#0F172A', tint: '#F1F5F9' }
  }
}

function CategoryIcon({ category, color }: { category: Category; color: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.85,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (category) {
    case 'All':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    case 'Math':
      return (
        <svg {...common}>
          <path d="M4 12h16" />
          <path d="M12 4v16" />
          <path d="M7 7l10 10" />
          <path d="M17 7L7 17" />
        </svg>
      )
    case 'CS & Web':
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'Physics':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        </svg>
      )
    case 'Chemistry':
      return (
        <svg {...common}>
          <path d="M9 3h6" />
          <path d="M10 3v6.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 9.5V3" />
          <path d="M8 14h8" />
        </svg>
      )
    case 'Biology':
      return (
        <svg {...common}>
          <path d="M12 3c-2.5 3-4 6.5-4 10a4 4 0 0 0 8 0c0-3.5-1.5-7-4-10z" />
          <path d="M12 13v8" />
        </svg>
      )
    case 'English':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'Management':
      return (
        <svg {...common}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
  }
}

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      All: teamMembers.length,
      Math: 0,
      'CS & Web': 0,
      Physics: 0,
      Chemistry: 0,
      Biology: 0,
      English: 0,
      Management: 0,
    }
    teamMembers.forEach((m) => {
      const cat = resolveCategoryFromRole(m.role)
      if (cat !== 'All') counts[cat] += 1
    })
    return counts
  }, [])

  const filteredMembers = useMemo(() => {
    if (selectedCategory === 'All') return teamMembers
    return teamMembers.filter((member) => resolveCategoryFromRole(member.role) === selectedCategory)
  }, [selectedCategory])

  const activeAccent = getCategoryAccent(selectedCategory)
  const showFounder = selectedCategory === 'All' || selectedCategory === 'Management'

  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh', color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
      <Navbar />

      {/* EDITORIAL ARCHITECTURAL HEADER */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '132px 24px 56px',
      }}>
        <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '32px',
          }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                  <Image
                    src="/pictures/7925bd32-d73a-411d-ab2a-1a6aaefc0df1.png"
                    alt="BridgeToBrilliance Logo"
                    width={32}
                    height={32}
                    style={{ objectFit: 'contain', borderRadius: '4px' }}
                    priority
                  />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#003E6B',
                  }}>
                    BridgeToBrilliance STAFF
                  </span>
                </Link>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: '18px',
              }}>
                Academic Mentors &amp; <br />
                <span style={{ color: activeAccent.primary, transition: 'color 0.3s ease' }}>
                  Institutional Leadership
                </span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '600px',
                margin: 0,
              }}>
                Structured mentorship led by subject specialists, olympiad coaches, and student leaders committed to rigorous, accessible education.
              </p>
            </div>

            {/* Minimalist Architectural Metrics Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(96px, 1fr))',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              background: '#FAFAFA',
              overflow: 'hidden',
            }}>
              {[
                { label: 'Mentors', value: `${teamMembers.length + 1}` },
                { label: 'Disciplines', value: '6' },
                { label: 'Access', value: '100%' },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '16px 20px',
                    borderRight: idx < 2 ? '1px solid #E2E8F0' : 'none',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#64748B',
                    marginTop: '4px',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* STICKY HORIZONTAL DISCIPLINE FILTER BAR */}
      <nav
        aria-label="Filter team by discipline"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{
          maxWidth: '1220px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            const accent = getCategoryAccent(cat)
            const count = cat === 'All' ? teamMembers.length + 1 : categoryCounts[cat] + (cat === 'Management' ? 1 : 0)

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  border: isActive ? `1px solid ${accent.primary}` : '1px solid #E2E8F0',
                  background: isActive ? accent.primary : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <CategoryIcon category={cat} color={isActive ? '#FFFFFF' : accent.primary} />
                <span>{cat}</span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* MAIN CONTENT CONTAINER */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '48px 24px 104px' }}>
        {/* EXECUTIVE SPOTLIGHT: FOUNDER */}
        {showFounder && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #B45309',
              borderRadius: '6px',
              padding: '32px',
              marginBottom: '44px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              gridColumn: '1 / -1',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '148px',
                height: '188px',
                flexShrink: 0,
                borderRadius: '4px',
                backgroundImage: `url('/pictures/01K71K2S5XA57560QMPWM9F6MD.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'calc(50% - 30px) center',
                backgroundRepeat: 'no-repeat',
                border: '1px solid #CBD5E1',
              }} />

              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  Founder &amp; Executive Director
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}>
                  {founder.name}
                </h2>

                <p style={{
                  fontSize: '0.98rem',
                  color: '#475569',
                  lineHeight: 1.7,
                  maxWidth: '780px',
                  margin: 0,
                }}>
                  {founder.bio}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION HEADER WITH ACTIVE COUNT */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          marginBottom: '28px',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            {selectedCategory === 'All' ? 'All Academic Mentors & Staff' : `${selectedCategory} Department`}
          </h2>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B' }}>
            Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {/* TWO-COLUMN ARCHITECTURAL DIRECTORY GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
          gap: '20px',
        }}>
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => {
              const resolvedCat = resolveCategoryFromRole(member.role)
              const accent = getCategoryAccent(resolvedCat)
              const isHovered = hoveredId === member.name

              return (
                <motion.article
                  key={member.name}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}
                  onHoverStart={() => setHoveredId(member.name)}
                  onHoverEnd={() => setHoveredId(null)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    border: isHovered ? `1px solid ${accent.primary}` : '1px solid #E2E8F0',
                    borderLeft: `3px solid ${accent.primary}`,
                    padding: '24px',
                    display: 'flex',
                    gap: '22px',
                    alignItems: 'flex-start',
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  {/* Sharp Rectangular 3:4 Portrait */}
                  <div style={{
                    width: '112px',
                    height: '148px',
                    flexShrink: 0,
                    borderRadius: '4px',
                    background: member.BackgroundImage ? member.BackgroundImage : '#E2E8F0',
                    backgroundSize: 'cover',
                    backgroundPosition: member.backgroundPosition || 'center',
                    backgroundRepeat: 'no-repeat',
                    border: '1px solid #E2E8F0',
                  }} />

                  {/* Structured Bio Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 9px',
                      borderRadius: '3px',
                      background: accent.tint,
                      color: accent.primary,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      marginBottom: '10px',
                    }}>
                      <CategoryIcon category={resolvedCat} color={accent.primary} />
                      <span>{member.role}</span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.22rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      letterSpacing: '-0.015em',
                      marginBottom: '8px',
                      lineHeight: 1.25,
                    }}>
                      {member.name}
                    </h3>

                    <p style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.62,
                      margin: 0,
                    }}>
                      {member.bio}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredMembers.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '56px 24px',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.95rem',
          }}>
            No team members listed under this discipline yet.
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}