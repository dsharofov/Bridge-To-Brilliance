// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { motion } from 'framer-motion'
// import { createClient } from '@/lib/supabase/client'
// import { useProfile } from '../layout'
// import type { Subject, Lesson, Grade, Profile } from '@/types/database.types'

// interface EnrollmentWithStudent {
//   student_id: string
//   student?: Pick<Profile, 'full_name'> | null
// }

// type GradeWithStudent = Grade & {
//   student?: Pick<Profile, 'full_name'> | null
// }

// function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 200,
//       background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
//     }} onClick={onClose}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         onClick={(e) => e.stopPropagation()}
//           style={{ willChange: 'transform, opacity',
//           background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
//           borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'auto',
//         }}
//       >
//         <div style={{ willChange: 'transform, opacity',  display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
//           <h3 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', color: '#1A1A2E', fontSize: '1.2rem' }}>{title}</h3>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
//         </div>
//         {children}
//       </motion.div>
//     </div>
//   )
// }

// export default function TeacherDashboard() {
//   const profile = useProfile()
//   const supabase = createClient()
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [loading, setLoading] = useState(true)
//   const [activeModal, setActiveModal] = useState<string | null>(null)
//   const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
//   const [enrolledStudents, setEnrolledStudents] = useState<EnrollmentWithStudent[]>([])
//   const [lessons, setLessons] = useState<Lesson[]>([])
//   const [grades, setGrades] = useState<GradeWithStudent[]>([])

//   const [subjectForm, setSubjectForm] = useState({ title: '', description: '', color: '#4169E1', icon: '📚' })
//   const [lessonForm, setLessonForm] = useState({ title: '', description: '', youtube_url: '' })
//   const [classForm, setClassForm] = useState({ title: '', scheduled_at: '', meeting_link: '', description: '' })
//   const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '' })
//   const [gradeForm, setGradeForm] = useState({ student_id: '', assignment_title: '', score: '', max_score: '', feedback: '' })
//   const [uploading, setUploading] = useState(false)
//   const [formLoading, setFormLoading] = useState(false)

//   useEffect(() => {
//     if (!profile) return
//     let cancelled = false
//     const run = async () => {
//       const { data } = await supabase
//         .from('subjects')
//         .select('*')
//         .eq('teacher_id', profile.id)
//         .order('created_at', { ascending: false })
//       if (data && !cancelled) setSubjects(data)
//       if (!cancelled) setLoading(false)
//     }
//     run()
//     return () => { cancelled = true }
//   }, [profile])

//   const fetchSubjectDetails = useCallback(async (subject: Subject) => {
//     setSelectedSubject(subject)
//     const [enrollRes, lessonRes, gradeRes] = await Promise.all([
//       supabase
//         .from('enrollments')
//         .select('*, student:profiles!enrollments_student_id_fkey(full_name)')
//         .eq('subject_id', subject.id),
//       supabase
//         .from('lessons')
//         .select('*')
//         .eq('subject_id', subject.id)
//         .order('order_index'),
//       supabase
//         .from('grades')
//         .select('*, student:profiles!grades_student_id_fkey(full_name)')
//         .eq('subject_id', subject.id)
//         .order('created_at', { ascending: false }),
//     ])
//     if (enrollRes.data) setEnrolledStudents(enrollRes.data as EnrollmentWithStudent[])
//     if (lessonRes.data) setLessons(lessonRes.data)
//     if (gradeRes.data) setGrades(gradeRes.data as GradeWithStudent[])
//   }, [supabase])

//   const refetchSubjects = useCallback(async () => {
//     if (!profile) return
//     const { data } = await supabase
//       .from('subjects')
//       .select('*')
//       .eq('teacher_id', profile.id)
//       .order('created_at', { ascending: false })
//     if (data) setSubjects(data)
//   }, [profile, supabase])

//   const handleCreateSubject = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!profile) return
//     setFormLoading(true)
//     await supabase.from('subjects').insert({
//       ...subjectForm,
//       teacher_id: profile.id,
//     })
//     setSubjectForm({ title: '', description: '', color: '#4169E1', icon: '📚' })
//     setActiveModal(null)
//     await refetchSubjects()
//     setFormLoading(false)
//   }

//   const extractYouTubeID = (url: string): string | null => {
//     const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
//     const match = url.match(regExp)
//     return (match && match[7].length === 11) ? match[7] : null
//   }

//   const handleAddLesson = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedSubject || !lessonForm.youtube_url) return
//     setUploading(true)
//     try {
//       const ytId = extractYouTubeID(lessonForm.youtube_url)
//       if (!ytId) {
//         alert('Invalid YouTube URL. Please provide a valid link.')
//         setUploading(false)
//         return
//       }
//       const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
//       const embedUrl = `https://www.youtube.com/embed/${ytId}`

//       await supabase.from('lessons').insert({
//         subject_id: selectedSubject.id,
//         title: lessonForm.title,
//         description: lessonForm.description,
//         video_url: embedUrl,
//         thumbnail_url: thumbnailUrl,
//         order_index: lessons.length,
//       })
//       setLessonForm({ title: '', description: '', youtube_url: '' })
//       setActiveModal(null)
//       await fetchSubjectDetails(selectedSubject)
//     } catch {
//       alert('Failed to save lesson.')
//     }
//     setUploading(false)
//   }

//   const handleScheduleClass = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedSubject) return
//     setFormLoading(true)
//     await supabase.from('classes').insert({
//       subject_id: selectedSubject.id,
//       ...classForm,
//     })
//     setClassForm({ title: '', scheduled_at: '', meeting_link: '', description: '' })
//     setActiveModal(null)
//     setFormLoading(false)
//   }

//   const handlePostAnnouncement = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!profile || !selectedSubject) return
//     setFormLoading(true)
//     await supabase.from('announcements').insert({
//       subject_id: selectedSubject.id,
//       author_id: profile.id,
//       ...announcementForm,
//     })
//     setAnnouncementForm({ title: '', body: '' })
//     setActiveModal(null)
//     setFormLoading(false)
//   }

//   const handleAddGrade = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!profile || !selectedSubject) return
//     setFormLoading(true)
//     await supabase.from('grades').insert({
//       student_id: gradeForm.student_id,
//       subject_id: selectedSubject.id,
//       assignment_title: gradeForm.assignment_title,
//       score: parseFloat(gradeForm.score),
//       max_score: parseFloat(gradeForm.max_score),
//       feedback: gradeForm.feedback,
//       graded_by: profile.id,
//     })
//     setGradeForm({ student_id: '', assignment_title: '', score: '', max_score: '', feedback: '' })
//     setActiveModal(null)
//     await fetchSubjectDetails(selectedSubject)
//     setFormLoading(false)
//   }

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '10px 14px', borderRadius: '8px',
//     border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.03)',
//     color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box',
//   }

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
//         <div className="spinner" />
//       </div>
//     )
//   }

//   return (
//     <div>
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//           style={{ willChange: 'transform, opacity',
//           background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.2), rgba(255, 179, 0, 0.1))',
//           border: '1px solid rgba(65, 105, 225, 0.2)', borderRadius: '16px', padding: '32px', marginBottom: '32px',
//         }}>
//         <h1 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>
//           Teacher Dashboard
//         </h1>
//         <p style={{ willChange: 'transform, opacity',  color: 'rgba(0,0,0,0.5)', fontSize: '0.95rem' }}>
//           You&apos;re teaching {subjects.length} subject{subjects.length !== 1 ? 's' : ''}.
//         </p>
//       </motion.div>

//       <div id="subjects" style={{ marginBottom: '40px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: '#1A1A2E' }}>My Subjects</h2>
//           <button onClick={() => setActiveModal('create-subject')} className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
//             + Create Subject
//           </button>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//           {subjects.map((subject, i) => (
//             <div key={subject.id} style={{ animationDelay: `${i * 0.05}s`, cursor: 'pointer' }} className="fade-in-up"
//               onClick={() => fetchSubjectDetails(subject)}
//               role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && fetchSubjectDetails(subject)}>
//               <div className="glass-card-gold subject-card" style={{ padding: '24px' }}>
//                 <span style={{ fontSize: '2rem' }}>{subject.icon}</span>
//                 <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: '#1A1A2E', margin: '12px 0 8px' }}>
//                   {subject.title}
//                 </h3>
//                 <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '16px', lineHeight: 1.5 }}>
//                   {subject.description?.slice(0, 80)}{subject.description && subject.description.length > 80 ? '...' : ''}
//                 </p>
//                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                   <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(65,105,225,0.15)', color: '#4169E1' }}>Click to manage</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedSubject && (
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//           style={{ willChange: 'transform, opacity',  marginBottom: '40px' }}>
//           <div style={{ willChange: 'transform, opacity', 
//             background: `linear-gradient(135deg, ${selectedSubject.color}20, rgba(255,179,0,0.05))`,
//             border: `1px solid ${selectedSubject.color}30`,
//             borderRadius: '16px', padding: '24px', marginBottom: '24px',
//           }}>
//             <div style={{ willChange: 'transform, opacity',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
//               <div>
//                 <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#1A1A2E' }}>
//                   {selectedSubject.icon} {selectedSubject.title}
//                 </h2>
//                 <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>
//                   {enrolledStudents.length} students enrolled &middot; {lessons.length} lessons
//                 </p>
//               </div>
//               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                 <button onClick={() => setActiveModal('add-lesson')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Add Lesson</button>
//                 <button onClick={() => setActiveModal('schedule-class')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Schedule Class</button>
//                 <button onClick={() => setActiveModal('post-announcement')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Announcement</button>
//               </div>
//             </div>
//           </div>

//           <h3 style={{ color: '#1A1A2E', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Video Lessons</h3>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
//             {lessons.map((lesson, i) => (
//               <div key={lesson.id} style={{
//                 background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)',
//                 borderRadius: '12px', overflow: 'hidden',
//               }}>
//                 <div style={{ height: '120px', background: `linear-gradient(135deg, ${selectedSubject.color}30, rgba(255,179,0,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <span style={{ fontSize: '2rem' }}>🎥</span>
//                 </div>
//                 <div style={{ padding: '12px' }}>
//                   <h4 style={{ color: '#1A1A2E', fontSize: '0.85rem', marginBottom: '4px' }}>{lesson.title}</h4>
//                   <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.75rem' }}>Lesson {i + 1}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div id="gradebook">
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//               <h3 style={{ color: '#1A1A2E', fontSize: '1rem', fontWeight: 600 }}>Gradebook</h3>
//               <button onClick={() => setActiveModal('add-grade')} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>+ Add Grade</button>
//             </div>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
//                     {['Student', 'Assignment', 'Score', 'Feedback', 'Date'].map(h => (
//                       <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {grades.length === 0 ? (
//                     <tr><td colSpan={5} style={{ padding: '16px', color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem' }}>No grades yet.</td></tr>
//                   ) : (
//                     grades.map((g) => (
//                       <tr key={g.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
//                         <td style={{ padding: '10px 14px', color: '#1A1A2E', fontSize: '0.85rem' }}>{g.student?.full_name}</td>
//                         <td style={{ padding: '10px 14px', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem' }}>{g.assignment_title}</td>
//                         <td style={{ padding: '10px 14px' }}>
//                           <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
//                             background: (g.score / g.max_score) >= 0.7 ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)',
//                             color: (g.score / g.max_score) >= 0.7 ? '#28a745' : '#dc3545',
//                           }}>{g.score}/{g.max_score}</span>
//                         </td>
//                         <td style={{ padding: '10px 14px', color: 'rgba(0,0,0,0.5)', fontSize: '0.8rem' }}>{g.feedback || '—'}</td>
//                         <td style={{ padding: '10px 14px', color: 'rgba(0,0,0,0.3)', fontSize: '0.75rem' }}>{new Date(g.created_at).toLocaleDateString()}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {activeModal === 'create-subject' && (
//         <Modal title="Create Subject" onClose={() => setActiveModal(null)}>
//           <form onSubmit={handleCreateSubject}>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</label>
//               <input value={subjectForm.title} onChange={e => setSubjectForm({...subjectForm, title: e.target.value})} required style={inputStyle} placeholder="e.g. Mathematics" />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Description</label>
//               <textarea value={subjectForm.description} onChange={e => setSubjectForm({...subjectForm, description: e.target.value})} style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} placeholder="Subject description..." />
//             </div>
//             <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Icon</label>
//                 <input value={subjectForm.icon} onChange={e => setSubjectForm({...subjectForm, icon: e.target.value})} style={inputStyle} placeholder="📚" />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Color</label>
//                 <input type="color" value={subjectForm.color} onChange={e => setSubjectForm({...subjectForm, color: e.target.value})} style={{...inputStyle, height: '42px', padding: '4px'}} />
//               </div>
//             </div>
//             <button type="submit" disabled={formLoading} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
//               {formLoading ? 'Creating...' : 'Create Subject'}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {activeModal === 'add-lesson' && (
//         <Modal title="Add Lesson" onClose={() => setActiveModal(null)}>
//           <form onSubmit={handleAddLesson}>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</label>
//               <input value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Description</label>
//               <textarea value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})} style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>YouTube Link</label>
//               <input type="text" placeholder="https://youtube.com/watch?v=..." value={lessonForm.youtube_url} onChange={e => setLessonForm({...lessonForm, youtube_url: e.target.value})} required
//                 style={{...inputStyle, padding: '8px'}} />
//             </div>
//             <button type="submit" disabled={uploading} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
//               {uploading ? 'Parsing...' : 'Add Lesson'}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {activeModal === 'schedule-class' && (
//         <Modal title="Schedule Class" onClose={() => setActiveModal(null)}>
//           <form onSubmit={handleScheduleClass}>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</label>
//               <input value={classForm.title} onChange={e => setClassForm({...classForm, title: e.target.value})} required style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Date &amp; Time</label>
//               <input type="datetime-local" value={classForm.scheduled_at} onChange={e => setClassForm({...classForm, scheduled_at: e.target.value})} required style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Meeting Link</label>
//               <input value={classForm.meeting_link} onChange={e => setClassForm({...classForm, meeting_link: e.target.value})} style={inputStyle} placeholder="https://meet.google.com/..." />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Description</label>
//               <textarea value={classForm.description} onChange={e => setClassForm({...classForm, description: e.target.value})} style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} />
//             </div>
//             <button type="submit" disabled={formLoading} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
//               {formLoading ? 'Scheduling...' : 'Schedule Class'}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {activeModal === 'post-announcement' && (
//         <Modal title="Post Announcement" onClose={() => setActiveModal(null)}>
//           <form onSubmit={handlePostAnnouncement}>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</label>
//               <input value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} required style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Body</label>
//               <textarea value={announcementForm.body} onChange={e => setAnnouncementForm({...announcementForm, body: e.target.value})} required style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} />
//             </div>
//             <button type="submit" disabled={formLoading} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
//               {formLoading ? 'Posting...' : 'Post Announcement'}
//             </button>
//           </form>
//         </Modal>
//       )}

//       {activeModal === 'add-grade' && (
//         <Modal title="Add Grade" onClose={() => setActiveModal(null)}>
//           <form onSubmit={handleAddGrade}>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Student</label>
//               <select value={gradeForm.student_id} onChange={e => setGradeForm({...gradeForm, student_id: e.target.value})} required style={inputStyle}>
//                 <option value="">Select student...</option>
//                 {enrolledStudents.map((e) => (
//                   <option key={e.student_id} value={e.student_id}>{e.student?.full_name}</option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Assignment Title</label>
//               <input value={gradeForm.assignment_title} onChange={e => setGradeForm({...gradeForm, assignment_title: e.target.value})} required style={inputStyle} />
//             </div>
//             <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Score</label>
//                 <input type="number" value={gradeForm.score} onChange={e => setGradeForm({...gradeForm, score: e.target.value})} required style={inputStyle} />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Max Score</label>
//                 <input type="number" value={gradeForm.max_score} onChange={e => setGradeForm({...gradeForm, max_score: e.target.value})} required style={inputStyle} />
//               </div>
//             </div>
//             <div style={{ marginBottom: '16px' }}>
//               <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '0.85rem', marginBottom: '6px' }}>Feedback</label>
//               <textarea value={gradeForm.feedback} onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})} style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} />
//             </div>
//             <button type="submit" disabled={formLoading} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
//               {formLoading ? 'Saving...' : 'Add Grade'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '../layout'
import type { Subject, Announcement, Class as ClassType, Grade, Profile } from '@/types/database.types'

type SubjectWithEnrollments = Subject & {
  enrollments: { id: string }[]
  lessons: { id: string }[]
}

type GradeWithDetails = Grade & {
  subject: Pick<Subject, 'title'> | null
  student: Pick<Profile, 'full_name' | 'email'> | null
}

export default function TeacherDashboard() {
  const profile = useProfile()
  const supabase = createClient()
  
  const [subjects, setSubjects] = useState<SubjectWithEnrollments[]>([])
  const [classes, setClasses] = useState<(ClassType & { subject: Pick<Subject, 'title'> | null })[]>([])
  const [grades, setGrades] = useState<GradeWithDetails[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  // Modal / Form states
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [newSubjectTitle, setNewSubjectTitle] = useState('')
  const [newSubjectDescription, setNewSubjectDescription] = useState('')
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚')

  const [showClassModal, setShowClassModal] = useState(false)
  const [classTitle, setClassTitle] = useState('')
  const [classSubjectId, setClassSubjectId] = useState('')
  const [classScheduledAt, setClassScheduledAt] = useState('')
  const [classMeetingLink, setClassMeetingLink] = useState('')

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [annTitle, setAnnTitle] = useState('')
  const [annBody, setAnnBody] = useState('')

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchTeacherData = async () => {
      try {
        const [
          { data: subData },
          { data: classData },
          { data: gradeData },
          { data: annData }
        ] = await Promise.all([
          supabase
            .from('subjects')
            .select('*, enrollments(id), lessons(id)')
            .eq('teacher_id', profile.id),
          supabase
            .from('classes')
            .select('*, subject:subjects(title)')
            .order('scheduled_at', { ascending: true }),
          supabase
            .from('grades')
            .select('*, subject:subjects(title), student:profiles!grades_student_id_fkey(full_name, email)')
            .order('created_at', { ascending: false }),
          supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (cancelled) return

        if (subData) setSubjects(subData as SubjectWithEnrollments[])
        if (classData) setClasses(classData)
        if (gradeData) setGrades(gradeData as GradeWithDetails[])
        if (annData) setAnnouncements(annData)

      } catch (err) {
        console.error('Teacher dashboard fetch error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTeacherData()
    return () => { cancelled = true }
  }, [profile])

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    const { error } = await supabase.from('subjects').insert({
      title: newSubjectTitle,
      description: newSubjectDescription,
      icon: newSubjectIcon,
      teacher_id: profile.id,
    })

    if (error) {
      alert('Error creating subject: ' + error.message)
      return
    }

    setShowSubjectModal(false)
    setNewSubjectTitle('')
    setNewSubjectDescription('')
    window.location.reload()
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('classes').insert({
      title: classTitle,
      subject_id: classSubjectId,
      scheduled_at: new Date(classScheduledAt).toISOString(),
      meeting_link: classMeetingLink,
    })

    if (error) {
      alert('Error scheduling class: ' + error.message)
      return
    }

    setShowClassModal(false)
    setClassTitle('')
    setClassScheduledAt('')
    setClassMeetingLink('')
    window.location.reload()
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('announcements').insert({
      title: annTitle,
      body: annBody,
    })

    if (error) {
      alert('Error posting announcement: ' + error.message)
      return
    }

    setShowAnnouncementModal(false)
    setAnnTitle('')
    setAnnBody('')
    window.location.reload()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="spinner" />
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Teacher'

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '36px',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: '#FFFFFF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
            <span>👨‍🏫</span> Teacher Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', margin: 0 }}>
            Manage your subjects, schedule classes, and evaluate student submissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowSubjectModal(true)}
            style={{ padding: '12px 20px', borderRadius: '12px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
          >
            + Create Subject
          </button>
          <button
            onClick={() => setShowClassModal(true)}
            style={{ padding: '12px 20px', borderRadius: '12px', background: '#FFF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            📅 Schedule Class
          </button>
        </div>
      </motion.div>

      {/* Subjects Section */}
      <div id="subjects" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>
          📚 My Subjects
        </h2>

        {subjects.length === 0 ? (
          <div style={{ padding: '40px', background: '#FFF', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ color: '#64748B', marginBottom: '16px' }}>You haven&apos;t created any subjects yet.</p>
            <button onClick={() => setShowSubjectModal(true)} style={{ padding: '10px 20px', borderRadius: '10px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Create Your First Subject
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {subjects.map((sub) => (
              <div key={sub.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>{sub.icon || '📚'}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>{sub.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px', minHeight: '40px' }}>{sub.description || 'No description provided.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <span>👥 {sub.enrollments?.length || 0} Students</span>
                  <span>📖 {sub.lessons?.length || 0} Lessons</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gradebook Section */}
      <div id="gradebook" style={{ marginBottom: '40px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            📝 Student Gradebook
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                {['Student', 'Subject', 'Assignment', 'Score', 'Feedback'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>No student grades or submissions found.</td></tr>
              ) : (
                grades.map((g) => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px', color: '#0F172A', fontWeight: 600, fontSize: '0.9rem' }}>
                      {g.student?.full_name || 'Unknown Student'}
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>{g.student?.email}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem' }}>{g.subject?.title || 'General'}</td>
                    <td style={{ padding: '16px', color: '#0F172A', fontWeight: 700, fontSize: '0.9rem' }}>{g.assignment_title}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                        {g.score} / {g.max_score}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748B', fontSize: '0.85rem' }}>{g.feedback || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements Section */}
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            📢 Announcements
          </h2>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            style={{ padding: '8px 16px', borderRadius: '10px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            + Post Announcement
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {announcements.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>No announcements posted yet.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} style={{ padding: '16px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ color: '#0F172A', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{ann.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(ann.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>{ann.body}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: Create Subject */}
      {showSubjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Create New Subject</h3>
            <form onSubmit={handleCreateSubject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Subject Title</label>
                <input type="text" value={newSubjectTitle} onChange={e => setNewSubjectTitle(e.target.value)} required placeholder="e.g. Advanced Physics" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Description</label>
                <textarea value={newSubjectDescription} onChange={e => setNewSubjectDescription(e.target.value)} placeholder="Short course description..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', height: '80px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Emoji Icon</label>
                <input type="text" value={newSubjectIcon} onChange={e => setNewSubjectIcon(e.target.value)} placeholder="📚" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowSubjectModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F1F5F9', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Class */}
      {showClassModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Schedule Live Class</h3>
            <form onSubmit={handleCreateClass}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Class Title</label>
                <input type="text" value={classTitle} onChange={e => setClassTitle(e.target.value)} required placeholder="e.g. Chapter 1 Review" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Subject</label>
                <select value={classSubjectId} onChange={e => setClassSubjectId(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF', boxSizing: 'border-box' }}>
                  <option value="">Select a Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Date & Time</label>
                <input type="datetime-local" value={classScheduledAt} onChange={e => setClassScheduledAt(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Meeting Link (URL)</label>
                <input type="url" value={classMeetingLink} onChange={e => setClassMeetingLink(e.target.value)} placeholder="https://zoom.us/..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowClassModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F1F5F9', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Announcement */}
      {showAnnouncementModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Post Announcement</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Title</label>
                <input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required placeholder="Announcement title..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Message Body</label>
                <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} required placeholder="Write message to students..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', height: '100px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowAnnouncementModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F1F5F9', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#2563EB', color: '#FFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}