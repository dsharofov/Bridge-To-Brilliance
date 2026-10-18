// 'use client'

// import { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import * as studyService from '@/services/study.service'
// import type { Bookmark } from '@/types/database.types'

// export default function BookmarksPage() {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [title, setTitle] = useState('')
//   const [url, setUrl] = useState('')
//   const [notes, setNotes] = useState('')

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       const res = await studyService.getBookmarks()
//       if (!cancelled && res.success && res.data) setBookmarks(res.data)
//     }
//     load()
//     return () => { cancelled = true }
//   }, [])

//   const loadBookmarks = async () => {
//     const res = await studyService.getBookmarks()
//     if (res.success && res.data) setBookmarks(res.data)
//   }

//   const handleCreate = async () => {
//     if (!title.trim()) return
//     const res = await studyService.createBookmark(title, null, null, url || null, notes || null)
//     if (res.success) { setShowCreateModal(false); setTitle(''); setUrl(''); setNotes(''); loadBookmarks() }
//   }

//   const handleDelete = async (id: string) => {
//     const res = await studyService.deleteBookmark(id)
//     if (res.success) loadBookmarks()
//   }

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <div>
//           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
//             Bookmarks 🔖
//           </h1>
//           <p style={{ color: 'rgba(0,0,0,0.5)' }}>Save lessons and resources for quick access</p>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1ABC9C, #16A085)', color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
//         >
//           + Add Bookmark
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
//         {bookmarks.length === 0 ? (
//           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
//             <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔖</div>
//             <p style={{ color: 'rgba(0,0,0,0.5)' }}>No bookmarks yet. Save resources you want to revisit!</p>
//           </div>
//         ) : (
//           bookmarks.map(bm => (
//             <motion.div
//               key={bm.id}
//               whileHover={{ y: -4 }}
//               style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '20px' }}
//             >
//               <div style={{ willChange: 'transform, opacity',  display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
//                 <h3 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#1A1A2E', flex: 1 }}>{bm.title}</h3>
//                 <button onClick={() => handleDelete(bm.id)} style={{ willChange: 'transform, opacity',  background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '0.9rem' }}>🗑️</button>
//               </div>
//               {bm.url && (
//                 <a href={bm.url} target="_blank" rel="noopener noreferrer" style={{ willChange: 'transform, opacity',  fontSize: '0.8rem', color: '#1ABC9C', textDecoration: 'none', wordBreak: 'break-all', display: 'block', marginBottom: '8px' }}>
//                   🔗 {bm.url}
//                 </a>
//               )}
//               {bm.notes && (
//                 <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', marginBottom: '12px' }}>{bm.notes}</p>
//               )}
//               <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.3)' }}>
//                 {new Date(bm.created_at).toLocaleDateString()}
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>

//       <AnimatePresence>
//         {showCreateModal && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{ willChange: 'transform, opacity',  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
//             onClick={() => setShowCreateModal(false)}
//           >
//             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}>
//               <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '24px' }}>Add Bookmark</h2>
//               <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
//               <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL (optional)" style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
//               <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={3} style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '16px' }} />
//               <div style={{ willChange: 'transform, opacity',  display: 'flex', gap: '12px' }}>
//                 <button onClick={() => setShowCreateModal(false)} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
//                 <button onClick={handleCreate} disabled={!title.trim()} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: title.trim() ? 'linear-gradient(135deg, #1ABC9C, #16A085)' : 'rgba(0,0,0,0.03)', color: title.trim() ? 'white' : 'rgba(0,0,0,0.3)', fontSize: '0.9rem', fontWeight: 600, cursor: title.trim() ? 'pointer' : 'default' }}>Save</button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as studyService from '@/services/study.service'
import type { Bookmark } from '@/types/database.types'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const res = await studyService.getBookmarks()
      if (!cancelled && res.success && res.data) setBookmarks(res.data)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const loadBookmarks = async () => {
    const res = await studyService.getBookmarks()
    if (res.success && res.data) setBookmarks(res.data)
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
            padding: '4px 12px',
            borderRadius: '20px',
            background: '#F0FDFA',
            border: '1px solid #CCFBF1',
            color: '#0D9488',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <span>🔖</span> Saved Resources
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Bookmarks
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Save important lessons, articles, and reference links for quick access</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 22px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
          }}
        >
          + Add Bookmark
        </motion.button>
      </div>

      {/* Bookmarks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {bookmarks.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔖</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Bookmarks Saved Yet</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>Save articles, documentation, or online lessons that you want to revisit later!</p>
          </div>
        ) : (
          bookmarks.map(bm => (
            <motion.div
              key={bm.id}
              whileHover={{ y: -4 }}
              style={{
                willChange: 'transform, opacity',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                //justify: 'space-between',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5EEAD4'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(13, 148, 136, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
                    {bm.title}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(bm.id)}
                    style={{
                      background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#EF4444',
                      cursor: 'pointer', fontSize: '0.85rem', width: '32px', height: '32px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                    title="Delete Bookmark"
                  >
                    🗑️
                  </motion.button>
                </div>

                {bm.url && (
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.82rem', color: '#0D9488', textDecoration: 'none',
                      wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      marginBottom: '12px', fontWeight: 600, background: '#F0FDFA', padding: '6px 10px',
                      borderRadius: '8px', border: '1px solid #CCFBF1', width: '100%', boxSizing: 'border-box',
                    }}
                  >
                    <span>🔗</span>
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

      {/* Add Bookmark Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              willChange: 'transform, opacity',
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '20px',
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                willChange: 'transform, opacity',
                background: '#FFFFFF', border: '1px solid #E2E8F0',
                borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '460px',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
                Add New Bookmark 🔖
              </h2>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Khan Academy Calculus Cheat Sheet"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  URL Link (optional)
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
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
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    background: '#F1F5F9', border: '1px solid #CBD5E1',
                    color: '#475569', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
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
                    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                    background: title.trim() ? 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' : '#E2E8F0',
                    color: title.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.92rem', fontWeight: 700, cursor: title.trim() ? 'pointer' : 'default',
                    boxShadow: title.trim() ? '0 4px 14px rgba(13, 148, 136, 0.25)' : 'none',
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