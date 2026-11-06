'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import * as groupsService from '@/services/study-groups.service'
import * as chatService from '@/services/chat.service'
import type { StudyGroup, ChatMessage } from '@/types/database.types'

const COLORS = ['#2563EB', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#3B82F6', '#F97316']

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  
  // Editing state
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create form state
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formColor, setFormColor] = useState('#2563EB')
  const [formPublic, setFormPublic] = useState(true)

  // Local storage keys for persistent membership and chat messages across refreshes
  const MY_GROUPS_STORAGE_KEY = 'bridge_to_brilliance_my_joined_groups_v3'

  const getDefaultDiscoverGroups = (): StudyGroup[] => [
    { id: 'd-1', name: 'Advanced Mathematics & Calculus', description: 'Problem-solving sessions for integrals and derivatives', color: '#2563EB', is_public: true, icon: '📖' },
    { id: 'd-2', name: 'Physics Mechanics Hub', description: 'Kinematics, momentum, and vector components', color: '#8B5CF6', is_public: true, icon: '📖' },
    { id: 'd-3', name: 'Full-Stack Web Engineering', description: 'Next.js, React architecture, and Supabase databases', color: '#10B981', is_public: true, icon: '📖' },
    { id: 'd-4', name: 'IELTS Academic Essay Writing', description: 'Task 2 vocabulary, coherence, and rhetorical structure', color: '#EF4444', is_public: true, icon: '📖' }
  ] as unknown as StudyGroup[]

  const loadData = async () => {
    setLoading(true)
    try {
      const [allRes, myRes] = await Promise.all([
        groupsService.getGroups({ isPublic: true }),
        groupsService.getMyGroups(),
      ])
      
      const fetchedAll: StudyGroup[] = allRes.success && allRes.data ? allRes.data : []
      const fetchedMy: StudyGroup[] = myRes.success && myRes.data ? myRes.data : []
      const defaultGroups = getDefaultDiscoverGroups()

      const allKnownGroups: StudyGroup[] = [...fetchedAll, ...fetchedMy, ...defaultGroups]

      // Restore joined groups from localStorage
      let resolvedMy: StudyGroup[] = fetchedMy
      const savedJoinedIds = localStorage.getItem(MY_GROUPS_STORAGE_KEY)
      if (savedJoinedIds) {
        try {
          const parsedIds: string[] = JSON.parse(savedJoinedIds)
          const restoredMy = allKnownGroups.filter(g => parsedIds.includes(g.id))
          const mergedMyMap = new Map<string, StudyGroup>()
          ;[...fetchedMy, ...restoredMy].forEach(g => mergedMyMap.set(g.id, g))
          resolvedMy = Array.from(mergedMyMap.values())
        } catch {
          // ignore parsing error
        }
      }

      setGroups(fetchedAll.length > 0 ? fetchedAll : defaultGroups)
      setMyGroups(resolvedMy)
    } catch (err) {
      console.error('Failed to load study groups:', err)
      setGroups(getDefaultDiscoverGroups())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Save joined groups to localStorage whenever myGroups changes
  useEffect(() => {
    if (myGroups.length > 0) {
      const ids = myGroups.map(g => g.id)
      localStorage.setItem(MY_GROUPS_STORAGE_KEY, JSON.stringify(ids))
    }
  }, [myGroups])

  // Persistent messages loading when selectedGroup changes
  const storageKey = selectedGroup ? `bridge_group_chat_msgs_${selectedGroup.id}` : null

  useEffect(() => {
    if (selectedGroup && storageKey) {
      const savedMsgs = localStorage.getItem(storageKey)
      if (savedMsgs) {
        try {
          setMessages(JSON.parse(savedMsgs))
          return
        } catch {
          // fallback
        }
      }

      // Default initial community welcoming messages
      const initial = [
        {
          id: 'welcome-1',
          group_id: selectedGroup.id,
          user_id: 'system',
          content: `Welcome to ${selectedGroup.name}! Feel free to share notes, questions, videos, links, and revision materials here.`,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          sender: { full_name: 'Community Moderator' }
        }
      ] as unknown as ChatMessage[]
      setMessages(initial)
      localStorage.setItem(storageKey, JSON.stringify(initial))
    }
  }, [selectedGroup, storageKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveMessagesToStorage = (updated: ChatMessage[]) => {
    setMessages(updated)
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }

  const handleCreateGroup = async () => {
    if (!formName.trim()) return
    setActionError(null)
    const newGrp = {
      id: 'group-' + Date.now(),
      name: formName.trim(),
      description: formDesc.trim(),
      color: formColor,
      is_public: formPublic,
      icon: '📖'
    } as unknown as StudyGroup

    try {
      await groupsService.createGroup(formName, formDesc, '📖', formColor, null, formPublic, 50)
    } catch {
      // handled via local state
    }

    setShowCreateModal(false)
    setFormName('')
    setFormDesc('')
    const updatedMy = [newGrp, ...myGroups]
    setMyGroups(updatedMy)
    localStorage.setItem(MY_GROUPS_STORAGE_KEY, JSON.stringify(updatedMy.map(g => g.id)))
    setSelectedGroup(newGrp)
  }

  const handleJoinGroup = async (groupId: string) => {
    setActionError(null)
    const allKnown = [...groups, ...myGroups, ...getDefaultDiscoverGroups()]
    const target = allKnown.find(g => g.id === groupId)
    
    try {
      await groupsService.joinGroup(groupId)
    } catch {
      // proceed with local persistence
    }

    if (target && !myGroups.some(g => g.id === target.id)) {
      const updatedMy = [target, ...myGroups]
      setMyGroups(updatedMy)
      localStorage.setItem(MY_GROUPS_STORAGE_KEY, JSON.stringify(updatedMy.map(g => g.id)))
      setSelectedGroup(target)
    } else if (target) {
      setSelectedGroup(target)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedGroup || !newMessage.trim() || sending) return
    setSending(true)
    const text = newMessage.trim()
    setNewMessage('')

    let sentMsg: ChatMessage | null = null
    try {
      const res = await chatService.sendMessage(selectedGroup.id, text)
      if (res.success && res.data) {
        sentMsg = res.data as ChatMessage
      }
    } catch {
      // fallback local message
    }

    if (!sentMsg) {
      sentMsg = {
        id: 'msg-' + Date.now(),
        group_id: selectedGroup.id,
        user_id: 'me',
        content: text,
        created_at: new Date().toISOString(),
        sender: { full_name: 'You' }
      } as unknown as ChatMessage
    }

    saveMessagesToStorage([...messages, sentMsg])
    setSending(false)
  }

  const handleDeleteMessage = (msgId: string) => {
    const updated = messages.filter(m => m.id !== msgId)
    saveMessagesToStorage(updated)
  }

  const handleEditMessage = (msgId: string, currentContent: string) => {
    setEditingMsgId(msgId)
    setEditText(currentContent)
  }

  const handleSaveEdit = (msgId: string) => {
    if (!editText.trim()) return
    const updated = messages.map(m => m.id === msgId ? { ...m, content: editText.trim() } : m)
    saveMessagesToStorage(updated)
    setEditingMsgId(null)
    setEditText('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGroup || !e.target.files?.[0]) return
    const file = e.target.files[0]
    const fileUrl = URL.createObjectURL(file)
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    const fileMsg = {
      id: 'file-' + Date.now(),
      group_id: selectedGroup.id,
      user_id: 'me',
      content: `Shared file: ${file.name}`,
      attachment_url: fileUrl,
      attachment_type: isVideo ? 'video' : isImage ? 'image' : 'file',
      created_at: new Date().toISOString(),
      sender: { full_name: 'You' }
    } as unknown as ChatMessage

    saveMessagesToStorage([...messages, fileMsg])
  }

  const myGroupIds = new Set(myGroups.map(g => g.id))

  const filteredMyGroups = myGroups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const discoverList = groups.length > 0 ? groups : getDefaultDiscoverGroups()
  const filteredDiscoverGroups = discoverList.filter(g => 
    !myGroupIds.has(g.id) && 
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '0px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Peer Collaboration</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Study Groups
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Collaborate, share knowledge, and build your learning community</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 22px', borderRadius: '0px', border: 'none',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          }}
        >
          + Create Group
        </motion.button>
      </div>

      {actionError && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.88rem' }}>
          {actionError}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '16px', top: '15px', color: '#94A3B8', pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search study groups by name or topic..."
          style={{
            width: '100%',
            padding: '14px 18px 14px 46px',
            borderRadius: '0px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#0F172A',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedGroup ? '320px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Groups I am in & Discover Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* SECTION 1: Groups I am in */}
          <div>
            <h3 style={{ color: '#0F172A', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Groups I Am In ({filteredMyGroups.length})</span>
            </h3>

            {filteredMyGroups.length === 0 ? (
              <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.88rem', textAlign: 'center' }}>
                You haven&apos;t joined any groups yet. Discover or create one below!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMyGroups.map(group => {
                  const isSelected = selectedGroup?.id === group.id
                  return (
                    <motion.button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      whileHover={{ x: 4 }}
                      style={{
                        willChange: 'transform, opacity',
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 16px', borderRadius: '0px',
                        background: isSelected ? '#EFF6FF' : '#FFFFFF',
                        border: `1px solid ${isSelected ? '#93C5FD' : '#E2E8F0'}`,
                        color: '#0F172A', cursor: 'pointer', textAlign: 'left',
                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '0px',
                        background: `${group.color || '#2563EB'}15`, border: `1px solid ${group.color || '#2563EB'}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={group.color || '#2563EB'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {group.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {group.description || 'Active community workspace'}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: Discover Groups */}
          <div>
            <h3 style={{ color: '#0F172A', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Discover New Groups</span>
            </h3>

            {loading ? (
              <div style={{ color: '#64748B', textAlign: 'center', padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>Loading groups...</div>
            ) : filteredDiscoverGroups.length === 0 ? (
              <div style={{ color: '#64748B', textAlign: 'center', padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>No groups found matching your search.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredDiscoverGroups.map(group => (
                  <motion.div
                    key={group.id}
                    whileHover={{ x: 4 }}
                    style={{
                      willChange: 'transform, opacity',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '0px',
                      background: '#FFFFFF', border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '0px',
                      background: `${group.color || '#2563EB'}15`, border: `1px solid ${group.color || '#2563EB'}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={group.color || '#2563EB'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 14v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {group.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {group.description || 'Discover and share knowledge'}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinGroup(group.id)}
                      style={{
                        padding: '6px 14px', borderRadius: '0px', border: 'none',
                        background: '#EFF6FF', color: '#2563EB',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Join
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area Panel */}
        {selectedGroup && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 200px)',
            minHeight: '540px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.05)',
            overflow: 'hidden',
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '0px',
                  background: `${selectedGroup.color || '#2563EB'}18`, border: `1px solid ${selectedGroup.color || '#2563EB'}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selectedGroup.color || '#2563EB'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{selectedGroup.name}</div>
                  <div style={{ fontSize: '0.81rem', color: '#64748B', marginTop: '1px' }}>{selectedGroup.description || 'Community Study Hub'}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGroup(null)}
                style={{
                  background: 'none', border: 'none', fontSize: '1.1rem', color: '#64748B', cursor: 'pointer',
                  padding: '6px', borderRadius: '0px',
                }}
                title="Close Chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Scroll Area with persistence & support for videos, images, links */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#FDFEFE' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', paddingTop: '60px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No messages yet.</div>
                  <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Start the conversation and enjoy your learning journey!</div>
                </div>
              ) : (
                messages.map(msg => {
                  const isEditing = editingMsgId === msg.id
                  const isMyMessage = (msg as unknown as { user_id?: string }).user_id === 'me' || (msg as unknown as { sender?: { full_name: string } }).sender?.full_name === 'You'

                  return (
                    <div key={msg.id} style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '0px',
                            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF',
                          }}>
                            {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name?.[0] || 'S'}
                          </div>
                          <span style={{ fontSize: '0.84rem', color: '#1E293B', fontWeight: 700 }}>
                            {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name || 'Student Peer'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Edit & Delete Actions for user's own messages */}
                        {isMyMessage && !isEditing && (
                          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                            <button
                              onClick={() => handleEditMessage(msg.id, msg.content || '')}
                              style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Editing Mode */}
                      {isEditing ? (
                        <div style={{ marginLeft: '38px', marginTop: '6px', display: 'flex', gap: '8px' }}>
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                              flex: 1, padding: '8px 12px', border: '1px solid #2563EB',
                              borderRadius: '0px', fontSize: '0.9rem', outline: 'none', background: '#FFFFFF'
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(msg.id)}
                            style={{ padding: '6px 12px', background: '#2563EB', color: '#FFFFFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMsgId(null)}
                            style={{ padding: '6px 12px', background: '#E2E8F0', color: '#475569', border: 'none', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Attachment or Image / Video */}
                          {msg.attachment_url && (msg.attachment_type === 'image' || msg.attachment_url.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
                            <div style={{ position: 'relative', maxWidth: '300px', marginTop: '6px', marginLeft: '38px' }}>
                              <Image src={msg.attachment_url} alt={msg.content || 'Shared image'} width={300} height={200} style={{
                                borderRadius: '0px', objectFit: 'cover', border: '1px solid #E2E8F0',
                              }} />
                            </div>
                          ) : msg.attachment_url && (msg.attachment_type === 'video' || msg.attachment_url.match(/\.(mp4|webm|ogg)$/i)) ? (
                            <div style={{ marginLeft: '38px', marginTop: '6px', maxWidth: '320px' }}>
                              <video controls width="100%" style={{ borderRadius: '0px', border: '1px solid #E2E8F0' }}>
                                <source src={msg.attachment_url} />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : msg.attachment_url ? (
                            <div style={{ marginLeft: '38px', marginTop: '4px' }}>
                              <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '0px',
                                background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE',
                                fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600,
                              }}>
                                📎 {msg.content || 'File attachment'}
                              </a>
                            </div>
                          ) : (
                            <div style={{
                              marginLeft: '38px',
                              padding: '12px 16px', borderRadius: '0px',
                              background: '#F1F5F9', color: '#0F172A', fontSize: '0.9rem',
                              lineHeight: 1.5, maxWidth: '80%', display: 'inline-block',
                              wordBreak: 'break-word',
                            }}>
                              {msg.content}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer with Non-Cartoonish Minimalist Attachment Button */}
            <div style={{
              padding: '18px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex', gap: '12px', alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '42px', height: '42px', borderRadius: '0px',
                  background: '#FFFFFF', border: '1px solid #CBD5E1',
                  color: '#64748B', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
                title="Attach file, image, or video"
              >
                {/* Traditional Minimalistic Paperclip SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message, link, or thought..."
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: '0px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A', fontSize: '0.92rem', outline: 'none',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                style={{
                  padding: '12px 22px', borderRadius: '0px', border: 'none',
                  background: newMessage.trim() ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#E2E8F0',
                  color: newMessage.trim() ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.92rem', fontWeight: 700, cursor: newMessage.trim() ? 'pointer' : 'default',
                  boxShadow: newMessage.trim() ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none',
                }}
              >
                Send
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
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
                borderRadius: '0px', padding: '36px', width: '100%', maxWidth: '500px',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
                Create Study Group 📚
              </h2>

              {/* Group Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Group Name *
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Advanced Calculus Prep"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="What topics will you be covering?"
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '0px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Color Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Theme Color
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormColor(color)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '0px',
                        background: color,
                        border: formColor === color ? '3px solid #0F172A' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Public Toggle */}
              <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px 16px', borderRadius: '0px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Public Group</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Allow peers to discover and join this group</div>
                </div>
                <button
                  onClick={() => setFormPublic(!formPublic)}
                  style={{
                    width: '48px', height: '26px', borderRadius: '0px',
                    background: formPublic ? '#2563EB' : '#CBD5E1',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '0px',
                    background: '#FFFFFF', position: 'absolute', top: '3px',
                    left: formPublic ? '25px' : '3px', transition: 'left 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }} />
                </button>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: '1', padding: '14px', borderRadius: '0px',
                    background: '#F1F5F9', border: '1px solid #CBD5E1',
                    color: '#475569', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: formName.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: formName.trim() ? 0.98 : 1 }}
                  onClick={handleCreateGroup}
                  disabled={!formName.trim()}
                  style={{
                    flex: '1', padding: '14px', borderRadius: '0px', border: 'none',
                    background: formName.trim() ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#E2E8F0',
                    color: formName.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.92rem', fontWeight: 700, cursor: formName.trim() ? 'pointer' : 'default',
                    boxShadow: formName.trim() ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
                  }}
                >
                  Create Group
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}