// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Image from 'next/image'
// import * as groupsService from '@/services/study-groups.service'
// import * as chatService from '@/services/chat.service'
// import type { StudyGroup, ChatMessage } from '@/types/database.types'

// const COLORS = ['#4169E1', '#9B59B6', '#27AE60', '#E74C3C', '#F39C12', '#1ABC9C', '#3498DB', '#E67E22']
// const ICONS = ['📖', '🧪', '📐', '💻', '🎨', '🌍', '📊', '🎵', '🔬', '📚']

// export default function StudyGroupsPage() {
//   const [groups, setGroups] = useState<StudyGroup[]>([])
//   const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
//   const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [newMessage, setNewMessage] = useState('')
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [sending, setSending] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Create form state
//   const [formName, setFormName] = useState('')
//   const [formDesc, setFormDesc] = useState('')
//   const [formIcon, setFormIcon] = useState('📖')
//   const [formColor, setFormColor] = useState('#4169E1')
//   const [formPublic, setFormPublic] = useState(true)

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       const [allRes, myRes] = await Promise.all([
//         groupsService.getGroups({ isPublic: true }),
//         groupsService.getMyGroups(),
//       ])
//       if (!cancelled) {
//         if (allRes.success && allRes.data) setGroups(allRes.data)
//         if (myRes.success && myRes.data) setMyGroups(myRes.data)
//         setLoading(false)
//       }
//     }
//     load()
//     return () => { cancelled = true }
//   }, [])

//   useEffect(() => {
//     if (selectedGroup) {
//       const loadMsgs = async () => {
//         const res = await chatService.getMessages(selectedGroup.id, 100)
//         if (res.success && res.data) setMessages(res.data)
//       }
//       loadMsgs()
//     }
//   }, [selectedGroup])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const handleCreateGroup = async () => {
//     if (!formName.trim()) return
//     const res = await groupsService.createGroup(formName, formDesc, formIcon, formColor, null, formPublic, 50)
//     if (res.success) {
//       setShowCreateModal(false)
//       setFormName('')
//       setFormDesc('')
//       reloadGroups()
//     }
//   }

//   const handleJoinGroup = async (groupId: string) => {
//     const res = await groupsService.joinGroup(groupId)
//     if (res.success) {
//       reloadGroups()
//     }
//   }

//   const reloadGroups = async () => {
//     const [allRes, myRes] = await Promise.all([
//       groupsService.getGroups({ isPublic: true }),
//       groupsService.getMyGroups(),
//     ])
//     if (allRes.success && allRes.data) setGroups(allRes.data)
//     if (myRes.success && myRes.data) setMyGroups(myRes.data)
//   }

//   const handleSendMessage = async () => {
//     if (!selectedGroup || !newMessage.trim() || sending) return
//     setSending(true)
//     const res = await chatService.sendMessage(selectedGroup.id, newMessage.trim())
//     if (res.success && res.data) {
//       const msg = res.data
//       setMessages(prev => [...prev, msg])
//       setNewMessage('')
//     }
//     setSending(false)
//   }

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!selectedGroup || !e.target.files?.[0]) return
//     const file = e.target.files[0]
//     const formData = new FormData()
//     formData.append('file', file)
//     formData.append('upload_preset', process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'ml_default')

//     try {
//       const uploadRes = await fetch('https://api.cloudinary.com/v1_1/' + process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] + '/auto/upload', {
//         method: 'POST',
//         body: formData,
//       })
//       const data = await uploadRes.json()
//       if (data.secure_url) {
//         const type = file.type.startsWith('image/') ? 'image' : 'file'
//         const res = await chatService.sendMessage(
//           selectedGroup.id,
//           `Shared: ${file.name}`,
//           data.secure_url,
//           type
//         )
//         if (res.success && res.data) {
//           const msg = res.data
//           setMessages(prev => [...prev, msg])
//         }
//       }
//     } catch (error) {
//       console.error('Upload failed:', error)
//     }
//   }

//   const myGroupIds = new Set(myGroups.map(g => g.id))

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <div>
//           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
//             Study Groups 👥
//           </h1>
//           <p style={{ color: 'rgba(0,0,0,0.5)' }}>Collaborate with fellow students</p>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           style={{
//             padding: '10px 20px', borderRadius: '10px', border: 'none',
//             background: 'linear-gradient(135deg, #4169E1, #2D4FC8)',
//             color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
//           }}
//         >
//           + Create Group
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: selectedGroup ? '300px 1fr' : '1fr', gap: '20px' }}>
//         {/* Groups List */}
//         <div>
//           {myGroups.length > 0 && (
//             <div style={{ marginBottom: '24px' }}>
//               <h3 style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
//                 My Groups
//               </h3>
//               {myGroups.map(group => (
//                 <motion.button
//                   key={group.id}
//                   onClick={() => setSelectedGroup(group)}
//                   whileHover={{ x: 4 }}
//                     style={{ willChange: 'transform, opacity',
//                     width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
//                     padding: '12px 16px', borderRadius: '10px', marginBottom: '8px',
//                     background: selectedGroup?.id === group.id ? 'rgba(65, 105, 225, 0.2)' : 'rgba(0,0,0,0.03)',
//                     border: `1px solid ${selectedGroup?.id === group.id ? 'rgba(65, 105, 225, 0.3)' : 'rgba(0,0,0,0.06)'}`,
//                     color: '#1A1A2E', cursor: 'pointer', textAlign: 'left',
//                   }}
//                 >
//                   <div style={{
//                     width: '40px', height: '40px', borderRadius: '10px',
//                     background: `${group.color}20`, display: 'flex',
//                     alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
//                   }}>
//                     {group.icon}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{group.name}</div>
//                     <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>{group.description?.slice(0, 30) || 'No description'}</div>
//                   </div>
//                 </motion.button>
//               ))}
//             </div>
//           )}

//           <h3 style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
//             Discover Groups
//           </h3>
//           {loading ? (
//             <div style={{ color: 'rgba(0,0,0,0.4)', textAlign: 'center', padding: '20px' }}>Loading...</div>
//           ) : groups.filter(g => !myGroupIds.has(g.id)).length === 0 ? (
//             <div style={{ color: 'rgba(0,0,0,0.4)', textAlign: 'center', padding: '20px' }}>No groups available</div>
//           ) : (
//             groups.filter(g => !myGroupIds.has(g.id)).map(group => (
//               <motion.div
//                 key={group.id}
//                 whileHover={{ x: 4 }}
//                   style={{ willChange: 'transform, opacity',
//                   display: 'flex', alignItems: 'center', gap: '12px',
//                   padding: '12px 16px', borderRadius: '10px', marginBottom: '8px',
//                   background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)',
//                 }}
//               >
//                 <div style={{ willChange: 'transform, opacity', 
//                   width: '40px', height: '40px', borderRadius: '10px',
//                   background: `${group.color}20`, display: 'flex',
//                   alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
//                 }}>
//                   {group.icon}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A2E' }}>{group.name}</div>
//                   <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>{group.description?.slice(0, 30) || 'No description'}</div>
//                 </div>
//                 <button
//                   onClick={() => handleJoinGroup(group.id)}
//                   style={{
//                     padding: '6px 12px', borderRadius: '6px', border: 'none',
//                     background: 'rgba(65, 105, 225, 0.2)', color: '#4169E1',
//                     fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
//                   }}
//                 >
//                   Join
//                 </button>
//               </motion.div>
//             ))
//           )}
//         </div>

//         {/* Chat Area */}
//         {selectedGroup && (
//           <div style={{
//             background: 'rgba(0,0,0,0.02)',
//             border: '1px solid rgba(0,0,0,0.06)',
//             borderRadius: '16px',
//             display: 'flex',
//             flexDirection: 'column',
//             height: 'calc(100vh - 220px)',
//           }}>
//             {/* Chat Header */}
//             <div style={{
//               padding: '16px 20px',
//               borderBottom: '1px solid rgba(0,0,0,0.06)',
//               display: 'flex', alignItems: 'center', gap: '12px',
//             }}>
//               <div style={{
//                 width: '40px', height: '40px', borderRadius: '10px',
//                 background: `${selectedGroup.color}20`, display: 'flex',
//                 alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
//               }}>
//                 {selectedGroup.icon}
//               </div>
//               <div>
//                 <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>{selectedGroup.name}</div>
//                 <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>{selectedGroup.description}</div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
//               {messages.length === 0 ? (
//                 <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.3)', paddingTop: '40px' }}>
//                   No messages yet. Start the conversation!
//                 </div>
//               ) : (
//                 messages.map(msg => (
//                   <div key={msg.id} style={{ marginBottom: '16px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
//                       <div style={{
//                         width: '28px', height: '28px', borderRadius: '50%',
//                         background: 'linear-gradient(135deg, #4169E1, #2D4FC8)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: '0.65rem', fontWeight: 700, color: '#1A1A2E',
//                       }}>
//                         {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name?.[0] || '?'}
//                       </div>
//                       <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
//                         {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name || 'Unknown'}
//                       </span>
//                       <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.3)' }}>
//                         {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                     {msg.attachment_url && msg.attachment_type === 'image' ? (
//                       <div style={{ position: 'relative', maxWidth: '300px', marginTop: '4px' }}>
//                         <Image src={msg.attachment_url} alt={msg.content || 'Shared image'} width={300} height={200} style={{
//                           borderRadius: '12px', objectFit: 'cover',
//                         }} />
//                       </div>
//                     ) : msg.attachment_url ? (
//                       <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{
//                         display: 'inline-block', padding: '8px 12px', borderRadius: '8px',
//                         background: 'rgba(65, 105, 225, 0.1)', color: '#4169E1',
//                         fontSize: '0.85rem', textDecoration: 'none',
//                       }}>
//                         📎 {msg.content || 'File attachment'}
//                       </a>
//                     ) : (
//                       <div style={{
//                         padding: '10px 14px', borderRadius: '12px',
//                         background: 'rgba(0,0,0,0.03)',
//                         color: 'rgba(0,0,0,0.7)', fontSize: '0.9rem',
//                       }}>
//                         {msg.content}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div style={{
//               padding: '16px 20px',
//               borderTop: '1px solid rgba(0,0,0,0.06)',
//               display: 'flex', gap: '12px', alignItems: 'center',
//             }}>
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 style={{
//                   width: '40px', height: '40px', borderRadius: '10px',
//                   background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
//                   color: 'rgba(0,0,0,0.5)', fontSize: '1.1rem', cursor: 'pointer',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}
//                 title="Attach file or photo"
//               >
//                 📎
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*,.pdf,.doc,.docx,.txt"
//                 style={{ display: 'none' }}
//                 onChange={handleFileUpload}
//               />
//               <input
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder="Type a message..."
//                 style={{
//                   flex: 1, padding: '12px 16px', borderRadius: '10px',
//                   background: 'rgba(0,0,0,0.03)',
//                   border: '1px solid rgba(0,0,0,0.08)',
//                   color: '#1A1A2E', fontSize: '0.9rem', outline: 'none',
//                 }}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={sending || !newMessage.trim()}
//                 style={{
//                   padding: '12px 20px', borderRadius: '10px', border: 'none',
//                   background: newMessage.trim() ? 'linear-gradient(135deg, #4169E1, #2D4FC8)' : 'rgba(0,0,0,0.03)',
//                   color: newMessage.trim() ? 'white' : 'rgba(0,0,0,0.3)',
//                   fontSize: '0.9rem', fontWeight: 600, cursor: newMessage.trim() ? 'pointer' : 'default',
//                 }}
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Create Group Modal */}
//       <AnimatePresence>
//         {showCreateModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//               style={{ willChange: 'transform, opacity',
//               position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               zIndex: 100, padding: '20px',
//             }}
//             onClick={() => setShowCreateModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//                 style={{ willChange: 'transform, opacity',
//                 background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
//                 borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px',
//               }}
//             >
//               <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '24px' }}>
//                 Create Study Group
//               </h2>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '6px', display: 'block' }}>
//                   Group Name *
//                 </label>
//                 <input
//                   value={formName}
//                   onChange={(e) => setFormName(e.target.value)}
//                   placeholder="e.g., Physics Study Group"
//                   style={{
//                     width: '100%', padding: '12px', borderRadius: '10px',
//                     background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
//                     color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '6px', display: 'block' }}>
//                   Description
//                 </label>
//                 <textarea
//                   value={formDesc}
//                   onChange={(e) => setFormDesc(e.target.value)}
//                   placeholder="What will you study?"
//                   rows={3}
//                   style={{
//                     width: '100%', padding: '12px', borderRadius: '10px',
//                     background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
//                     color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical',
//                     fontFamily: 'var(--font-body)', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '8px', display: 'block' }}>
//                   Icon
//                 </label>
//                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                   {ICONS.map(icon => (
//                     <button
//                       key={icon}
//                       onClick={() => setFormIcon(icon)}
//                       style={{
//                         width: '40px', height: '40px', borderRadius: '8px',
//                         background: formIcon === icon ? 'rgba(65, 105, 225, 0.3)' : 'rgba(0,0,0,0.03)',
//                         border: formIcon === icon ? '1px solid #4169E1' : '1px solid rgba(0,0,0,0.08)',
//                         fontSize: '1.2rem', cursor: 'pointer',
//                       }}
//                     >
//                       {icon}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '8px', display: 'block' }}>
//                   Color
//                 </label>
//                 <div style={{ display: 'flex', gap: '8px' }}>
//                   {COLORS.map(color => (
//                     <button
//                       key={color}
//                       onClick={() => setFormColor(color)}
//                       style={{
//                         width: '32px', height: '32px', borderRadius: '8px',
//                         background: color,
//                         border: formColor === color ? '2px solid white' : '2px solid transparent',
//                         cursor: 'pointer',
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
//                 <label style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>Public Group</label>
//                 <button
//                   onClick={() => setFormPublic(!formPublic)}
//                   style={{
//                     width: '44px', height: '24px', borderRadius: '12px',
//                     background: formPublic ? '#4169E1' : 'rgba(0,0,0,0.08)',
//                     border: 'none', cursor: 'pointer', position: 'relative',
//                   }}
//                 >
//                   <div style={{
//                     width: '18px', height: '18px', borderRadius: '50%',
//                     background: 'white', position: 'absolute', top: '3px',
//                     left: formPublic ? '23px' : '3px', transition: 'left 0.2s',
//                   }} />
//                 </button>
//               </div>

//               <div style={{ display: 'flex', gap: '12px' }}>
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   style={{
//                     flex: 1, padding: '12px', borderRadius: '10px',
//                     background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
//                     color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', cursor: 'pointer',
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateGroup}
//                   disabled={!formName.trim()}
//                   style={{
//                     flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
//                     background: formName.trim() ? 'linear-gradient(135deg, #4169E1, #2D4FC8)' : 'rgba(0,0,0,0.03)',
//                     color: formName.trim() ? 'white' : 'rgba(0,0,0,0.3)',
//                     fontSize: '0.9rem', fontWeight: 600, cursor: formName.trim() ? 'pointer' : 'default',
//                   }}
//                 >
//                   Create
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import * as groupsService from '@/services/study-groups.service'
import * as chatService from '@/services/chat.service'
import type { StudyGroup, ChatMessage } from '@/types/database.types'

const COLORS = ['#2563EB', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#3B82F6', '#F97316']
const ICONS = ['📖', '🧪', '📐', '💻', '🎨', '🌍', '📊', '🎵', '🔬', '📚']

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create form state
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formIcon, setFormIcon] = useState('📖')
  const [formColor, setFormColor] = useState('#2563EB')
  const [formPublic, setFormPublic] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [allRes, myRes] = await Promise.all([
        groupsService.getGroups({ isPublic: true }),
        groupsService.getMyGroups(),
      ])
      if (!cancelled) {
        if (allRes.success && allRes.data) setGroups(allRes.data)
        if (myRes.success && myRes.data) setMyGroups(myRes.data)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (selectedGroup) {
      const loadMsgs = async () => {
        const res = await chatService.getMessages(selectedGroup.id, 100)
        if (res.success && res.data) setMessages(res.data)
      }
      loadMsgs()
    }
  }, [selectedGroup])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleCreateGroup = async () => {
    if (!formName.trim()) return
    const res = await groupsService.createGroup(formName, formDesc, formIcon, formColor, null, formPublic, 50)
    if (res.success) {
      setShowCreateModal(false)
      setFormName('')
      setFormDesc('')
      reloadGroups()
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    const res = await groupsService.joinGroup(groupId)
    if (res.success) {
      reloadGroups()
    }
  }

  const reloadGroups = async () => {
    const [allRes, myRes] = await Promise.all([
      groupsService.getGroups({ isPublic: true }),
      groupsService.getMyGroups(),
    ])
    if (allRes.success && allRes.data) setGroups(allRes.data)
    if (myRes.success && myRes.data) setMyGroups(myRes.data)
  }

  const handleSendMessage = async () => {
    if (!selectedGroup || !newMessage.trim() || sending) return
    setSending(true)
    const res = await chatService.sendMessage(selectedGroup.id, newMessage.trim())
    if (res.success && res.data) {
      const msg = res.data
      setMessages(prev => [...prev, msg])
      setNewMessage('')
    }
    setSending(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGroup || !e.target.files?.[0]) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'ml_default')

    try {
      const uploadRes = await fetch('https://api.cloudinary.com/v1_1/' + process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] + '/auto/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await uploadRes.json()
      if (data.secure_url) {
        const type = file.type.startsWith('image/') ? 'image' : 'file'
        const res = await chatService.sendMessage(
          selectedGroup.id,
          `Shared: ${file.name}`,
          data.secure_url,
          type
        )
        if (res.success && res.data) {
          const msg = res.data
          setMessages(prev => [...prev, msg])
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const myGroupIds = new Set(myGroups.map(g => g.id))

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <span>👥</span> Peer Collaboration
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Study Groups
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Collaborate, share files, and study together in real-time</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 22px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          }}
        >
          + Create Group
        </motion.button>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedGroup ? '320px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Groups Column List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* My Groups Section */}
          {myGroups.length > 0 && (
            <div>
              <h3 style={{ color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em', fontWeight: 700 }}>
                My Enrolled Groups ({myGroups.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {myGroups.map(group => {
                  const isSelected = selectedGroup?.id === group.id
                  return (
                    <motion.button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      whileHover={{ x: 4 }}
                      style={{
                        willChange: 'transform, opacity',
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 16px', borderRadius: '14px',
                        background: isSelected ? '#EFF6FF' : '#FFFFFF',
                        border: `1px solid ${isSelected ? '#93C5FD' : '#E2E8F0'}`,
                        color: '#0F172A', cursor: 'pointer', textAlign: 'left',
                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: `${group.color}15`, border: `1px solid ${group.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                        flexShrink: 0,
                      }}>
                        {group.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {group.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {group.description || 'Active study space'}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Discover Groups Section */}
          <div>
            <h3 style={{ color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.06em', fontWeight: 700 }}>
              Discover Public Groups
            </h3>

            {loading ? (
              <div style={{ color: '#64748B', textAlign: 'center', padding: '24px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0' }}>Loading groups...</div>
            ) : groups.filter(g => !myGroupIds.has(g.id)).length === 0 ? (
              <div style={{ color: '#64748B', textAlign: 'center', padding: '24px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>No new groups to discover right now.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {groups.filter(g => !myGroupIds.has(g.id)).map(group => (
                  <motion.div
                    key={group.id}
                    whileHover={{ x: 4 }}
                    style={{
                      willChange: 'transform, opacity',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '14px',
                      background: '#FFFFFF', border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: `${group.color}15`, border: `1px solid ${group.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                      flexShrink: 0,
                    }}>
                      {group.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {group.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {group.description || 'Public study circle'}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinGroup(group.id)}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', border: 'none',
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
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 200px)',
            minHeight: '520px',
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
                  width: '46px', height: '46px', borderRadius: '14px',
                  background: `${selectedGroup.color}18`, border: `1px solid ${selectedGroup.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                }}>
                  {selectedGroup.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{selectedGroup.name}</div>
                  <div style={{ fontSize: '0.81rem', color: '#64748B', marginTop: '1px' }}>{selectedGroup.description || 'Active study group chat'}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGroup(null)}
                style={{
                  background: 'none', border: 'none', fontSize: '1.1rem', color: '#64748B', cursor: 'pointer',
                  padding: '6px', borderRadius: '8px',
                }}
                title="Close Chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#FDFEFE' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', paddingTop: '60px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💬</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No messages yet.</div>
                  <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Start the conversation with your group members!</div>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF',
                      }}>
                        {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name?.[0] || '?'}
                      </div>
                      <span style={{ fontSize: '0.84rem', color: '#1E293B', fontWeight: 700 }}>
                        {(msg as unknown as { sender?: { full_name: string } }).sender?.full_name || 'Unknown User'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.attachment_url && msg.attachment_type === 'image' ? (
                      <div style={{ position: 'relative', maxWidth: '300px', marginTop: '6px', marginLeft: '38px' }}>
                        <Image src={msg.attachment_url} alt={msg.content || 'Shared image'} width={300} height={200} style={{
                          borderRadius: '14px', objectFit: 'cover', border: '1px solid #E2E8F0',
                        }} />
                      </div>
                    ) : msg.attachment_url ? (
                      <div style={{ marginLeft: '38px', marginTop: '4px' }}>
                        <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px',
                          background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE',
                          fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600,
                        }}>
                          📎 {msg.content || 'File attachment'}
                        </a>
                      </div>
                    ) : (
                      <div style={{
                        marginLeft: '38px',
                        padding: '12px 16px', borderRadius: '0 14px 14px 14px',
                        background: '#F1F5F9', color: '#0F172A', fontSize: '0.9rem',
                        lineHeight: 1.5, maxWidth: '80%', display: 'inline-block',
                      }}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div style={{
              padding: '18px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex', gap: '12px', alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: '#FFFFFF', border: '1px solid #CBD5E1',
                  color: '#64748B', fontSize: '1.2rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
                title="Attach file or photo"
              >
                📎
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message to your study group..."
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: '12px',
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
                  padding: '12px 22px', borderRadius: '12px', border: 'none',
                  background: newMessage.trim() ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#E2E8F0',
                  color: newMessage.trim() ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.92rem', fontWeight: 700, cursor: newMessage.trim() ? 'pointer' : 'default',
                  boxShadow: newMessage.trim() ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
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
                borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '500px',
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
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
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
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: '#F8FAFC', border: '1px solid #CBD5E1',
                    color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
                    fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Icon Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Choose Icon
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setFormIcon(icon)}
                      style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        background: formIcon === icon ? '#EFF6FF' : '#F8FAFC',
                        border: formIcon === icon ? '2px solid #2563EB' : '1px solid #CBD5E1',
                        fontSize: '1.2rem', cursor: 'pointer',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
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
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: color,
                        border: formColor === color ? '3px solid #0F172A' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Public Toggle */}
              <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Public Group</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Allow anyone to discover and join this group</div>
                </div>
                <button
                  onClick={() => setFormPublic(!formPublic)}
                  style={{
                    width: '48px', height: '26px', borderRadius: '13px',
                    background: formPublic ? '#2563EB' : '#CBD5E1',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
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
                    flex: 1, padding: '14px', borderRadius: '12px',
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
                    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
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