// 'use client'

// import { useEffect, useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import * as notesService from '@/services/notes.service'
// import type { StudyNote } from '@/types/database.types'

// const NOTE_COLORS = ['#4169E1', '#9B59B6', '#27AE60', '#E74C3C', '#F39C12', '#1ABC9C', '#3498DB', '#E67E22']

// export default function NotesPage() {
//   const [notes, setNotes] = useState<StudyNote[]>([])
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [editingNote, setEditingNote] = useState<StudyNote | null>(null)
//   const [filterTag, setFilterTag] = useState<string | null>(null)

//   // Form
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [color, setColor] = useState('#4169E1')
//   const [tags, setTags] = useState('')

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       const res = await notesService.getNotes()
//       if (!cancelled && res.success && res.data) setNotes(res.data)
//     }
//     load()
//     return () => { cancelled = true }
//   }, [])

//   const loadNotes = async () => {
//     const res = await notesService.getNotes()
//     if (res.success && res.data) setNotes(res.data)
//   }

//   const handleCreate = async () => {
//     if (!title.trim() || !content.trim()) return
//     const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
//     const res = await notesService.createNote(title, content, null, null, tagList, color)
//     if (res.success) {
//       setShowCreateModal(false)
//       resetForm()
//       loadNotes()
//     }
//   }

//   const handleUpdate = async () => {
//     if (!editingNote || !title.trim() || !content.trim()) return
//     const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
//     const res = await notesService.updateNote(editingNote.id, { title, content, tags: tagList, color })
//     if (res.success) {
//       setEditingNote(null)
//       resetForm()
//       loadNotes()
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const res = await notesService.deleteNote(id)
//     if (res.success) loadNotes()
//   }

//   const handleTogglePin = async (note: StudyNote) => {
//     await notesService.updateNote(note.id, { is_pinned: !note.is_pinned })
//     loadNotes()
//   }

//   const openEdit = (note: StudyNote) => {
//     setEditingNote(note)
//     setTitle(note.title)
//     setContent(note.content)
//     setColor(note.color)
//     setTags(note.tags.join(', '))
//   }

//   const resetForm = () => {
//     setTitle('')
//     setContent('')
//     setColor('#4169E1')
//     setTags('')
//   }

//   const allTags = Array.from(new Set(notes.flatMap(n => n.tags)))
//   const filteredNotes = filterTag ? notes.filter(n => n.tags.includes(filterTag)) : notes
//   const pinnedNotes = filteredNotes.filter(n => n.is_pinned)
//   const otherNotes = filteredNotes.filter(n => !n.is_pinned)

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <div>
//           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
//             My Notes 📝
//           </h1>
//           <p style={{ color: 'rgba(0,0,0,0.5)' }}>Organize your study notes</p>
//         </div>
//         <button
//           onClick={() => { resetForm(); setShowCreateModal(true) }}
//           style={{
//             padding: '10px 20px', borderRadius: '10px', border: 'none',
//             background: 'linear-gradient(135deg, #27AE60, #1E8449)',
//             color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
//           }}
//         >
//           + New Note
//         </button>
//       </div>

//       {/* Tags Filter */}
//       {allTags.length > 0 && (
//         <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
//           <button
//             onClick={() => setFilterTag(null)}
//             style={{
//               padding: '6px 14px', borderRadius: '20px',
//               background: !filterTag ? 'rgba(65, 105, 225, 0.2)' : 'rgba(0,0,0,0.03)',
//               border: `1px solid ${!filterTag ? 'rgba(65, 105, 225, 0.3)' : 'rgba(0,0,0,0.08)'}`,
//               color: !filterTag ? '#4169E1' : 'rgba(0,0,0,0.5)',
//               fontSize: '0.8rem', cursor: 'pointer',
//             }}
//           >
//             All
//           </button>
//           {allTags.map(tag => (
//             <button
//               key={tag}
//               onClick={() => setFilterTag(tag)}
//               style={{
//                 padding: '6px 14px', borderRadius: '20px',
//                 background: filterTag === tag ? 'rgba(65, 105, 225, 0.2)' : 'rgba(0,0,0,0.03)',
//                 border: `1px solid ${filterTag === tag ? 'rgba(65, 105, 225, 0.3)' : 'rgba(0,0,0,0.08)'}`,
//                 color: filterTag === tag ? '#4169E1' : 'rgba(0,0,0,0.5)',
//                 fontSize: '0.8rem', cursor: 'pointer',
//               }}
//             >
//               #{tag}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Pinned Notes */}
//       {pinnedNotes.length > 0 && (
//         <div style={{ marginBottom: '24px' }}>
//           <h3 style={{ color: '#FFB300', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
//             📌 Pinned
//           </h3>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
//             {pinnedNotes.map(note => (
//               <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={handleDelete} onPin={handleTogglePin} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Other Notes */}
//       {otherNotes.length > 0 && (
//         <div>
//           {pinnedNotes.length > 0 && (
//             <h3 style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
//               Other Notes
//             </h3>
//           )}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
//             {otherNotes.map(note => (
//               <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={handleDelete} onPin={handleTogglePin} />
//             ))}
//           </div>
//         </div>
//       )}

//       {notes.length === 0 && (
//         <div style={{ textAlign: 'center', padding: '60px' }}>
//           <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
//           <p style={{ color: 'rgba(0,0,0,0.5)' }}>No notes yet. Create your first note!</p>
//         </div>
//       )}

//       {/* Create/Edit Modal */}
//       <AnimatePresence>
//         {(showCreateModal || editingNote) && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{ willChange: 'transform, opacity',  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
//             onClick={() => { setShowCreateModal(false); setEditingNote(null) }}
//           >
//             <motion.div
//               initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
//               onClick={(e) => e.stopPropagation()}
//               style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto' }}
//             >
//               <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '24px' }}>
//                 {editingNote ? 'Edit Note' : 'New Note'}
//               </h2>
//               <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
//               <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..." rows={8} style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '12px' }} />
//               <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '8px', display: 'block' }}>Color</label>
//                 <div style={{ display: 'flex', gap: '8px' }}>
//                   {NOTE_COLORS.map(c => (
//                     <button key={c} onClick={() => setColor(c)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: c, border: color === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display: 'flex', gap: '12px' }}>
//                 <button onClick={() => { setShowCreateModal(false); setEditingNote(null); resetForm() }} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
//                 <button onClick={editingNote ? handleUpdate : handleCreate} disabled={!title.trim() || !content.trim()} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: title.trim() && content.trim() ? 'linear-gradient(135deg, #27AE60, #1E8449)' : 'rgba(0,0,0,0.03)', color: title.trim() && content.trim() ? 'white' : 'rgba(0,0,0,0.3)', fontSize: '0.9rem', fontWeight: 600, cursor: title.trim() && content.trim() ? 'pointer' : 'default' }}>{editingNote ? 'Save' : 'Create'}</button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// function NoteCard({ note, onEdit, onDelete, onPin }: { note: StudyNote; onEdit: (n: StudyNote) => void; onDelete: (id: string) => void; onPin: (n: StudyNote) => void }) {
//   return (
//     <motion.div whileHover={{ y: -4 }} style={{ willChange: 'transform, opacity',  background: '#ffffff', border: `1px solid ${note.color}30`, borderRadius: '16px', padding: '20px', borderTop: `3px solid ${note.color}` }}>
//       <div style={{ willChange: 'transform, opacity',  display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
//         <h3 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#1A1A2E', flex: 1 }}>{note.title}</h3>
//         <div style={{ willChange: 'transform, opacity',  display: 'flex', gap: '4px' }}>
//           <button onClick={() => onPin(note)} style={{ willChange: 'transform, opacity',  background: 'none', border: 'none', color: note.is_pinned ? '#FFB300' : 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}>📌</button>
//           <button onClick={() => onEdit(note)} style={{ willChange: 'transform, opacity',  background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}>✏️</button>
//           <button onClick={() => onDelete(note.id)} style={{ willChange: 'transform, opacity',  background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}>🗑️</button>
//         </div>
//       </div>
//       <p style={{ willChange: 'transform, opacity',  fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6, marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
//         {note.content.slice(0, 200)}{note.content.length > 200 ? '...' : ''}
//       </p>
//       {note.tags.length > 0 && (
//         <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
//           {note.tags.map(tag => (
//             <span key={tag} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)', fontSize: '0.7rem' }}>#{tag}</span>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as notesService from '@/services/notes.service'
import type { StudyNote } from '@/types/database.types'

const NOTE_COLORS = ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#3B82F6', '#F97316']

export default function NotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#2563EB')
  const [tags, setTags] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const res = await notesService.getNotes()
      if (!cancelled && res.success && res.data) setNotes(res.data)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const loadNotes = async () => {
    const res = await notesService.getNotes()
    if (res.success && res.data) setNotes(res.data)
  }

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await notesService.createNote(title, content, null, null, tagList, color)
    if (res.success) {
      setShowCreateModal(false)
      resetForm()
      loadNotes()
    }
  }

  const handleUpdate = async () => {
    if (!editingNote || !title.trim() || !content.trim()) return
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await notesService.updateNote(editingNote.id, { title, content, tags: tagList, color })
    if (res.success) {
      setEditingNote(null)
      resetForm()
      loadNotes()
    }
  }

  const handleDelete = async (id: string) => {
    const res = await notesService.deleteNote(id)
    if (res.success) loadNotes()
  }

  const handleTogglePin = async (note: StudyNote) => {
    await notesService.updateNote(note.id, { is_pinned: !note.is_pinned })
    loadNotes()
  }

  const openEdit = (note: StudyNote) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setColor(note.color)
    setTags(note.tags.join(', '))
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setColor('#2563EB')
    setTags('')
  }

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)))
  const filteredNotes = filterTag ? notes.filter(n => n.tags.includes(filterTag)) : notes
  const pinnedNotes = filteredNotes.filter(n => n.is_pinned)
  const otherNotes = filteredNotes.filter(n => !n.is_pinned)

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
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <span>📝</span> Organized Knowledge
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            My Notes
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Capture ideas, summarize lessons, and tag notes for quick retrieval</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setShowCreateModal(true) }}
          style={{
            padding: '12px 22px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
          }}
        >
          + New Note
        </motion.button>
      </div>

      {/* Tags Filter Row */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>Filter:</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterTag(null)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              background: !filterTag ? '#2563EB' : '#FFFFFF',
              border: `1px solid ${!filterTag ? '#2563EB' : '#CBD5E1'}`,
              color: !filterTag ? '#FFFFFF' : '#475569',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: !filterTag ? '0 2px 6px rgba(37, 99, 235, 0.2)' : 'none',
            }}
          >
            All Notes
          </motion.button>
          {allTags.map(tag => {
            const isActive = filterTag === tag
            return (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag(tag)}
                style={{
                  padding: '6px 14px', borderRadius: '20px',
                  background: isActive ? '#2563EB' : '#FFFFFF',
                  border: `1px solid ${isActive ? '#2563EB' : '#CBD5E1'}`,
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              >
                #{tag}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1rem' }}>📌</span>
            <h3 style={{ color: '#0F172A', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, margin: 0 }}>
              Pinned Notes
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={handleDelete} onPin={handleTogglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      {otherNotes.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          {pinnedNotes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1rem' }}>📚</span>
              <h3 style={{ color: '#0F172A', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, margin: 0 }}>
                All Notes
              </h3>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {otherNotes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={handleDelete} onPin={handleTogglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Notes Created Yet</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 20px' }}>Capture your study thoughts, bullet points, and summaries all in one place!</p>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true) }}
            style={{ padding: '12px 24px', borderRadius: '12px', background: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Your First Note
          </button>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      <AnimatePresence>
        {(showCreateModal || editingNote) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              willChange: 'transform, opacity',
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '20px',
            }}
            onClick={() => { setShowCreateModal(false); setEditingNote(null) }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                willChange: 'transform, opacity',
                background: '#FFFFFF', border: '1px solid #E2E8F0',
                borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '580px',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
                {editingNote ? 'Edit Study Note ✏️' : 'New Study Note 📝'}
              </h2>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Newton's Laws of Motion Summary"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your detailed study notes here..."
                  rows={7}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box', lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Tags (comma separated)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="physics, mechanics, formulas"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'block' }}>
                  Note Accent Color
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: c,
                        border: color === c ? '3px solid #0F172A' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowCreateModal(false); setEditingNote(null); resetForm() }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    background: '#F1F5F9', border: '1px solid #CBD5E1',
                    color: '#475569', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: title.trim() && content.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: title.trim() && content.trim() ? 0.98 : 1 }}
                  onClick={editingNote ? handleUpdate : handleCreate}
                  disabled={!title.trim() || !content.trim()}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                    background: title.trim() && content.trim() ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#E2E8F0',
                    color: title.trim() && content.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.92rem', fontWeight: 700, cursor: title.trim() && content.trim() ? 'pointer' : 'default',
                    boxShadow: title.trim() && content.trim() ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
                  }}
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

function NoteCard({ note, onEdit, onDelete, onPin }: { note: StudyNote; onEdit: (n: StudyNote) => void; onDelete: (id: string) => void; onPin: (n: StudyNote) => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        willChange: 'transform, opacity',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        borderTop: `4px solid ${note.color}`,
        display: 'flex',
        flexDirection: 'column',
        //justify: 'space-between',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(16, 185, 129, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.35, flex: 1 }}>
            {note.title}
          </h3>
          <div style={{ display: 'flex', gap: '4px', flexShrink: '0' }}>
            <button
              onClick={() => onPin(note)}
              style={{
                background: note.is_pinned ? '#FEF3C7' : '#F8FAFC',
                border: `1px solid ${note.is_pinned ? '#F59E0B' : '#CBD5E1'}`,
                color: note.is_pinned ? '#D97706' : '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', width: '30px', height: '30px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={note.is_pinned ? 'Unpin Note' : 'Pin Note'}
            >
              📌
            </button>
            <button
              onClick={() => onEdit(note)}
              style={{
                background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', width: '30px', height: '30px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Edit Note"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(note.id)}
              style={{
                background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#EF4444',
                cursor: 'pointer', fontSize: '0.85rem', width: '30px', height: '30px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Delete Note"
            >
              🗑️
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, marginBottom: '16px', whiteSpace: 'pre-wrap', margin: '0 0 16px' }}>
          {note.content.length > 180 ? `${note.content.slice(0, 180)}...` : note.content}
        </p>
      </div>

      <div>
        {note.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {note.tags.map(tag => (
              <span key={tag} style={{ padding: '3px 10px', borderRadius: '10px', background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', fontWeight: 600 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
          Updated {new Date(note.created_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  )
}