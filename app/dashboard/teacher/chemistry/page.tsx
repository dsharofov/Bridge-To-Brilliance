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
  student_notes?: string
  teacher_notes?: string
  playlist?: string
  subject_id: string
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
  feedback?: string
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
  teacher_notes?: string
  subject_id: string
}

export default function ChemistryTeacherPortal() {
  const profile = useProfile()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'messages' | 'quizzes' | 'stream'>('videos')

  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [materials, setMaterials] = useState<ClassMaterial[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [chemistrySubjectId, setChemistrySubjectId] = useState<string | null>(null)

  // Messaging State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [replyInput, setReplyInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastVisitedMap, setLastVisitedMap] = useState<{ [userId: string]: string }>({})
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Video Search State
  const [videoSearchQuery, setVideoSearchQuery] = useState('')

  // Playlist View & Search State
  const [selectedPlaylistModule, setSelectedPlaylistModule] = useState<string | null>(null)
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('')

  // Edit Lesson Keyword Modal State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [newKeywordInput, setNewKeywordInput] = useState('')

  // Quiz Creator Modal State
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null)
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDescription, setQuizDescription] = useState('')
  const [passingPercent, setPassingPercent] = useState(70)
  const [allowedAttempts, setAllowedAttempts] = useState(3)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { id: 'q1', question_text: '', options: ['', ''], correct_option_index: 0, explanation: '', media_url: '' }
  ])

  // Student Attempt Feedback State
  const [viewingQuizAttemptsForId, setViewingQuizAttemptsForId] = useState<string | null>(null)
  const [feedbackInputs, setFeedbackInputs] = useState<{ [attemptId: string]: string }>({})

  // Material Upload State
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialFile, setMaterialFile] = useState<File | null>(null)
  const [matStudentNotes, setMatStudentNotes] = useState('')
  const [matTeacherNotes, setMatTeacherNotes] = useState('')
  const [uploadingMaterial, setUploadingMaterial] = useState(false)
  const [materialSearchQuery, setMaterialSearchQuery] = useState('')

  // Video Upload State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [topic, setTopic] = useState('')
  const [keyword, setKeyword] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [vidStudentNotes, setVidStudentNotes] = useState('')
  const [vidTeacherNotes, setVidTeacherNotes] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState('General Chemistry')
  const [isCreatingNewPlaylist, setIsCreatingNewPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const quizListStorageKey = 'chemistry_quizzes_global_v3'
  const quizAttemptStorageKey = 'chemistry_quiz_attempts_global_v3'
  const communityStorageKey = 'chemistry_community_ratings_global_v3'
  const visitStorageKey = profile ? `chemistry_last_visited_chats_teacher_${profile.id}` : 'chemistry_last_visited_chats_teacher_default'

  const [communityRatings, setCommunityRatings] = useState<{ [lessonId: string]: { total: number; count: number } }>({})

  useEffect(() => {
    const savedQuizzes = localStorage.getItem(quizListStorageKey)
    if (savedQuizzes) { try { setQuizzes(JSON.parse(savedQuizzes)) } catch (e) { console.error(e) } }

    const savedAttempts = localStorage.getItem(quizAttemptStorageKey)
    if (savedAttempts) { try { setQuizAttempts(JSON.parse(savedAttempts)) } catch (e) { console.error(e) } }

    const savedCommunity = localStorage.getItem(communityStorageKey)
    if (savedCommunity) { try { setCommunityRatings(JSON.parse(savedCommunity)) } catch (e) { console.error(e) } }

    const savedVisits = localStorage.getItem(visitStorageKey)
    if (savedVisits) { try { setLastVisitedMap(JSON.parse(savedVisits)) } catch (e) { console.error(e) } }
  }, [quizListStorageKey, quizAttemptStorageKey, communityStorageKey, visitStorageKey])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        let lessonData: Lesson[] = []
        let profilesData: Profile[] = []
        let msgData: Message[] = []
        let matData: ClassMaterial[] = []
        let dbQuizzes: Quiz[] = []

        try {
          // STRICT CHEMISTRY ISOLATION
          let { data: sub } = await supabase.from('subjects').select('id').ilike('title', '%chemistry%').limit(1).single()
          if (!sub && profile) {
            const { data: newSub } = await supabase.from('subjects').insert({ title: 'Chemistry', description: 'Chemistry curriculum', icon: 'feather', teacher_id: profile.id }).select('id').single()
            sub = newSub
          }

          if (sub) {
            setChemistrySubjectId(sub.id)

            const { data: lData } = await supabase.from('lessons').select('*').eq('subject_id', sub.id).order('created_at', { ascending: false })
            if (lData) lessonData = lData as Lesson[]

            const { data: matDataRes } = await supabase.from('class_materials').select('*').eq('subject_id', sub.id).order('created_at', { ascending: false })
            if (matDataRes) matData = matDataRes as ClassMaterial[]
          }
        } catch (e) { console.error('Error fetching Chemistry subject and content', e) }

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
          const { data: qData } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false })
          if (qData) dbQuizzes = qData as Quiz[]
        } catch (e) { console.error('Error fetching quizzes', e) }

        if (cancelled) return

        if (profilesData.length > 0) {
          setAllUsers(profilesData)
          if (!selectedUserId) setSelectedUserId(profilesData[0].id)
        }
        if (lessonData.length > 0) setLessons(lessonData)
        if (msgData.length > 0) setMessages(msgData)
        if (matData.length > 0) setMaterials(matData)
        if (dbQuizzes.length > 0) setQuizzes(dbQuizzes)
      } catch (err) { console.error('Data fetch error:', err) } finally { if (!cancelled) setLoading(false) }
    }
    fetchData()

    const channel = supabase
      .channel('public:direct_messages_chemistry_teacher')
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
  }, [profile, supabase, selectedUserId])

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

  const handleUpdateKeyword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLesson || !newKeywordInput.trim()) return

    const { error } = await supabase.from('lessons').update({ keyword: newKeywordInput.trim() }).eq('id', editingLesson.id)
    if (error) { alert('Error: ' + error.message); return }

    setLessons(prev => prev.map(l => l.id === editingLesson.id ? { ...l, keyword: newKeywordInput.trim() } : l))
    setEditingLesson(null)
    setNewKeywordInput('')
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', lessonId)
    setLessons(prev => prev.filter(l => l.id !== lessonId))
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this class material?')) return
    const { error } = await supabase.from('class_materials').delete().eq('id', materialId)
    if (error) {
      alert('Error deleting material: ' + error.message)
      return
    }
    setMaterials(prev => prev.filter(m => m.id !== materialId))
  }

  const handleOpenCreateQuiz = () => {
    setEditingQuizId(null)
    setQuizTitle('')
    setQuizDescription('')
    setPassingPercent(70)
    setAllowedAttempts(3)
    setQuizQuestions([{ id: 'q1', question_text: '', options: ['', ''], correct_option_index: 0, explanation: '', media_url: '' }])
    setShowQuizModal(true)
  }

  const handleOpenEditQuiz = (q: Quiz) => {
    setEditingQuizId(q.id)
    setQuizTitle(q.title)
    setQuizDescription(q.description)
    setPassingPercent(q.passing_percent)
    setAllowedAttempts(q.allowed_attempts)
    setQuizQuestions(q.questions || [])
    setShowQuizModal(true)
  }

  const handleDeleteQuiz = (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return
    const updated = quizzes.filter(q => q.id !== quizId)
    setQuizzes(updated)
    localStorage.setItem(quizListStorageKey, JSON.stringify(updated))
  }

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizTitle.trim() || quizQuestions.length === 0) return

    let updatedQuizzes: Quiz[] = []
    if (editingQuizId) {
      updatedQuizzes = quizzes.map(q => q.id === editingQuizId ? {
        ...q,
        title: quizTitle,
        description: quizDescription,
        passing_percent: passingPercent,
        allowed_attempts: allowedAttempts,
        questions: quizQuestions,
      } : q)
    } else {
      const newQuiz: Quiz = {
        id: Math.random().toString(36).substring(2),
        title: quizTitle,
        description: quizDescription,
        passing_percent: passingPercent,
        allowed_attempts: allowedAttempts,
        questions: quizQuestions,
        created_at: new Date().toISOString()
      }
      updatedQuizzes = [newQuiz, ...quizzes]
    }

    setQuizzes(updatedQuizzes)
    localStorage.setItem(quizListStorageKey, JSON.stringify(updatedQuizzes))
    setShowQuizModal(false)
  }

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialFile || !profile || !chemistrySubjectId) return
    setUploadingMaterial(true)

    try {
      const fileExt = materialFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `materials/${fileName}`

      const { error: uploadError } = await supabase.storage.from('lessons').upload(filePath, materialFile)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('lessons').getPublicUrl(filePath)
      let insertPayload: any = {
        subject_id: chemistrySubjectId,
        title: materialTitle,
        file_url: urlData.publicUrl,
        uploaded_by: profile.full_name || 'Instructor',
        student_notes: matStudentNotes,
        teacher_notes: matTeacherNotes
      }

      let { data: newMat, error: insertError } = await supabase.from('class_materials').insert(insertPayload).select().single()
      if (insertError) throw insertError
      if (newMat) setMaterials(prev => [newMat, ...prev])

      setShowMaterialModal(false)
      setMaterialTitle('')
      setMaterialFile(null)
      setMatStudentNotes('')
      setMatTeacherNotes('')
    } catch (err: any) {
      alert('Error uploading material: ' + err.message)
    } finally {
      setUploadingMaterial(false)
    }
  }

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile || !profile || !chemistrySubjectId) return
    setUploading(true)
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const ext = videoFile.name.split('.').pop()
      const path = `chemistry-lessons/${Math.random().toString(36).substring(2)}.${ext}`
      const { error: storageErr } = await supabase.storage.from('lessons').upload(path, videoFile)
      if (storageErr) throw storageErr

      setUploadProgress(95)

      const { data: url } = supabase.storage.from('lessons').getPublicUrl(path)
      const finalPlaylist = isCreatingNewPlaylist && newPlaylistName.trim() ? newPlaylistName.trim() : selectedPlaylist

      let insertPayload: any = { 
        subject_id: chemistrySubjectId, 
        title: topic, 
        video_url: url.publicUrl, 
        keyword, 
        teacher_name: teacherName || profile.full_name || 'Instructor',
        student_notes: vidStudentNotes,
        teacher_notes: vidTeacherNotes,
        playlist: finalPlaylist
      }

      let { data: newLesson, error: insertErr } = await supabase.from('lessons').insert(insertPayload).select().single()
      if (insertErr) throw insertErr

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (newLesson) setLessons(p => [newLesson, ...p])

      setTimeout(() => {
        setShowUploadModal(false)
        setTopic(''); setKeyword(''); setTeacherName(''); setVideoFile(null); setVidStudentNotes(''); setVidTeacherNotes(''); setNewPlaylistName(''); setIsCreatingNewPlaylist(false)
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err: any) { 
      clearInterval(progressInterval)
      alert('Upload error: ' + err.message) 
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { id: Math.random().toString(36).substring(2), question_text: '', options: ['', ''], correct_option_index: 0, explanation: '', media_url: '' }
    ])
  }

  const handleAddOption = (qIdx: number) => {
    const updated = [...quizQuestions]
    updated[qIdx].options.push('')
    setQuizQuestions(updated)
  }

  const uniquePlaylists = Array.from(new Set(lessons.map(l => l.playlist || 'General Chemistry'))).filter(Boolean)
  if (!uniquePlaylists.includes('General Chemistry')) uniquePlaylists.unshift('General Chemistry')

  const playlistsMap: { [moduleName: string]: Lesson[] } = {}
  lessons.forEach(l => {
    const modName = l.playlist || 'General Chemistry'
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

  const filteredLessons = lessons.filter(l => l.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) || l.keyword.toLowerCase().includes(videoSearchQuery.toLowerCase()))
  const filteredUsers = sortedUsers.filter(u => (u.full_name || u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const selectedUser = allUsers.find(u => u.id === selectedUserId)
  const activeConversation = messages.filter(m => (m.sender_id === profile?.id && m.receiver_id === selectedUserId) || (m.sender_id === selectedUserId && m.receiver_id === profile?.id))
  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(materialSearchQuery.toLowerCase()))

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}><div className="spinner" /></div>

  return (
    <div style={{ paddingBottom: '60px', fontFamily: 'var(--font-body), sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#0F172A' }} onClick={() => setContextMenu(null)}>
      
      {/* Chemistry Amber/Gold Banner */}
      <div 
        style={{
          width: '100%',
          height: '140px',
          background: 'linear-gradient(135deg, #B45309 0%, #FFB300 100%)',
          borderBottom: '3px solid #FFB300',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFBEB',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '2px'
        }}
      >
        &lt;CHEMISTRY_TEACHER_HUB /&gt; CURRICULUM MANAGEMENT &amp; MENTORSHIP
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard/teacher" style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Teacher Dashboard
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', fontSize: '0.78rem', fontWeight: 800, marginBottom: '8px' }}>
              Instructor Workstation
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
              Chemistry Curriculum Portal
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowMaterialModal(true)} style={{ padding: '12px 18px', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
              + Upload Material
            </button>
            <button onClick={handleOpenCreateQuiz} style={{ padding: '12px 18px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
              + Create Quiz
            </button>
            <button onClick={() => setShowUploadModal(true)} style={{ padding: '12px 20px', background: '#D97706', color: '#FFF', border: 'none', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
              + Upload Lesson
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', marginTop: '20px', flexWrap: 'wrap' }}>
          {(['videos', 'playlists', 'messages', 'quizzes', 'stream'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedPlaylistModule(null); }}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#FEF3C7' : 'transparent',
                color: activeTab === tab ? '#B45309' : '#64748B',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #FFB300' : '2px solid transparent',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'messages' ? `Communication (${allUsers.length})` : tab === 'quizzes' ? `Quiz Hub (${quizzes.length})` : tab === 'stream' ? `Class Stream & Materials (${materials.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: VIDEOS */}
      {activeTab === 'videos' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search Chemistry videos by topic or keyword..."
              value={videoSearchQuery}
              onChange={e => setVideoSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {filteredLessons.length === 0 ? (
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
              No chemistry video lessons uploaded yet. Use the "+ Upload Lesson" button above to upload a video.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {filteredLessons.map(lesson => {
                const comm = communityRatings[lesson.id] || { total: 0, count: 0 }
                const commAvg = comm.count > 0 ? (comm.total / comm.count).toFixed(1) : 'N/A'

                return (
                  <div key={lesson.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: '4px solid #FFB300', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ position: 'relative', width: '100%', background: '#000', aspectRatio: '16/9' }}>
                        <video src={lesson.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{lesson.title}</h3>
                          <span style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                            ★ {commAvg} / 10 ({comm.count} votes)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '8px' }}>Keyword: <code style={{ color: '#B45309', fontWeight: 700, background: '#F1F5F9', padding: '2px 6px' }}>{lesson.keyword}</code></div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>Playlist: {lesson.playlist || 'General Chemistry'}</div>

                        {(lesson.student_notes || lesson.teacher_notes) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '10px', borderTop: '1px dashed #E2E8F0' }}>
                            {lesson.student_notes && <div style={{ fontSize: '0.78rem', background: '#F8FAFC', padding: '6px 8px', color: '#334155' }}><strong>Student Note:</strong> {lesson.student_notes}</div>}
                            {lesson.teacher_notes && <div style={{ fontSize: '0.78rem', background: '#FEF3C7', padding: '6px 8px', color: '#78350F' }}><strong>Instructor Note:</strong> {lesson.teacher_notes}</div>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '0 20px 20px 20px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <button 
                        onClick={() => { setEditingLesson(lesson); setNewKeywordInput(lesson.keyword); }} 
                        style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Edit Keyword
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(lesson.id)} 
                        style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Delete Lesson
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLAYLISTS & MODULES */}
      {activeTab === 'playlists' && (
        <div>
          {!selectedPlaylistModule ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search Chemistry playlists & modules by name or topic..."
                  value={playlistSearchQuery}
                  onChange={e => setPlaylistSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {Object.keys(playlistsMap).length === 0 ? (
                <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
                  No playlist modules available. Upload video lessons with playlist names to build modules.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {Object.entries(playlistsMap)
                    .filter(([modName, modLessons]) => 
                      modName.toLowerCase().includes(playlistSearchQuery.toLowerCase()) || 
                      modLessons.some(l => l.title.toLowerCase().includes(playlistSearchQuery.toLowerCase()))
                    )
                    .map(([modName, modLessons]) => (
                      <div 
                        key={modName} 
                        onClick={() => setSelectedPlaylistModule(modName)}
                        style={{ background: '#FFF', border: '1px solid #E2E8F0', borderLeft: '6px solid #FFB300', padding: '24px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,179,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginBottom: '8px' }}>Curriculum Module</div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{modName}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>Contains {modLessons.length} sequenced video lesson{modLessons.length === 1 ? '' : 's'}.</p>
                        </div>
                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309' }}>Open Module Playlist →</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#FEF3C7', padding: '16px 20px', border: '1px solid #FDE68A' }}>
                <div>
                  <button onClick={() => setSelectedPlaylistModule(null)} style={{ background: 'transparent', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ← Back to All Playlists
                  </button>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{selectedPlaylistModule}</h2>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {playlistsMap[selectedPlaylistModule]?.map((lesson, idx) => (
                  <div key={lesson.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: '4px solid #FFB300', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>
                      SEQUENCE #{idx + 1} | KEYWORD: {lesson.keyword}
                    </div>
                    <div style={{ position: 'relative', width: '100%', background: '#000', aspectRatio: '16/9' }}>
                      <video src={lesson.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>{lesson.title}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#475569' }}>Instructor: <strong>{lesson.teacher_name || 'Instructor'}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMUNICATION */}
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
                filteredUsers.map(u => {
                  const lastVisit = lastVisitedMap[u.id] || '1970-01-01T00:00:00.000Z'
                  const newCount = messages.filter(m => m.sender_id === u.id && m.receiver_id === profile?.id && new Date(m.created_at) > new Date(lastVisit) && !m.is_read).length
                  const isSelected = selectedUserId === u.id

                  return (
                    <div key={u.id} onClick={() => handleSelectUser(u.id)} style={{ padding: '14px 16px', cursor: 'pointer', background: isSelected ? '#FEF3C7' : 'transparent', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#B45309' : '#0F172A' }}>{u.full_name || 'User'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>{u.role}</div>
                      </div>
                      {newCount > 0 && <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px' }}>{newCount} new</span>}
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
                    <span style={{ fontSize: '0.72rem', color: '#B45309', textTransform: 'uppercase', fontWeight: 700 }}>{selectedUser.role}</span>
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
                          background: isMe ? '#FFB300' : '#FFF', 
                          color: isMe ? '#78350F' : '#0F172A', 
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
                            <button onClick={() => handleEditMessage(msg.id)} style={{ fontSize: '0.72rem', background: '#FFF', color: '#B45309', border: 'none', padding: '4px 8px', fontWeight: 700 }}>Save</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{msg.message_text}</div>
                            <div style={{ fontSize: '0.68rem', color: isMe ? 'rgba(120,53,15,0.85)' : '#64748B', textAlign: 'right', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <span>{formatTime(msg.created_at)}</span>
                              {isMe && (
                                <span 
                                  style={{ 
                                    fontWeight: 800, 
                                    fontSize: '0.62rem', 
                                    letterSpacing: '0.5px',
                                    padding: '1px 5px', 
                                    background: msg.is_read ? '#FEF3C7' : 'rgba(120,53,15,0.15)', 
                                    color: msg.is_read ? '#B45309' : '#78350F',
                                    border: msg.is_read ? '1px solid #FDE68A' : '1px solid rgba(120,53,15,0.2)'
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
                    value={replyInput} 
                    onChange={e => setReplyInput(e.target.value)} 
                    onKeyDown={async (e) => { 
                      if (e.key === 'Enter') {
                        if (!replyInput.trim() || !profile || !selectedUserId) return;
                        const { data } = await supabase.from('direct_messages').insert({ 
                          sender_id: profile.id, 
                          receiver_id: selectedUserId, 
                          message_text: replyInput.trim(), 
                          is_read: false 
                        }).select().single();
                        if (data) setMessages(p => [...p, data as Message]);
                        setReplyInput('');
                      }
                    }} 
                    placeholder="Type message..." 
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#F8FAFC' }} 
                  />
                  <button onClick={async () => {
                    if (!replyInput.trim() || !profile || !selectedUserId) return
                    const { data } = await supabase.from('direct_messages').insert({ sender_id: profile.id, receiver_id: selectedUserId, message_text: replyInput.trim(), is_read: false }).select().single()
                    if (data) setMessages(p => [...p, data as Message])
                    setReplyInput('')
                  }} style={{ padding: '12px 24px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Send</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>Select user from left inbox</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: QUIZZES MANAGEMENT */}
      {activeTab === 'quizzes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Published Quizzes &amp; Student Attempts</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Create, edit, manage Chemistry quizzes and give feedback on student submissions.</p>
            </div>
            <button onClick={handleOpenCreateQuiz} style={{ padding: '10px 18px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
              + Create New Quiz
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {quizzes.map(q => {
              const attemptsForThisQuiz = quizAttempts.filter(a => a.quiz_id === q.id)

              return (
                <div key={q.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderTop: '4px solid #FFB300', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#B45309', marginBottom: '8px' }}>
                      <span>{(q.questions || []).length} QUESTIONS</span>
                      <span>Pass: {q.passing_percent}%</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0' }}>{q.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>{q.description}</p>

                    <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#B45309', marginBottom: '6px' }}>
                        Student Submissions ({attemptsForThisQuiz.length})
                      </div>
                      {attemptsForThisQuiz.length === 0 ? (
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>No student attempts recorded yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                          {attemptsForThisQuiz.map(att => (
                            <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', background: '#FFF', padding: '6px 8px', border: '1px solid #CBD5E1' }}>
                              <span>Score: <strong>{att.score_percent}%</strong> ({att.passed ? 'Passed' : 'Failed'})</span>
                              <button
                                onClick={() => setViewingQuizAttemptsForId(att.id)}
                                style={{ background: '#FEF3C7', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', padding: '2px 6px' }}
                              >
                                Give Feedback
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <button onClick={() => handleOpenEditQuiz(q)} style={{ flex: 1, padding: '8px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Edit Quiz</button>
                    <button onClick={() => handleDeleteQuiz(q.id)} style={{ flex: 1, padding: '8px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Delete Quiz</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 5: CLASS STREAM & MATERIALS */}
      {activeTab === 'stream' && (
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Class Materials &amp; Presentations</h3>
            <input type="text" placeholder="Search materials..." value={materialSearchQuery} onChange={e => setMaterialSearchQuery(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', width: '220px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMaterials.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.88rem' }}>No materials uploaded yet for Chemistry.</p>
            ) : (
              filteredMaterials.map(mat => (
                <div key={mat.id} style={{ padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '4px solid #FFB300', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '4px' }}>{mat.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>Uploaded by {mat.uploaded_by} on {new Date(mat.created_at).toLocaleDateString()}</div>
                    {(mat.student_notes || mat.teacher_notes) && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {mat.student_notes && <span style={{ fontSize: '0.78rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px' }}>Student Note: {mat.student_notes}</span>}
                        {mat.teacher_notes && <span style={{ fontSize: '0.78rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px' }}>Instructor Note: {mat.teacher_notes}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a href={mat.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', background: '#FEF3C7', color: '#B45309', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Download</a>
                    <button onClick={() => handleDeleteMaterial(mat.id)} style={{ padding: '6px 14px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#DC2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDIT KEYWORD MODAL */}
      <AnimatePresence>
        {editingLesson && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '32px', width: '100%', maxWidth: '420px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Edit Lesson Keyword</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>Updating keyword for: <strong>{editingLesson.title}</strong></p>
              <form onSubmit={handleUpdateKeyword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>New Keyword</label>
                  <input type="text" value={newKeywordInput} onChange={e => setNewKeywordInput(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setEditingLesson(null)} style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '10px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Save Keyword</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT QUIZ MODAL */}
      <AnimatePresence>
        {showQuizModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                {editingQuizId ? 'Edit Quiz' : 'Create New Multi-Option Quiz'}
              </h3>
              <form onSubmit={handleSaveQuiz}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Quiz Title</label>
                  <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required placeholder="e.g. Stoichiometry &amp; Bonding Assessment" style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                  <input type="text" value={quizDescription} onChange={e => setQuizDescription(e.target.value)} placeholder="Short instructions..." style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Passing Percentage (%)</label>
                    <input type="number" min="10" max="100" value={passingPercent} onChange={e => setPassingPercent(Number(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Allowed Retries</label>
                    <input type="number" min="1" max="10" value={allowedAttempts} onChange={e => setAllowedAttempts(Number(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Questions &amp; Options</h4>
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id || qIdx} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#B45309', marginBottom: '8px' }}>Question #{qIdx + 1}</div>
                    <input type="text" value={q.question_text} onChange={e => { const updated = [...quizQuestions]; updated[qIdx].question_text = e.target.value; setQuizQuestions(updated); }} required placeholder="Enter question..." style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', marginBottom: '12px', boxSizing: 'border-box' }} />

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Optional Question Media (Image/Video URL):</label>
                      <input type="url" value={q.media_url || ''} onChange={e => { const updated = [...quizQuestions]; updated[qIdx].media_url = e.target.value; setQuizQuestions(updated); }} placeholder="https://example.com/image.png" style={{ width: '100%', padding: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                    </div>

                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Options:</label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <input type="radio" name={`correct_${qIdx}`} checked={q.correct_option_index === oIdx} onChange={() => { const updated = [...quizQuestions]; updated[qIdx].correct_option_index = oIdx; setQuizQuestions(updated); }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{String.fromCharCode(65 + oIdx)}:</span>
                        <input type="text" value={opt} onChange={e => { const updated = [...quizQuestions]; updated[qIdx].options[oIdx] = e.target.value; setQuizQuestions(updated); }} required placeholder={`Option ${oIdx + 1}`} style={{ flex: 1, padding: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddOption(qIdx)} style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', border: 'none', padding: '4px 8px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}>
                      + Add Option
                    </button>

                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Explanation Note:</label>
                      <input type="text" value={q.explanation} onChange={e => { const updated = [...quizQuestions]; updated[qIdx].explanation = e.target.value; setQuizQuestions(updated); }} placeholder="Detailed explanation..." style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={handleAddQuestion} style={{ width: '100%', padding: '10px', background: '#F1F5F9', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer', marginBottom: '20px' }}>
                  + Add Question
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowQuizModal(false)} style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save &amp; Publish Quiz</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GIVE FEEDBACK MODAL */}
      <AnimatePresence>
        {viewingQuizAttemptsForId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Provide Student Feedback</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>Send custom evaluation remarks for this submission.</p>
              
              <textarea
                rows={4}
                value={feedbackInputs[viewingQuizAttemptsForId] || ''}
                onChange={e => setFeedbackInputs({ ...feedbackInputs, [viewingQuizAttemptsForId]: e.target.value })}
                placeholder="Write feedback comments..."
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box', marginBottom: '20px', fontSize: '0.9rem', outline: 'none' }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setViewingQuizAttemptsForId(null)} style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={() => {
                  const updated = quizAttempts.map(a => a.id === viewingQuizAttemptsForId ? { ...a, feedback: feedbackInputs[viewingQuizAttemptsForId] } : a)
                  setQuizAttempts(updated)
                  localStorage.setItem(quizAttemptStorageKey, JSON.stringify(updated))
                  setViewingQuizAttemptsForId(null)
                  alert('Feedback saved successfully!')
                }} style={{ flex: 1, padding: '10px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Feedback</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD MATERIAL MODAL */}
      <AnimatePresence>
        {showMaterialModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '32px', width: '100%', maxWidth: '460px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Upload Class Material</h3>
              <form onSubmit={handleUploadMaterial}>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Title</label><input type="text" value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} required placeholder="e.g. Periodic Table Reference Guide" style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>File / Presentation</label><input type="file" onChange={e => setMaterialFile(e.target.files?.[0] || null)} required style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Note (For Students)</label><input type="text" value={matStudentNotes} onChange={e => setMatStudentNotes(e.target.value)} placeholder="Note for students..." style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Note (For Instructors / Staff)</label><input type="text" value={matTeacherNotes} onChange={e => setMatTeacherNotes(e.target.value)} placeholder="Confidential note..." style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowMaterialModal(false)} style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={uploadingMaterial} style={{ flex: 1, padding: '10px', background: '#FFB300', color: '#78350F', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{uploadingMaterial ? 'Uploading...' : 'Publish'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD VIDEO MODAL WITH PROGRESS BAR */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: '#FFF', padding: '32px', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Upload Video Lesson</h3>
              <form onSubmit={handleUploadVideo}>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Topic</label><input type="text" value={topic} onChange={e => setTopic(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Playlist / Module</label>
                  {!isCreatingNewPlaylist ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select value={selectedPlaylist} onChange={e => setSelectedPlaylist(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}>
                        {uniquePlaylists.map(pl => <option key={pl} value={pl}>{pl}</option>)}
                      </select>
                      <button type="button" onClick={() => setIsCreatingNewPlaylist(true)} style={{ padding: '10px 14px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>+ New</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} placeholder="New playlist name..." required style={{ flex: 1, padding: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                      <button type="button" onClick={() => { setIsCreatingNewPlaylist(false); setNewPlaylistName(''); }} style={{ padding: '10px 12px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Access Keyword</label><input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', fontFamily: 'monospace', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Instructor Name</label><input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder={profile?.full_name || 'Instructor'} style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Note (For Students)</label><input type="text" value={vidStudentNotes} onChange={e => setVidStudentNotes(e.target.value)} placeholder="Note for students..." style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '14px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Note (For Instructors / Staff)</label><input type="text" value={vidTeacherNotes} onChange={e => setVidTeacherNotes(e.target.value)} placeholder="Confidential note..." style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Video File</label><input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} required style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} /></div>

                {uploading && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                      <span>Uploading Video...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#FFB300', transition: 'width 0.2s ease' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" disabled={uploading} onClick={() => setShowUploadModal(false)} style={{ flex: '1', padding: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={uploading} style={{ flex: '1', padding: '10px', background: uploading ? '#94A3B8' : '#FFB300', color: uploading ? '#FFF' : '#78350F', border: 'none', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer' }}>{uploading ? `Uploading (${uploadProgress}%)` : 'Publish'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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