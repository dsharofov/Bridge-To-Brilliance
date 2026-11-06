'use client'

import { useState } from 'react'
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
]

function getCategoryColor(category: string) {
  switch (category) {
    case 'Math': return '#2563EB'
    case 'CS & Web': return '#7C3AED'
    case 'Physics': return '#9333EA'
    case 'Chemistry': return '#D97706'
    case 'Biology': return '#059669'
    case 'English': return '#DC2626'
    case 'Management': return '#EA580C'
    default: return '#1E293B'
  }
}

/* Minimal traditional line icons (no external library) */
function CategoryIcon({ category, color }: { category: string; color: string }) {
  const stroke = color
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (category) {
    case 'All':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'Math':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
          <path d="M8 8l8 8" />
          <path d="M16 8l-8 8" />
        </svg>
      )
    case 'CS & Web':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 18v2" />
          <path d="M9 10l2 2-2 2" />
          <path d="M15 10l-2 2 2 2" />
        </svg>
      )
    case 'Physics':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.5" />
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="4" />
        </svg>
      )
    case 'Chemistry':
      return (
        <svg {...common}>
          <path d="M9 3h6" />
          <path d="M10 3v6.5L6 17a3 3 0 0 0 2.6 4.5h6.8A3 3 0 0 0 18 17l-4-7.5V3" />
          <path d="M8.5 14h7" />
        </svg>
      )
    case 'Biology':
      return (
        <svg {...common}>
          <path d="M12 3c-2.5 3-4 6.5-4 10a4 4 0 0 0 8 0c0-3.5-1.5-7-4-10z" />
          <path d="M12 13v8" />
          <path d="M9 17h6" />
        </svg>
      )
    case 'English':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" />
          <path d="M8 11h6" />
        </svg>
      )
    case 'Management':
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M5 8l7-5 7 5" />
          <path d="M5 16l7 5 7-5" />
        </svg>
      )
    default:
      return null
  }
}

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // FIX: Robust role matching logic to properly catch sub-categories and variations
  const filteredMembers = teamMembers.filter((member) => {
    if (selectedCategory === 'All') return true
    const roleLower = member.role.toLowerCase()

    if (selectedCategory === 'CS & Web') {
      return roleLower.includes('cs') || roleLower.includes('web') || roleLower.includes('computer') || roleLower.includes('software')
    }
    if (selectedCategory === 'Management') {
      return roleLower.includes('manager') || roleLower.includes('coordinator') || roleLower.includes('director') || roleLower.includes('lead')
    }
    return roleLower.includes(selectedCategory.toLowerCase())
  })

  const activeColor = getCategoryColor(selectedCategory)

  return (
    <main style={{ overflowX: 'hidden', background: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '130px 24px 56px',
        background: 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F1F5F9 70%, #E2E8F0 100%)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-80px',
            left: 'calc(50% - 250px)',
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, ${activeColor}18 0%, rgba(255, 255, 255, 0) 70%)`,
            pointerEvents: 'none',
            borderRadius: '50%',
            transition: 'background 0.5s ease',
          }}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '6px',
              background: 'rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              color: '#0F172A',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            EXCELLENCE & TRADITION IN EDUCATION
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
           <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}
              >
                {/* FIX: Corrected exact logo asset filename path */}
                <Image 
                 src = '/pictures/7925bd32-d73a-411d-ab2a-1a6aaefc0df1.png' 
                  alt="BridgeToBrilliance Logo" 
                  width={46} 
                  height={46} 
                  style={{ objectFit: 'contain', borderRadius: '10px' }} 
                  priority
                />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  BridgeToBrilliance
                </span>
              </motion.div>
            </Link>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.15,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}>
              Meet the Minds Behind <br />
              <span style={{ color: activeColor, transition: 'color 0.4s ease' }}>
                Our Mission
              </span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              maxWidth: '620px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}>
              A collective of dedicated mentors and leaders building world-class learning pathways for every student.
            </p>

            {/* Metric Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              {[
                // FIX: Updated metric counts accurately reflecting team numbers
                { label: 'Expert Mentors', value: '15+' },
                { label: 'Subject Areas', value: '6' },
                { label: 'Excellence', value: '100%' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '10px',
                    minWidth: '110px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.2,
                  }}>
                    {metric.value}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#64748B',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}>
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FULL-HEIGHT TWO-COLUMN LAYOUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 0.32fr) 0.68fr',
        minHeight: 'calc(100vh - 200px)',
        background: '#F1F5F9',
      }}>
        {/* LEFT SIDEBAR — Full height, color shifts with selected subject */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(180deg, ${activeColor}0A 0%, ${activeColor}05 40%, #FFFFFF 100%)`,
            borderRight: `1px solid ${activeColor}22`,
            padding: '48px 28px 80px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            transition: 'background 0.45s ease, border-color 0.45s ease',
          }}
        >
          <div style={{ maxWidth: '280px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '6px',
            }}>
              Filter by Subject
            </h3>
            <p style={{
              fontSize: '0.84rem',
              color: '#64748B',
              marginBottom: '28px',
              lineHeight: 1.55,
            }}>
              Select a subject to focus the team and update the accent theme across the page.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat
                const catColor = getCategoryColor(cat)

                return (
                  <motion.button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    whileHover={{ scale: 1.015, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '13px 16px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isActive ? `1.5px solid ${catColor}` : '1.5px solid rgba(0, 0, 0, 0.06)',
                      background: isActive ? catColor : 'rgba(255, 255, 255, 0.7)',
                      color: isActive ? '#FFFFFF' : '#1E293B',
                      boxShadow: isActive ? `0 6px 18px ${catColor}40` : '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '7px',
                      background: isActive ? 'rgba(255,255,255,0.2)' : `${catColor}12`,
                      flexShrink: 0,
                    }}>
                      <CategoryIcon category={cat} color={isActive ? '#FFFFFF' : catColor} />
                    </span>
                    <span style={{ flex: 1 }}>{cat}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeDot"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Subtle footer note inside sidebar */}
            <div style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              <p style={{
                fontSize: '0.78rem',
                color: '#94A3B8',
                lineHeight: 1.5,
              }}>
                Theme accents and borders update automatically with your selection.
              </p>
            </div>
          </div>
        </motion.aside>

        {/* RIGHT FEED — Full-width single-column mentor cards */}
        <div style={{
          padding: '48px 40px 100px',
          background: '#F8FAFC',
        }}>
          <div style={{
            maxWidth: '820px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}>

            {/* Founder / Executive Director — Prestigious full-width card */}
            {(selectedCategory === 'All' || selectedCategory === 'Management') && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setHoveredCard('founder')}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
                  padding: '40px 36px',
                  borderRadius: '18px',
                  boxShadow: hoveredCard === 'founder'
                    ? '0 20px 40px rgba(212, 175, 55, 0.18)'
                    : '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: hoveredCard === 'founder'
                    ? '2px solid #D4AF37'
                    : '2px solid rgba(212, 175, 55, 0.35)',
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'center',
                  transition: 'border 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <div style={{
                  width: '160px',
                  height: '200px',
                  flexShrink: 0,
                  borderRadius: '12px',
                  backgroundImage: `url('/pictures/01K71K2S5XA57560QMPWM9F6MD.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'calc(50% - 30px) center',
                  backgroundRepeat: 'no-repeat',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                  border: '2px solid #D4AF37',
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#D4AF37',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'rgba(212, 175, 55, 0.12)',
                      padding: '5px 12px',
                      borderRadius: '5px',
                    }}>
                      Founder & Executive Director
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.95rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}>
                    {founder.name}
                  </h2>

                  <p style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.75,
                  }}>
                    {founder.bio}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Single-column staff members — each card takes full width of right column */}
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, i) => {
                const roleColor = getCategoryColor(
                  selectedCategory === 'All' ? member.role : selectedCategory
                )
                const isHovered = hoveredCard === member.name

                return (
                  <motion.article
                    key={member.name}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, y: -12 }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredCard(member.name)}
                    onHoverEnd={() => setHoveredCard(null)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      padding: '36px',
                      border: isHovered
                        ? `1.5px solid ${roleColor}`
                        : '1.5px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: isHovered
                        ? `0 18px 40px ${roleColor}18`
                        : '0 6px 20px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      gap: '32px',
                      alignItems: 'center',
                      transition: 'border 0.25s ease, box-shadow 0.25s ease',
                    }}
                  >
                    {/* Portrait — large rectangular frame */}
                    <div style={{
                      width: '140px',
                      height: '180px',
                      flexShrink: 0,
                      borderRadius: '12px',
                      background: member.BackgroundImage ? member.BackgroundImage : '#cbd5e1',
                      backgroundSize: 'cover',
                      backgroundPosition: member.backgroundPosition || 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                      border: `1px solid ${roleColor}30`,
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 14px',
                        borderRadius: '6px',
                        background: `${roleColor}12`,
                        color: roleColor,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        marginBottom: '12px',
                        letterSpacing: '0.02em',
                      }}>
                        <CategoryIcon
                          category={
                            selectedCategory === 'All'
                              ? (member.role.includes('Math') ? 'Math'
                                : member.role.includes('CS') || member.role.includes('web') ? 'CS & Web'
                                : member.role.includes('Physics') ? 'Physics'
                                : member.role.includes('Chemistry') ? 'Chemistry'
                                : member.role.includes('Biology') ? 'Biology'
                                : member.role.includes('English') ? 'English'
                                : member.role.includes('Manager') || member.role.includes('Coordinator') ? 'Management'
                                : 'All')
                              : selectedCategory
                          }
                          color={roleColor}
                        />
                        {member.role}
                      </div>

                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        marginBottom: '10px',
                        letterSpacing: '-0.015em',
                      }}>
                        {member.name}
                      </h3>

                      <p style={{
                        fontSize: '0.95rem',
                        color: '#475569',
                        lineHeight: 1.7,
                      }}>
                        {member.bio}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>

            {filteredMembers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#94A3B8',
                  fontSize: '1rem',
                }}
              >
                No team members found for this subject.
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}