'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as notesService from '@/services/notes.service'
import type { StudyNote } from '@/types/database.types'

const NOTE_COLORS = ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#3B82F6', '#F97316']

// Colorful Geometric Icon for the Badge Header
function IconBadgeNotebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="url(#badgeGrad)" />
      <path d="M4 6h2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M4 10h2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M4 14h2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="square" />
      <defs>
        <linearGradient id="badgeGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
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

function IconPinGeo({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1V4H8v2h1v4.76a2 2 0 0 1-.89 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  )
}

function IconEditGeo({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

function IconNotebook({ size = 18, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h8" />
      <path d="M6 10h8" />
      <path d="M6 14h6" />
    </svg>
  )
}

export default function NotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      setIsLoading(true)
      try {
        const res = await notesService.getNotes()
        if (!cancelled && res.success && res.data) {
          setNotes(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const loadNotes = async () => {
    try {
      const res = await notesService.getNotes()
      if (res.success && res.data) setNotes(res.data)
    } catch (err) {
      console.error('Failed to reload notes:', err)
    }
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
            <IconBadgeNotebook size={16} /> Personal Study Notes
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Notes Studio
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Capture ideas, summarize lessons, and tag notes for quick retrieval.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setShowCreateModal(true) }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px', borderRadius: '0px', border: 'none',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.25)',
          }}
        >
          <IconPlusGeo size={16} color="#FFFFFF" /> New Note
        </motion.button>
      </div>

      {/* Tags Filter Row */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>Filter:</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterTag(null)}
            style={{
              padding: '6px 14px', borderRadius: '0px',
              background: !filterTag ? '#0EA5E9' : '#FFFFFF',
              border: `1px solid ${!filterTag ? '#0EA5E9' : '#CBD5E1'}`,
              color: !filterTag ? '#FFFFFF' : '#475569',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            All Notes
          </motion.button>
          {allTags.map(tag => {
            const isActive = filterTag === tag
            return (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterTag(tag)}
                style={{
                  padding: '6px 14px', borderRadius: '0px',
                  background: isActive ? '#0EA5E9' : '#FFFFFF',
                  border: `1px solid ${isActive ? '#0EA5E9' : '#CBD5E1'}`,
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                #{tag}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <IconNotebook size={32} color="#0EA5E9" />
            </motion.div>
          </div>
          Loading your study notes...
        </div>
      ) : (
        <>
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <IconPinGeo size={16} color="#D97706" />
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
                  <IconNotebook size={16} color="#0EA5E9" />
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
            <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <IconNotebook size={48} color="#0EA5E9" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Notes Created Yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 20px' }}>Capture your study thoughts, bullet points, and summaries all in one place!</p>
              <button
                onClick={() => { resetForm(); setShowCreateModal(true) }}
                style={{ padding: '12px 24px', borderRadius: '0px', background: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Your First Note
              </button>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Note Modal */}
      <AnimatePresence>
        {(showCreateModal || editingNote) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: '20px',
            }}
            onClick={() => { setShowCreateModal(false); setEditingNote(null) }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF', border: '1px solid #CBD5E1',
                borderRadius: '0px', padding: '32px', width: '100%', maxWidth: '580px',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                {editingNote ? 'Edit Study Note' : 'New Study Note'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Record your lesson notes and concepts securely.</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Clinical Anatomy Review"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your detailed study notes here..."
                  rows={7}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box', lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Tags (comma separated)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="anatomy, pharmacology, surgery"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'block' }}>
                  Note Accent Color
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '0px',
                        background: c,
                        border: color === c ? '3px solid #0F172A' : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowCreateModal(false); setEditingNote(null); resetForm() }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '0px',
                    background: '#F1F5F9', border: '1px solid #CBD5E1',
                    color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
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
                    flex: 1, padding: '12px', borderRadius: '0px', border: 'none',
                    background: title.trim() && content.trim() ? 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)' : '#E2E8F0',
                    color: title.trim() && content.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: title.trim() && content.trim() ? 'pointer' : 'default',
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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '24px',
        borderTop: `4px solid ${note.color}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <IconNotebook size={16} color={note.color} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
              {note.title}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: '0' }}>
            <button
              onClick={() => onPin(note)}
              style={{
                background: note.is_pinned ? '#FEF3C7' : '#F8FAFC',
                border: `1px solid ${note.is_pinned ? '#F59E0B' : '#CBD5E1'}`,
                color: note.is_pinned ? '#D97706' : '#64748B',
                cursor: 'pointer', width: '30px', height: '30px', borderRadius: '0px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={note.is_pinned ? 'Unpin Note' : 'Pin Note'}
            >
              <IconPinGeo size={14} color={note.is_pinned ? '#D97706' : '#64748B'} />
            </button>
            <button
              onClick={() => onEdit(note)}
              style={{
                background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#64748B',
                cursor: 'pointer', width: '30px', height: '30px', borderRadius: '0px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Edit Note"
            >
              <IconEditGeo size={14} color="#64748B" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              style={{
                background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#EF4444',
                cursor: 'pointer', width: '30px', height: '30px', borderRadius: '0px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Delete Note"
            >
              <IconTrashGeo size={14} color="#EF4444" />
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
              <span key={tag} style={{ padding: '3px 10px', borderRadius: '0px', background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', fontWeight: 600, border: '1px solid #CBD5E1' }}>
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