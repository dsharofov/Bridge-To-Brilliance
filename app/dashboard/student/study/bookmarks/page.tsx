'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as studyService from '@/services/study.service'
import type { Bookmark } from '@/types/database.types'

// Traditional Geometric SVG Icons
function IconTraditionalStar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#starGradBm)" />
      <defs>
        <linearGradient id="starGradBm" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function IconPlusGeo({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  )
}

function IconBookmarkGeo({ size = 18, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconExternalGeo({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function IconTrashGeo({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await studyService.getBookmarks()
        if (!cancelled && res.success && res.data) setBookmarks(res.data)
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const loadBookmarks = async () => {
    try {
      const res = await studyService.getBookmarks()
      if (res.success && res.data) setBookmarks(res.data)
    } catch (err) {
      console.error('Failed to reload bookmarks:', err)
    }
  }

  const handleCreate = async () => {
    if (!title.trim()) return
    const res = await studyService.createBookmark(title, null, null, url || null, notes || null)
    if (res.success) { 
      setShowCreateModal(false)
      setTitle('')
      setUrl('')
      setNotes('')
      loadBookmarks() 
    }
  }

  const handleDelete = async (id: string) => {
    const res = await studyService.deleteBookmark(id)
    if (res.success) loadBookmarks()
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '0px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
            border: '1px solid #CBD5E1',
            color: '#0F766E',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            <IconTraditionalStar size={16} /> Saved Resources
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Bookmarks
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Save important lessons, articles, and reference links for quick access.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px', borderRadius: '0px', border: 'none',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.25)',
          }}
        >
          <IconPlusGeo size={16} color="#FFFFFF" /> Add Bookmark
        </motion.button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <IconBookmarkGeo size={32} color="#0EA5E9" />
            </motion.div>
          </div>
          Loading your bookmarks...
        </div>
      ) : (
        /* Bookmarks Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {bookmarks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <IconBookmarkGeo size={48} color="#0EA5E9" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Bookmarks Saved Yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 20px' }}>Save articles, documentation, or online medical lessons that you want to revisit later!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ padding: '12px 24px', borderRadius: '0px', background: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Add Your First Bookmark
              </button>
            </div>
          ) : (
            bookmarks.map(bm => (
              <motion.div
                key={bm.id}
                whileHover={{ y: -4 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px', // Rounded corners for card only
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  //justify: 'space-between',
                  boxShadow: '0 4px 16px rgba(14, 165, 233, 0.05)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0EA5E9'
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(14, 165, 233, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <IconBookmarkGeo size={18} color="#0EA5E9" />
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
                        {bm.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(bm.id)}
                      style={{
                        background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#EF4444',
                        cursor: 'pointer', width: '30px', height: '30px', borderRadius: '0px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                      title="Delete Bookmark"
                    >
                      <IconTrashGeo size={14} color="#EF4444" />
                    </button>
                  </div>

                  {bm.url && (
                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.82rem', color: '#0EA5E9', textDecoration: 'none',
                        wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        marginBottom: '12px', fontWeight: 700, background: '#EFF6FF', padding: '8px 12px',
                        borderRadius: '0px', border: '1px solid #BFDBFE', width: '100%', boxSizing: 'border-box',
                      }}
                    >
                      <IconExternalGeo size={14} color="#0EA5E9" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bm.url}</span>
                    </a>
                  )}

                  {bm.notes && (
                    <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px' }}>
                      {bm.notes}
                    </p>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: 'auto' }}>
                  Saved on {new Date(bm.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Bookmark Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '20px',
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF', border: '1px solid #CBD5E1',
                borderRadius: '0px', padding: '32px', width: '100%', maxWidth: '460px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Add New Bookmark
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Save useful resources, articles, and references.</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Clinical Pharmacology Guidelines"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  URL Link (optional)
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a quick note about why you bookmarked this..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '0px',
                    background: '#F1F5F9', border: '1px solid #CBD5E1',
                    color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: title.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: title.trim() ? 0.98 : 1 }}
                  onClick={handleCreate}
                  disabled={!title.trim()}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '0px', border: 'none',
                    background: title.trim() ? 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)' : '#E2E8F0',
                    color: title.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: title.trim() ? 'pointer' : 'default',
                  }}
                >
                  Save Bookmark
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}