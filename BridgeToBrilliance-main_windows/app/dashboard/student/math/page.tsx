'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/app/dashboard/layout'
import type { Profile } from '@/types/database.types'

type Lesson = {
  id: string
  title: string
  video_url: string
  keyword: string
  teacher_name: string
  created_at: string
  duration_seconds?: number
  student_notes?: string
  //teacher_notes?: string
  playlist?: string
}

type QuizQuestion = {

  id: string
  question_text: string
  options: string[]
  correct_option_index: number
  explanation: string
  media_url?: string
}

type Quiz = {
  id: string
  title: string
  description: string
  passing_percent: number
  allowed_attempts: number
  questions: QuizQuestion[]
  created_at: string
}

type QuizAttempt = {
  id: string
  quiz_id: string
  score_percent: number
  passed: boolean
  answers: number[]
  attempted_at: string
  overall_feedback?: string
  tries?: number
}

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message_text: string
  is_read: boolean
  created_at: string
}

type ClassMaterial = {
  id: string
  title: string
  file_url: string
  uploaded_by: string
  created_at: string
  student_notes?: string
  //teacher_notes?: string
}

export default function MathStudentPortal() {
  const profile = useProfile()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'playlists' | 'messages' | 'quizzes' | 'stream'>('playlists')

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [materials, setMaterials] = useState<ClassMaterial[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  // Playlist View & Search State
  const [selectedPlaylistModule, setSelectedPlaylistModule] = useState<string | null>(null)
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('')
  const [playlistTopicQuery, setPlaylistTopicQuery] = useState('')
  const [playlistInstructorQuery, setPlaylistInstructorQuery] = useState('')
  const [lessonSortOrder, setLessonSortOrder] = useState<'newest' | 'oldest'>('newest') // <-- Added sort filter state

  // Messaging & Context Menu State 
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastVisitedMap, setLastVisitedMap] = useState<{ [userId: string]: string }>({})
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Material Search State
  const [materialSearchQuery, setMaterialSearchQuery] = useState('')

  // Unlocking State
  const [unlockedLessonIds, setUnlockedLessonIds] = useState<string[]>([])
  const [keywordInputs, setKeywordInputs] = useState<{ [lessonId: string]: string }>({})
  const [errorMessages, setErrorMessages] = useState<{ [lessonId: string]: string }>({})

  // 10-Star Rating State
  const [lessonRatings, setLessonRatings] = useState<{ [lessonId: string]: number }>({})
  const [hasVoted, setHasVoted] = useState<{ [lessonId: string]: boolean }>({})
  const [communityRatings, setCommunityRatings] = useState<{ [lessonId: string]: { total: number; count: number } }>({})
  const [hoveredStar, setHoveredStar] = useState<{ [lessonId: string]: number | null }>({})

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({})
  const [submittedAttempt, setSubmittedAttempt] = useState<{ score: number; passed: boolean; answers: { [key: number]: number }; feedback?: string } | null>(null)

  const storageKey = profile ? `math_unlocked_lessons_${profile.id || profile.email || 'student'}` : 'math_unlocked_lessons_default'
  const ratingStorageKey = profile ? `math_lesson_ratings_${profile.id}` : 'math_lesson_ratings_default'
  const votedStorageKey = profile ? `math_voted_lessons_${profile.id}` : 'math_voted_lessons_default'
  const communityStorageKey = 'math_community_ratings_global_v3'
  const visitStorageKey = profile ? `last_visited_chats_${profile.id}` : 'last_visited_chats_default'
  const quizAttemptStorageKey = profile ? `math_quiz_attempts_${profile.id}` : 'math_quiz_attempts_default'

  useEffect(() => {
    const savedUnlocked = localStorage.getItem(storageKey)
    if (savedUnlocked) { try { const parsed = JSON.parse(savedUnlocked); if (Array.isArray(parsed)) setUnlockedLessonIds(parsed) } catch (e) { console.error(e) } }
    
    const savedRatings = localStorage.getItem(ratingStorageKey)
    if (savedRatings) { try { setLessonRatings(JSON.parse(savedRatings)) } catch (e) { console.error(e) } }
    
    const savedVoted = localStorage.getItem(votedStorageKey)
    if (savedVoted) { try { setHasVoted(JSON.parse(savedVoted)) } catch (e) { console.error(e) } }

    const savedCommunity = localStorage.getItem(communityStorageKey) || localStorage.getItem('math_global_community_ratings_v1')
    if (savedCommunity) { try { setCommunityRatings(JSON.parse(savedCommunity)) } catch (e) { console.error(e) } }

    const savedVisits = localStorage.getItem(visitStorageKey)
    if (savedVisits) { try { setLastVisitedMap(JSON.parse(savedVisits)) } catch (e) { console.error(e) } }

    const savedQuizzes = localStorage.getItem('math_quizzes_global_v3') || localStorage.getItem('math_quizzes_global_v2') || localStorage.getItem('math_quizzes_global_v1')
    if (savedQuizzes) { try { setQuizzes(JSON.parse(savedQuizzes)) } catch (e) { console.error(e) } }

    const savedAttempts = localStorage.getItem('math_quiz_attempts_global_v3') || localStorage.getItem(quizAttemptStorageKey)
    if (savedAttempts) { try { setQuizAttempts(JSON.parse(savedAttempts)) } catch (e) { console.error(e) } }
  }, [storageKey, ratingStorageKey, votedStorageKey, communityStorageKey, visitStorageKey, quizAttemptStorageKey])

  const persistUnlock = (newIds: string[]) => {
    setUnlockedLessonIds(newIds)
    localStorage.setItem(storageKey, JSON.stringify(newIds))
  }

  const handleRateLesson = (lessonId: string, starsCount: number) => {
    if (hasVoted[lessonId]) return

    const newRatings = { ...lessonRatings, [lessonId]: starsCount }
    const newVoted = { ...hasVoted, [lessonId]: true }
    setLessonRatings(newRatings)
    setHasVoted(newVoted)

    localStorage.setItem(ratingStorageKey, JSON.stringify(newRatings))
    localStorage.setItem(votedStorageKey, JSON.stringify(newVoted))

    const currentComm = communityRatings[lessonId] || { total: 0, count: 0 }
    const updatedComm = {
      ...communityRatings,
      [lessonId]: { total: currentComm.total + starsCount, count: currentComm.count + 1 }
    }
    setCommunityRatings(updatedComm)
    localStorage.setItem(communityStorageKey, JSON.stringify(updatedComm))
  }

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        let lessonData: Lesson[] = []
        let profilesData: Profile[] = []
        let msgData: Message[] = []
        let matData: ClassMaterial[] = []
        let dbQuizzes: Quiz[] = []
        let dbAttempts: QuizAttempt[] = []

        try {
          const { data: subjectsData } = await supabase.from('subjects').select('id').ilike('title', '%math%')
          const mathSubjectIds = subjectsData ? subjectsData.map((s: any) => s.id) : []
          if (mathSubjectIds.length > 0) {
            const { data: lData } = await supabase.from('lessons').select('*').in('subject_id', mathSubjectIds).order('created_at', { ascending: true })
            if (lData) lessonData = lData as Lesson[]
          }
        } catch (e) { console.error('Error fetching lessons', e) }

        try {
          const { data: pData } = await supabase.from('profiles').select('*').neq('id', profile?.id || '').neq('role', 'admin')
          if (pData) profilesData = pData as Profile[]
        } catch (e) { console.error('Error fetching profiles', e) }

        try {
          if (profile) {
            const { data: mData } = await supabase.from('direct_messages').select('*').or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`).order('created_at', { ascending: true })
            if (mData) msgData = mData as Message[]
          }
        } catch (e) { console.error('Error fetching messages', e) }

        try {
          const { data: matDataRes } = await supabase.from('class_materials').select('*').order('created_at', { ascending: false })
          if (matDataRes) matData = matDataRes as ClassMaterial[]
        } catch (e) { console.error('Error fetching materials', e) }

        try {
          const { data: qData } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false })
          if (qData) dbQuizzes = qData as Quiz[]
        } catch (e) { console.error('Error fetching quizzes', e) }

        try {
          if (profile) {
            const { data: aData } = await supabase.from('quiz_attempts').select('*').eq('student_id', profile.id)
            if (aData) dbAttempts = aData as QuizAttempt[]
          }
        } catch (e) { console.error('Error fetching quiz attempts', e) }

        if (cancelled) return

        if (lessonData.length > 0) {
          setLessons(lessonData)
          const firstId = lessonData[0].id
          setUnlockedLessonIds(prev => {
            if (prev.includes(firstId)) return prev
            const merged = [...new Set([...prev, firstId])]
            localStorage.setItem(storageKey, JSON.stringify(merged))
            return merged
          })
        }
        if (profilesData.length > 0) {
          setAllUsers(profilesData)
          if (!selectedUserId) setSelectedUserId(profilesData[0].id)
        }
        if (msgData.length > 0) setMessages(msgData)
        if (matData.length > 0) setMaterials(matData)
        if (dbQuizzes.length > 0) setQuizzes(dbQuizzes)
        if (dbAttempts.length > 0) {
          setQuizAttempts(dbAttempts)
          localStorage.setItem('math_quiz_attempts_global_v3', JSON.stringify(dbAttempts))
        }
      } catch (err) {
        console.error('Data fetch error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()

    const channel = supabase
      .channel('public:direct_messages_student')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages' }, (payload: any) => {
        if (payload.eventType === 'INSERT' && profile) {
          const newMsg = payload.new as Message
          if (newMsg.sender_id === profile.id || newMsg.receiver_id === profile.id) {
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id
          setMessages(prev => prev.filter(m => m.id !== deletedId))
        } else if (payload.eventType === 'UPDATE' && profile) {
          const updatedMsg = payload.new as Message
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m))
        }
      })
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [supabase, profile, storageKey, selectedUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedUserId, activeTab])

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId)
    const nowIso = new Date().toISOString()
    const updated = { ...lastVisitedMap, [userId]: nowIso }
    setLastVisitedMap(updated)
    localStorage.setItem(visitStorageKey, JSON.stringify(updated))

    if (!profile) return
    const unreadIds = messages
      .filter(m => m.sender_id === userId && m.receiver_id === profile.id && !m.is_read)
      .map(m => m.id)

    if (unreadIds.length > 0) {
      await supabase.from('direct_messages').update({ is_read: true }).in('id', unreadIds)
      setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, is_read: true } : m))
    }
  }

  const handleDeleteMessage = async (msgId: string) => {
    await supabase.from('direct_messages').delete().eq('id', msgId)
    setMessages(prev => prev.filter(m => m.id !== msgId))
    setContextMenu(null)
  }

  const handleEditMessage = async (msgId: string) => {
    if (!editText.trim()) return
    await supabase.from('direct_messages').update({ message_text: editText.trim() }).eq('id', msgId)
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, message_text: editText.trim() } : m))
    setEditingMessageId(null)
    setEditText('')
  }

  const handleClearHistory = async (targetUserId: string) => {
    if (!confirm('Clear chat history?')) return
    const ids = messages.filter(m => (m.sender_id === profile?.id && m.receiver_id === targetUserId) || (m.sender_id === targetUserId && m.receiver_id === profile?.id)).map(m => m.id)
    if (ids.length === 0) return
    await supabase.from('direct_messages').delete().in('id', ids)
    setMessages(prev => prev.filter(m => !ids.includes(m.id)))
  }

  const handleUnlockSubmit = (lessonId: string, correctKeyword: string) => {
    const userInput = (keywordInputs[lessonId] || '').trim()
    if (userInput.toLowerCase() === (correctKeyword || '').trim().toLowerCase()) {
      const updated = [...new Set([...unlockedLessonIds, lessonId])]
      persistUnlock(updated)
      setErrorMessages(prev => ({ ...prev, [lessonId]: '' }))
      setKeywordInputs(prev => ({ ...prev, [lessonId]: '' }))
    } else {
      setErrorMessages(prev => ({ ...prev, [lessonId]: 'Incorrect access keyword. Please try again.' }))
    }
  }

  const handleSendMessage = async () => {
    const text = messageInput.trim()
    if (!text || !profile || !selectedUserId) return

    const { data } = await supabase.from('direct_messages').insert({
      sender_id: profile.id,
      receiver_id: selectedUserId,
      message_text: text,
      is_read: false
    }).select().single()

    if (data) setMessages(prev => [...prev, data as Message])
    setMessageInput('')
  }

  const handleQuizSubmit = async (quiz: Quiz) => {
    let correctCount = 0
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option_index) correctCount++
    })

    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = scorePercent >= quiz.passing_percent

    const existingAttempts = quizAttempts.filter(a => a.quiz_id === quiz.id)
    const currentTries = existingAttempts.length + 1

    const newAttemptPayload: any = {
      quiz_id: quiz.id,
      score_percent: scorePercent,
      passed,
      answers: Object.values(userAnswers),
      tries: currentTries,
      attempted_at: new Date().toISOString(),
    }
    if (profile) newAttemptPayload.student_id = profile.id

    let savedAttemptId = Math.random().toString(36).substring(2)
    try {
      const { data, error } = await supabase.from('quiz_attempts').insert(newAttemptPayload).select().single()
      if (!error && data) savedAttemptId = data.id
    } catch (err) {
      console.error('Supabase quiz attempt insert error:', err)
    }

    const newAttempt: QuizAttempt = { id: savedAttemptId, ...newAttemptPayload }
    const updatedAttempts = [...quizAttempts, newAttempt]
    setQuizAttempts(updatedAttempts)
    localStorage.setItem('math_quiz_attempts_global_v3', JSON.stringify(updatedAttempts))
    localStorage.setItem(quizAttemptStorageKey, JSON.stringify(updatedAttempts))
    setSubmittedAttempt({ score: scorePercent, passed, answers: userAnswers })
  }

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const playlistsMap: { [moduleName: string]: Lesson[] } = {}
  lessons.forEach(l => {
    const modName = l.playlist || 'General Mathematics'
    if (!playlistsMap[modName]) playlistsMap[modName] = []
    playlistsMap[modName].push(l)
  })

  const sortedUsers = [...allUsers].sort((a, b) => {
    const lastMsgA = messages.filter(m => m.sender_id === a.id || m.receiver_id === a.id).sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())[0]
    const lastMsgB = messages.filter(m => m.sender_id === b.id || m.receiver_id === b.id).sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())[0]
    const timeA = lastMsgA ? new Date(lastMsgA.created_at).getTime() : 0
    const timeB = lastMsgB ? new Date(lastMsgB.created_at).getTime() : 0
    return timeB - timeA
  })

  const progressPercent = lessons.length > 0 ? Math.round((unlockedLessonIds.length / lessons.length) * 100) : 0

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}><div className="spinner" /></div>

  const filteredUsers = sortedUsers.filter(u => (u.full_name || u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const selectedUser = allUsers.find(u => u.id === selectedUserId)
  const activeConversation = messages.filter(m => (m.sender_id === profile?.id && m.receiver_id === selectedUserId) || (m.sender_id === selectedUserId && m.receiver_id === profile?.id))
  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(materialSearchQuery.toLowerCase()))

  return (
    <div style={{ paddingBottom: '60px', fontFamily: 'var(--font-body), sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#0F172A' }} onClick={() => setContextMenu(null)}>
      
      {/* Repeating Top YouTube Style Math Pattern Banner */}
      <div 
        style={{
          width: '100%',
          height: '140px',
          backgroundImage: 'url(/pictures/mathematics-icons-blue-seamless-pattern-vector-3006374.avif)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          backgroundPosition: 'top left',
          borderBottom: '3px solid #003366',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}
      />

      {/* Header Bar */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard/student" style={{ fontSize: '0.85rem', color: '#003366', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Back to Student Dashboard
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#E3F2FD', border: '1px solid #90CAF9', color: '#003366', fontSize: '0.78rem', fontWeight: 800, marginBottom: '10px' }}>
              Math Workstation
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Mathematics Curriculum Portal
            </h1>
          </div>
        </div>

        {/* Workstation Navigation Bar */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', marginTop: '16px', flexWrap: 'wrap' }}>
          {(['playlists', 'messages', 'quizzes', 'stream'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedPlaylistModule(null); setActiveQuiz(null); setSubmittedAttempt(null); }}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#E3F2FD' : 'transparent',
                color: activeTab === tab ? '#003366' : '#64748B',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #003366' : '2px solid transparent',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: '-2px'
              }}
            >
              {tab === 'messages' ? `Communication (${allUsers.length})` : tab === 'quizzes' ? `Quizzes Workstation (${quizzes.length})` : tab === 'stream' ? `Class Stream & Materials (${materials.length})` : `Playlists (${Object.keys(playlistsMap).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PLAYLISTS & LESSONS */}
      {activeTab === 'playlists' && (
        <div>
          {lessons.length > 0 && (
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Curriculum Completion Progress</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#003366' }}>{unlockedLessonIds.length} of {lessons.length} Lessons Unlocked ({progressPercent}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F1F5F9', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} style={{ height: '100%', background: '#003366' }} />
              </div>
            </div>
          )}

          {!selectedPlaylistModule ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search math playlists & modules by topic or keyword..."
                  value={playlistSearchQuery}
                  onChange={e => setPlaylistSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {Object.keys(playlistsMap).length === 0 ? (
                <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
                  No published playlists available yet. Check back soon or contact your teacher.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {Object.entries(playlistsMap)
                    .filter(([modName, modLessons]) => 
                      modName.toLowerCase().includes(playlistSearchQuery.toLowerCase()) || 
                      modLessons.some(l => l.title.toLowerCase().includes(playlistSearchQuery.toLowerCase()) || l.keyword.toLowerCase().includes(playlistSearchQuery.toLowerCase()))
                    )
                    .map(([modName, modLessons]) => {
                      const unlockedCountInMod = modLessons.filter(l => unlockedLessonIds.includes(l.id)).length
                      return (
                        <div 
                          key={modName} 
                          onClick={() => setSelectedPlaylistModule(modName)}
                          style={{ background: '#FFF', border: '1px solid #E2E8F0', borderLeft: '6px solid #003366', padding: '24px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 51, 102, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#003366', textTransform: 'uppercase', marginBottom: '8px' }}>Curriculum Playlist</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{modName}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>Contains {modLessons.length} sequenced video lesson{modLessons.length === 1 ? '' : 's'}.</p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#003366' }}>Open Playlist →</span>
                            <span style={{ fontSize: '0.75rem', background: '#E3F2FD', color: '#003366', padding: '2px 8px', fontWeight: 700 }}>{unlockedCountInMod}/{modLessons.length} Unlocked</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#E3F2FD', padding: '16px 20px', border: '1px solid #90CAF9', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <button onClick={() => { setSelectedPlaylistModule(null); setPlaylistTopicQuery(''); setPlaylistInstructorQuery(''); }} style={{ background: 'transparent', border: 'none', color: '#003366', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ← Back to All Playlists
                  </button>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{selectedPlaylistModule}</h2>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '16px', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search topic..." value={playlistTopicQuery} onChange={e => setPlaylistTopicQuery(e.target.value)} style={{ padding: '10px 14px', background: '#FFF', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }} />
                <input type="text" placeholder="Search teacher..." value={playlistInstructorQuery} onChange={e => setPlaylistInstructorQuery(e.target.value)} style={{ padding: '10px 14px', background: '#FFF', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }} />
                
                {/* Sort Order Selector */}
                <select 
                  value={lessonSortOrder} 
                  onChange={e => setLessonSortOrder(e.target.value as 'newest' | 'oldest')}
                  style={{ padding: '10px 14px', background: '#FFF', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700, color: '#003366', cursor: 'pointer' }}
                >
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="newest">Sort: Newest First</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {playlistsMap[selectedPlaylistModule]
                  ?.filter(lesson => {
                    const matchesTopic = lesson.title.toLowerCase().includes(playlistTopicQuery.toLowerCase()) || lesson.keyword.toLowerCase().includes(playlistTopicQuery.toLowerCase())
                    const matchesInstructor = (lesson.teacher_name || 'Teacher').toLowerCase().includes(playlistInstructorQuery.toLowerCase())
                    return matchesTopic && matchesInstructor
                  })
                  .sort((a, b) => {
                    const timeA = new Date(a.created_at).getTime()
                    const timeB = new Date(b.created_at).getTime()
                    return lessonSortOrder === 'newest' ? timeB - timeA : timeA - timeB
                  })
                  .map((lesson, idx) => {
                    const isUnlocked = unlockedLessonIds.includes(lesson.id)
                    const userRating = lessonRatings[lesson.id] || 0
                    const voted = hasVoted[lesson.id] || false
                    const comm = communityRatings[lesson.id] || { total: 0, count: 0 }
                    const commAvg = comm.count > 0 ? (comm.total / comm.count).toFixed(1) : 'N/A'
                    const hoverVal = hoveredStar[lesson.id] ?? userRating

                    return (
                      <div key={lesson.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: '4px solid #003366', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
                        <div style={{ padding: '12px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#E3F2FD', color: '#003366', padding: '2px 8px' }}>SEQUENCE #{idx + 1}</span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{lesson.title}</h3>
                            {isUnlocked && (
                              <span title="Permanently Unlocked" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', width: '24px', height: '24px', fontSize: '0.75rem', fontWeight: 800, borderRadius: '50%' }}>✓</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Instructor: {lesson.teacher_name || 'Teacher'}</span>
                        </div>

                        {isUnlocked ? (
                          <div>
                            <div style={{ position: 'relative', width: '100%', background: '#000', aspectRatio: '16/9' }}>
                              <video src={lesson.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#003366', display: 'block' }}>Lesson Rating Bar</span>
                                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                  {voted ? `Your rating: ${userRating}/10 stars` : 'Cast your 10-star rating:'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {Array.from({ length: 10 }).map((_, sIdx) => {
                                    const starNum = sIdx + 1
                                    const active = starNum <= (voted ? userRating : hoverVal)
                                    return (
                                      <button
                                        key={sIdx}
                                        type="button"
                                        disabled={voted}
                                        onMouseEnter={() => !voted && setHoveredStar(prev => ({ ...prev, [lesson.id]: starNum }))}
                                        onMouseLeave={() => !voted && setHoveredStar(prev => ({ ...prev, [lesson.id]: null }))}
                                        onClick={() => handleRateLesson(lesson.id, starNum)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: voted ? 'default' : 'pointer',
                                          fontSize: '1.2rem',
                                          color: active ? '#003366' : '#CBD5E1',
                                          padding: '1px',
                                        }}
                                      >
                                        ★
                                      </button>
                                    )
                                  })}
                                </div>
                                <div style={{ background: '#E3F2FD', border: '1px solid #90CAF9', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 800, color: '#003366' }}>
                                  Avg: {commAvg} / 10 ({comm.count} votes)
                                </div>
                              </div>
                            </div>

                            {(lesson.student_notes) && (
                              <div style={{ padding: '16px 24px', background: '#FFF', borderTop: '1px solid #E2E8F0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {lesson.student_notes && (
                                  <div style={{ background: '#F8FAFC', borderLeft: '3px solid #003366', padding: '8px 12px', color: '#334155' }}>
                                    <strong style={{ color: '#003366' }}>Student Note:</strong> {lesson.student_notes}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ padding: '48px', textAlign: 'center', background: '#F8FAFC' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }}>Lesson Locked</h4>
                            <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '16px' }}>Enter the access keyword provided by your teacher to unlock this video lesson.</p>
                            <div style={{ maxWidth: '320px', margin: '0 auto', display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                placeholder="Enter access keyword..." 
                                value={keywordInputs[lesson.id] || ''} 
                                onChange={e => setKeywordInputs({ ...keywordInputs, [lesson.id]: e.target.value })} 
                                style={{ flex: 1, padding: '10px 14px', border: '1px solid #CBD5E1', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} 
                              />
                              <button onClick={() => handleUnlockSubmit(lesson.id, lesson.keyword)} style={{ padding: '10px 18px', background: '#003366', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Unlock</button>
                            </div>
                            {errorMessages[lesson.id] && <div style={{ color: '#DC2626', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>{errorMessages[lesson.id]}</div>}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMUNICATION INBOX */}
      {activeTab === 'messages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', background: '#FFF', border: '1px solid #E2E8F0', height: '620px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ borderRight: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', background: '#FFF', flexShrink: 0 }}>
              <input type="text" placeholder="Search user..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                  No other active users found.
                </div>
              ) : (
                filteredUsers.map(user => {
                  const lastVisit = lastVisitedMap[user.id] || '1970-01-01T00:00:00.000Z'
                  const newMessagesCount = messages.filter(m => m.sender_id === user.id && m.receiver_id === profile?.id && new Date(m.created_at) > new Date(lastVisit) && !m.is_read).length
                  const isSelected = selectedUserId === user.id

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                      style={{
                        padding: '14px 16px',
                        cursor: 'pointer',
                        background: isSelected ? '#E3F2FD' : 'transparent',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isSelected ? '#003366' : '#0F172A' }}>{user.full_name || 'User'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>{user.role}</div>
                      </div>
                      {newMessagesCount > 0 && (
                        <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px' }}>
                          {newMessagesCount} new
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FAFAFA' }}>
            {selectedUser ? (
              <>
                <div style={{ padding: '16px 24px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>{selectedUser.full_name}</h3>
                    <span style={{ fontSize: '0.72rem', color: '#003366', textTransform: 'uppercase', fontWeight: 700 }}>{selectedUser.role}</span>
                  </div>
                  <button onClick={() => handleClearHistory(selectedUser.id)} style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '6px 12px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Clear History</button>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeConversation.map(msg => {
                    const isMe = msg.sender_id === profile?.id
                    return (
                      <div 
                        key={msg.id} 
                        onContextMenu={e => { e.preventDefault(); setContextMenu({ id: msg.id, x: e.clientX, y: e.clientY }); }}
                        style={{ 
                          alignSelf: isMe ? 'flex-end' : 'flex-start', 
                          background: isMe ? '#003366' : '#FFF', 
                          color: isMe ? '#FFF' : '#0F172A', 
                          border: isMe ? 'none' : '1px solid #CBD5E1', 
                          padding: '12px 16px', 
                          maxWidth: '70%', 
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          cursor: 'context-menu'
                        }}
                      >
                        {editingMessageId === msg.id ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input type="text" value={editText} onChange={e => setEditText(e.target.value)} style={{ padding: '4px', fontSize: '0.85rem', border: '1px solid #CBD5E1' }} />
                            <button onClick={() => handleEditMessage(msg.id)} style={{ fontSize: '0.72rem', background: '#FFF', color: '#003366', border: 'none', padding: '4px 8px', fontWeight: 700 }}>Save</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{msg.message_text}</div>
                            <div style={{ fontSize: '0.68rem', color: isMe ? 'rgba(255,255,255,0.85)' : '#64748B', textAlign: 'right', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <span>{formatTime(msg.created_at)}</span>
                              {isMe && (
                                <span 
                                  style={{ 
                                    fontWeight: 800, 
                                    fontSize: '0.62rem', 
                                    letterSpacing: '0.5px',
                                    padding: '1px 5px', 
                                    background: msg.is_read ? '#E3F2FD' : 'rgba(255,255,255,0.2)', 
                                    color: msg.is_read ? '#003366' : '#FFF',
                                    border: msg.is_read ? '1px solid #90CAF9' : '1px solid rgba(255,255,255,0.3)'
                                  }}
                                >
                                  {msg.is_read ? 'READ' : 'SENT'}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '16px 24px', background: '#FFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <input 
                    type="text" 
                    placeholder="Type message..." 
                    value={messageInput} 
                    onChange={e => setMessageInput(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter') handleSendMessage() }} 
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#F8FAFC' }} 
                  />
                  <button onClick={handleSendMessage} style={{ padding: '12px 24px', background: '#003366', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Send</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>Select a user from the left inbox</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES WORKSTATION */}
      {activeTab === 'quizzes' && (
        <div>
          {!activeQuiz ? (
            <div>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
                Take teacher-assigned mathematical quizzes to evaluate, reinforce, and solidify your concept mastery.
              </p>

              {quizzes.length === 0 ? (
                <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
                  No published quizzes available at this moment.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  {quizzes.map(q => {
                    const attempts = quizAttempts.filter(a => a.quiz_id === q.id)
                    const attemptsUsed = attempts.length
                    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score_percent)) : null
                    const attemptsRemaining = q.allowed_attempts - attemptsUsed

                    return (
                      <div key={q.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: '4px solid #003366', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.72rem', background: '#E3F2FD', color: '#003366', fontWeight: 800, padding: '2px 8px' }}>{(q.questions || []).length} QUESTIONS</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#003366' }}>Passing: {q.passing_percent}%</span>
                          </div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{q.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>{q.description}</p>
                          
                          <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', marginBottom: '16px', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>Attempts Allowed:</span>
                              <strong>{q.allowed_attempts}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>Attempts Remaining:</span>
                              <strong style={{ color: attemptsRemaining > 0 ? '#003366' : '#DC2626' }}>{attemptsRemaining}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Best Score:</span>
                              <strong style={{ color: bestScore !== null && bestScore >= q.passing_percent ? '#16A34A' : '#0F172A' }}>
                                {bestScore !== null ? `${bestScore}%` : 'Not Attempted'}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={attemptsRemaining <= 0}
                          onClick={() => { setActiveQuiz(q); setUserAnswers({}); setSubmittedAttempt(null); }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: attemptsRemaining > 0 ? '#003366' : '#CBD5E1',
                            color: '#FFF',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: attemptsRemaining > 0 ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {attemptsRemaining > 0 ? 'Start Quiz Workstation →' : 'Attempt Limit Reached'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Student Quiz History & Teacher Feedback Section */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  My Quiz History & Teacher Overall Feedback
                </h3>
                {quizAttempts.length === 0 ? (
                  <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>You haven't submitted any quiz attempts yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {quizAttempts.map((att) => {
                      const matchedQuiz = quizzes.find(q => q.id === att.quiz_id)
                      return (
                        <div key={att.id} style={{ padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '4px solid #003366' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{matchedQuiz?.title || 'Quiz Assessment'}</span>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                              <span style={{ fontWeight: 700, color: att.passed ? '#16A34A' : '#DC2626' }}>Score: {att.score_percent}% ({att.passed ? 'Passed' : 'Failed'})</span>
                              <span style={{ color: '#64748B', fontWeight: 600 }}>Tries: #{att.tries || 1}</span>
                            </div>
                          </div>
                          <div style={{ background: '#FFF', border: '1px solid #CBD5E1', padding: '10px 14px', marginTop: '10px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#003366', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Teacher's Overall Feedback:
                            </div>
                            <div style={{ fontSize: '0.88rem', color: att.overall_feedback ? '#0F172A' : '#94A3B8', fontStyle: att.overall_feedback ? 'normal' : 'italic' }}>
                              {att.overall_feedback || 'No overall feedback provided by teacher yet.'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '32px' }}>
              <button onClick={() => { setActiveQuiz(null); setSubmittedAttempt(null); }} style={{ background: 'transparent', border: 'none', color: '#003366', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>
                ← Back to All Quizzes
              </button>

              <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{activeQuiz.title}</h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0 0' }}>{activeQuiz.description}</p>
              </div>

              {!submittedAttempt ? (
                <form onSubmit={(e) => { e.preventDefault(); handleQuizSubmit(activeQuiz); }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
                    {activeQuiz.questions.map((q, qIdx) => (
                      <div key={q.id || qIdx} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '20px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#003366', marginBottom: '12px' }}>
                          Question {qIdx + 1}: {q.question_text}
                        </div>

                        {q.media_url && (
                          <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
                            {q.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={q.media_url} controls style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }} />
                            ) : (
                              <img src={q.media_url} alt="Question Media" style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }} />
                            )}
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {q.options.map((opt, oIdx) => {
                            const isSelected = userAnswers[qIdx] === oIdx
                            const optionLetter = String.fromCharCode(65 + oIdx)
                            return (
                              <div
                                key={oIdx}
                                onClick={() => setUserAnswers({ ...userAnswers, [qIdx]: oIdx })}
                                style={{
                                  padding: '10px 14px',
                                  background: isSelected ? '#E3F2FD' : '#FFF',
                                  border: isSelected ? '2px solid #003366' : '1px solid #CBD5E1',
                                  cursor: 'pointer',
                                  fontSize: '0.88rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontWeight: isSelected ? 700 : 500
                                }}
                              >
                                <span style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? '#003366' : '#F1F5F9', color: isSelected ? '#FFF' : '#0F172A', fontSize: '0.75rem', fontWeight: 800 }}>
                                  {optionLetter}
                                </span>
                                {opt}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={Object.keys(userAnswers).length < activeQuiz.questions.length}
                    style={{
                      padding: '14px 32px',
                      background: Object.keys(userAnswers).length === activeQuiz.questions.length ? '#003366' : '#CBD5E1',
                      color: '#FFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: Object.keys(userAnswers).length === activeQuiz.questions.length ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Submit Quiz Answers
                  </button>
                </form>
              ) : (
                <div>
                  <div style={{ padding: '24px', background: submittedAttempt.passed ? '#ECFDF5' : '#FEF2F2', border: `2px solid ${submittedAttempt.passed ? '#A7F3D0' : '#FEE2E2'}`, marginBottom: '32px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: submittedAttempt.passed ? '#065F46' : '#991B1B', margin: '0 0 8px 0' }}>
                      {submittedAttempt.passed ? '✓ Quiz Passed!' : '✕ Passing Threshold Not Met'}
                    </h3>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Score: {submittedAttempt.score}% (Passing Mark: {activeQuiz.passing_percent}%)
                    </p>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                    Answer Review & Explanations
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activeQuiz.questions.map((q, qIdx) => {
                      const selectedOpt = submittedAttempt.answers[qIdx]
                      const isCorrect = selectedOpt === q.correct_option_index

                      return (
                        <div key={q.id || qIdx} style={{ border: `1px solid ${isCorrect ? '#A7F3D0' : '#FEE2E2'}`, borderLeft: `6px solid ${isCorrect ? '#16A34A' : '#DC2626'}`, padding: '20px', background: '#FFF' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '12px' }}>
                            {qIdx + 1}. {q.question_text}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                            {q.options.map((opt, oIdx) => {
                              const isUserPick = selectedOpt === oIdx
                              const isRightOption = oIdx === q.correct_option_index
                              return (
                                <div
                                  key={oIdx}
                                  style={{
                                    padding: '8px 12px',
                                    fontSize: '0.85rem',
                                    background: isRightOption ? '#ECFDF5' : isUserPick ? '#FEF2F2' : '#F8FAFC',
                                    border: isRightOption ? '1px solid #A7F3D0' : isUserPick ? '1px solid #FEE2E2' : '1px solid #E2E8F0',
                                    fontWeight: isRightOption || isUserPick ? 700 : 400,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  {isRightOption && <span style={{ color: '#16A34A', fontWeight: 800 }}>✓ Correct Answer</span>}
                                  {isUserPick && !isRightOption && <span style={{ color: '#DC2626', fontWeight: 800 }}>✕ Your Choice</span>}
                                </div>
                              )
                            })}
                          </div>

                          {q.explanation && (
                            <div style={{ background: '#E3F2FD', border: '1px solid #90CAF9', padding: '12px 16px', fontSize: '0.82rem', color: '#003366', lineHeight: 1.5 }}>
                              <strong>Teacher Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CLASS STREAM & MATERIALS */}
      {activeTab === 'stream' && (
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Class Materials & Presentations</h3>
            <input type="text" placeholder="Search materials..." value={materialSearchQuery} onChange={e => setMaterialSearchQuery(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', width: '220px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMaterials.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.88rem' }}>No materials found.</p>
            ) : (
              filteredMaterials.map(mat => (
                <div key={mat.id} style={{ padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '4px solid #003366', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '4px' }}>{mat.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>Uploaded by {mat.uploaded_by} on {new Date(mat.created_at).toLocaleDateString()}</div>
                    {mat.student_notes && (
                      <div style={{ fontSize: '0.78rem', background: '#E3F2FD', color: '#003366', padding: '4px 8px' }}>
                        <strong>Student Note:</strong> {mat.student_notes}
                      </div>
                    )}
                  </div>
                  <a href={mat.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', background: '#E3F2FD', color: '#003366', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Download</a>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#FFF', border: '1px solid #CBD5E1', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 1000, padding: '4px 0' }}>
          <button onClick={() => { setEditingMessageId(contextMenu.id); setEditText(messages.find(m => m.id === contextMenu.id)?.message_text || ''); setContextMenu(null); }} style={{ display: 'block', width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.85rem', cursor: 'pointer' }}>Edit Message</button>
          <button onClick={() => handleDeleteMessage(contextMenu.id)} style={{ display: 'block', width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#DC2626', cursor: 'pointer' }}>Delete Message</button>
        </div>
      )}
    </div>
  )
}