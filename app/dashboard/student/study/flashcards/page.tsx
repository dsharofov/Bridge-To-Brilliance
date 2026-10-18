// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { motion, AnimatePresence } from 'framer-motion'
// // import * as flashcardsService from '@/services/flashcards.service'
// // import type { FlashcardDeck, Flashcard } from '@/types/database.types'

// // export default function FlashcardsPage() {
// //   const [decks, setDecks] = useState<FlashcardDeck[]>([])
// //   const [selectedDeck, setSelectedDeck] = useState<{ deck: FlashcardDeck; cards: Flashcard[] } | null>(null)
// //   const [currentCardIndex, setCurrentCardIndex] = useState(0)
// //   const [isFlipped, setIsFlipped] = useState(false)
// //   const [showCreateModal, setShowCreateModal] = useState(false)
// //   const [showAddCardModal, setShowAddCardModal] = useState(false)

// //   // Form states
// //   const [deckTitle, setDeckTitle] = useState('')
// //   const [deckDesc, setDeckDesc] = useState('')
// //   const [cardFront, setCardFront] = useState('')
// //   const [cardBack, setCardBack] = useState('')

// //   useEffect(() => {
// //     let cancelled = false
// //     const load = async () => {
// //       const res = await flashcardsService.getDecks()
// //       if (!cancelled && res.success && res.data) setDecks(res.data)
// //     }
// //     load()
// //     return () => { cancelled = true }
// //   }, [])

// //   const loadDecks = async () => {
// //     const res = await flashcardsService.getDecks()
// //     if (res.success && res.data) setDecks(res.data)
// //   }

// //   const loadDeck = async (id: string) => {
// //     const res = await flashcardsService.getDeck(id)
// //     if (res.success && res.data) {
// //       setSelectedDeck({ deck: res.data, cards: res.data.cards ?? [] })
// //       setCurrentCardIndex(0)
// //       setIsFlipped(false)
// //     }
// //   }

// //   const handleCreateDeck = async () => {
// //     if (!deckTitle.trim()) return
// //     const res = await flashcardsService.createDeck(deckTitle, deckDesc, null, true)
// //     if (res.success) {
// //       setShowCreateModal(false)
// //       setDeckTitle('')
// //       setDeckDesc('')
// //       loadDecks()
// //     }
// //   }

// //   const handleAddCard = async () => {
// //     if (!selectedDeck || !cardFront.trim() || !cardBack.trim()) return
// //     const res = await flashcardsService.addCard(
// //       selectedDeck.deck.id,
// //       cardFront,
// //       cardBack,
// //       selectedDeck.cards.length
// //     )
// //     if (res.success) {
// //       loadDeck(selectedDeck.deck.id)
// //       setShowAddCardModal(false)
// //       setCardFront('')
// //       setCardBack('')
// //     }
// //   }

// //   const handleRateCard = async (rating: number) => {
// //     if (!selectedDeck) return
// //     const card = selectedDeck.cards[currentCardIndex]
// //     await flashcardsService.updateCardProgress(card.id, rating)
// //     if (currentCardIndex < selectedDeck.cards.length - 1) {
// //       setCurrentCardIndex(prev => prev + 1)
// //       setIsFlipped(false)
// //     }
// //   }

// //   return (
// //     <div>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
// //         <div>
// //           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
// //             Flashcards 🃏
// //           </h1>
// //           <p style={{ color: 'rgba(0,0,0,0.5)' }}>Create and review flashcard decks</p>
// //         </div>
// //         {selectedDeck && (
// //           <button
// //             onClick={() => { setSelectedDeck(null); setShowAddCardModal(true) }}
// //             style={{
// //               padding: '10px 20px', borderRadius: '10px', border: 'none',
// //               background: 'linear-gradient(135deg, #9B59B6, #7D3C98)',
// //               color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
// //               marginRight: '12px',
// //             }}
// //           >
// //             + Add Card
// //           </button>
// //         )}
// //         <button
// //           onClick={() => setShowCreateModal(true)}
// //           style={{
// //             padding: '10px 20px', borderRadius: '10px', border: 'none',
// //             background: 'linear-gradient(135deg, #4169E1, #2D4FC8)',
// //             color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
// //           }}
// //         >
// //           + New Deck
// //         </button>
// //       </div>

// //       {selectedDeck ? (
// //         // Study Mode
// //         <div style={{ maxWidth: '600px', margin: '0 auto' }}>
// //           <button
// //             onClick={() => setSelectedDeck(null)}
// //             style={{
// //               background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)',
// //               fontSize: '0.9rem', cursor: 'pointer', marginBottom: '20px', padding: 0,
// //             }}
// //           >
// //             ← Back to Decks
// //           </button>

// //           <h2 style={{ color: '#1A1A2E', marginBottom: '8px' }}>{selectedDeck.deck.title}</h2>
// //           <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', marginBottom: '24px' }}>
// //             Card {currentCardIndex + 1} of {selectedDeck.cards.length}
// //           </p>

// //           {/* Progress Bar */}
// //           <div style={{ height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', marginBottom: '32px' }}>
// //             <div style={{
// //               height: '100%', borderRadius: '2px', transition: 'width 0.3s',
// //               width: `${((currentCardIndex + 1) / selectedDeck.cards.length) * 100}%`,
// //               background: 'linear-gradient(90deg, #9B59B6, #4169E1)',
// //             }} />
// //           </div>

// //           {selectedDeck.cards.length === 0 ? (
// //             <div style={{ textAlign: 'center', padding: '60px 20px' }}>
// //               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
// //               <p style={{ color: 'rgba(0,0,0,0.5)' }}>No cards yet. Add some cards to start studying!</p>
// //             </div>
// //           ) : (
// //             <>
// //               {/* Flashcard */}
// //               <motion.div
// //                 onClick={() => setIsFlipped(!isFlipped)}
// //                 animate={{ rotateY: isFlipped ? 180 : 0 }}
// //                 transition={{ type: 'spring', stiffness: 200, damping: 20 }}
// //                   style={{ willChange: 'transform, opacity',
// //                   background: '#ffffff',
// //                   border: '1px solid rgba(0,0,0,0.06)',
// //                   borderRadius: '20px',
// //                   padding: '40px',
// //                   minHeight: '250px',
// //                   display: 'flex',
// //                   alignItems: 'center',
// //                   justifyContent: 'center',
// //                   cursor: 'pointer',
// //                   perspective: '1000px',
// //                   marginBottom: '24px',
// //                 }}
// //               >
// //                 <div style={{
// //                   textAlign: 'center',
// //                   color: '#1A1A2E',
// //                   fontSize: '1.3rem',
// //                   lineHeight: 1.6,
// //                   transform: isFlipped ? 'rotateY(180deg)' : 'none',
// //                 }}>
// //                   <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
// //                     {isFlipped ? 'Answer' : 'Question'}
// //                   </div>
// //                   {isFlipped ? selectedDeck.cards[currentCardIndex].back : selectedDeck.cards[currentCardIndex].front}
// //                 </div>
// //               </motion.div>

// //               <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: '0.8rem', marginBottom: '24px' }}>
// //                 Click to {isFlipped ? 'see question' : 'reveal answer'}
// //               </p>

// //               {/* Rating Buttons */}
// //               <AnimatePresence>
// //                 {isFlipped && (
// //                   <motion.div
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     style={{ willChange: 'transform, opacity',  display: 'flex', gap: '12px', justifyContent: 'center' }}
// //                   >
// //                     {[
// //                       { label: 'Again', color: '#E74C3C', value: 0 },
// //                       { label: 'Hard', color: '#F39C12', value: 1 },
// //                       { label: 'Good', color: '#27AE60', value: 2 },
// //                       { label: 'Easy', color: '#4169E1', value: 3 },
// //                     ].map(r => (
// //                       <button
// //                         key={r.label}
// //                         onClick={() => handleRateCard(r.value)}
// //                         style={{
// //                           padding: '12px 24px', borderRadius: '10px', border: 'none',
// //                           background: `${r.color}20`, color: r.color,
// //                           fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
// //                         }}
// //                       >
// //                         {r.label}
// //                       </button>
// //                     ))}
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //             </>
// //           )}
// //         </div>
// //       ) : (
// //         // Deck Grid
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
// //           {decks.length === 0 ? (
// //             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
// //               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🃏</div>
// //               <p style={{ color: 'rgba(0,0,0,0.5)' }}>No flashcard decks yet. Create one to get started!</p>
// //             </div>
// //           ) : (
// //             decks.map(deck => (
// //               <motion.div
// //                 key={deck.id}
// //                 whileHover={{ y: -4 }}
// //                 onClick={() => loadDeck(deck.id)}
// //                   style={{ willChange: 'transform, opacity',
// //                   background: '#ffffff',
// //                   border: '1px solid rgba(0,0,0,0.06)',
// //                   borderRadius: '16px',
// //                   padding: '24px',
// //                   cursor: 'pointer',
// //                 }}
// //               >
// //                 <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#1A1A2E', marginBottom: '8px' }}>
// //                   {deck.title}
// //                 </h3>
// //                 <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', marginBottom: '16px' }}>
// //                   {deck.description || 'No description'}
// //                 </p>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                   <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.3)' }}>
// //                     {(deck as unknown as { card_count?: number }).card_count ?? 0} cards
// //                   </span>
// //                   <span style={{
// //                     padding: '4px 10px', borderRadius: '6px',
// //                     background: deck.is_public ? 'rgba(39, 174, 96, 0.1)' : 'rgba(0,0,0,0.03)',
// //                     color: deck.is_public ? '#27AE60' : 'rgba(0,0,0,0.4)',
// //                     fontSize: '0.7rem', fontWeight: 600,
// //                   }}>
// //                     {deck.is_public ? 'Public' : 'Private'}
// //                   </span>
// //                 </div>
// //               </motion.div>
// //             ))
// //           )}
// //         </div>
// //       )}

// //       {/* Create Deck Modal */}
// //       <AnimatePresence>
// //         {showCreateModal && (
// //           <motion.div
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
// //             style={{ willChange: 'transform, opacity',  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
// //             onClick={() => setShowCreateModal(false)}
// //           >
// //             <motion.div
// //               initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
// //               onClick={(e) => e.stopPropagation()}
// //               style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}
// //             >
// //               <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '24px' }}>New Flashcard Deck</h2>
// //               <input value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} placeholder="Deck title *" style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
// //               <textarea value={deckDesc} onChange={(e) => setDeckDesc(e.target.value)} placeholder="Description (optional)" rows={3} style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '16px' }} />
// //               <div style={{ willChange: 'transform, opacity',  display: 'flex', gap: '12px' }}>
// //                 <button onClick={() => setShowCreateModal(false)} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
// //                 <button onClick={handleCreateDeck} disabled={!deckTitle.trim()} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: deckTitle.trim() ? 'linear-gradient(135deg, #9B59B6, #7D3C98)' : 'rgba(0,0,0,0.03)', color: deckTitle.trim() ? 'white' : 'rgba(0,0,0,0.3)', fontSize: '0.9rem', fontWeight: 600, cursor: deckTitle.trim() ? 'pointer' : 'default' }}>Create</button>
// //               </div>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       {/* Add Card Modal */}
// //       <AnimatePresence>
// //         {showAddCardModal && (
// //           <motion.div
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
// //             style={{ willChange: 'transform, opacity',  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
// //             onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
// //           >
// //             <motion.div
// //               initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
// //               onClick={(e) => e.stopPropagation()}
// //               style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}
// //             >
// //               <h2 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '24px' }}>Add Flashcard</h2>
// //               <textarea value={cardFront} onChange={(e) => setCardFront(e.target.value)} placeholder="Front (question) *" rows={3} style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '12px' }} />
// //               <textarea value={cardBack} onChange={(e) => setCardBack(e.target.value)} placeholder="Back (answer) *" rows={3} style={{ willChange: 'transform, opacity',  width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A2E', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '16px' }} />
// //               <div style={{ willChange: 'transform, opacity',  display: 'flex', gap: '12px' }}>
// //                 <button onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
// //                 <button onClick={handleAddCard} disabled={!cardFront.trim() || !cardBack.trim()} style={{ willChange: 'transform, opacity',  flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: cardFront.trim() && cardBack.trim() ? 'linear-gradient(135deg, #9B59B6, #7D3C98)' : 'rgba(0,0,0,0.03)', color: cardFront.trim() && cardBack.trim() ? 'white' : 'rgba(0,0,0,0.3)', fontSize: '0.9rem', fontWeight: 600, cursor: cardFront.trim() && cardBack.trim() ? 'pointer' : 'default' }}>Add</button>
// //               </div>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   )
// // }
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import * as flashcardsService from '@/services/flashcards.service'
// import type { FlashcardDeck, Flashcard } from '@/types/database.types'

// export default function FlashcardsPage() {
//   const [decks, setDecks] = useState<FlashcardDeck[]>([])
//   const [selectedDeck, setSelectedDeck] = useState<{ deck: FlashcardDeck; cards: Flashcard[] } | null>(null)
//   const [currentCardIndex, setCurrentCardIndex] = useState(0)
//   const [isFlipped, setIsFlipped] = useState(false)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [showAddCardModal, setShowAddCardModal] = useState(false)

//   // Form states
//   const [deckTitle, setDeckTitle] = useState('')
//   const [deckDesc, setDeckDesc] = useState('')
//   const [cardFront, setCardFront] = useState('')
//   const [cardBack, setCardBack] = useState('')

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       const res = await flashcardsService.getDecks()
//       if (!cancelled && res.success && res.data) setDecks(res.data)
//     }
//     load()
//     return () => { cancelled = true }
//   }, [])

//   const loadDecks = async () => {
//     const res = await flashcardsService.getDecks()
//     if (res.success && res.data) setDecks(res.data)
//   }

//   const loadDeck = async (id: string) => {
//     const res = await flashcardsService.getDeck(id)
//     if (res.success && res.data) {
//       setSelectedDeck({ deck: res.data, cards: res.data.cards ?? [] })
//       setCurrentCardIndex(0)
//       setIsFlipped(false)
//     }
//   }

//   const handleCreateDeck = async () => {
//     if (!deckTitle.trim()) return
//     const res = await flashcardsService.createDeck(deckTitle, deckDesc, null, true)
//     if (res.success) {
//       setShowCreateModal(false)
//       setDeckTitle('')
//       setDeckDesc('')
//       loadDecks()
//     }
//   }

//   const handleAddCard = async () => {
//     if (!selectedDeck || !cardFront.trim() || !cardBack.trim()) return
//     const res = await flashcardsService.addCard(
//       selectedDeck.deck.id,
//       cardFront,
//       cardBack,
//       selectedDeck.cards.length
//     )
//     if (res.success) {
//       loadDeck(selectedDeck.deck.id)
//       setShowAddCardModal(false)
//       setCardFront('')
//       setCardBack('')
//     }
//   }

//   const handleRateCard = async (rating: number) => {
//     if (!selectedDeck) return
//     const card = selectedDeck.cards[currentCardIndex]
//     await flashcardsService.updateCardProgress(card.id, rating)
//     if (currentCardIndex < selectedDeck.cards.length - 1) {
//       setCurrentCardIndex(prev => prev + 1)
//       setIsFlipped(false)
//     }
//   }

//   return (
//     <div style={{ paddingBottom: '40px' }}>
      
//       {/* Top Header Section */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
//         <div>
//           <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '4px 12px',
//             borderRadius: '20px',
//             background: '#F3E8FF',
//             border: '1px solid #E9D5FF',
//             color: '#7C3AED',
//             fontSize: '0.8rem',
//             fontWeight: 600,
//             marginBottom: '10px',
//           }}>
//             <span>🃏</span> Active Recall & Revision
//           </div>
//           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
//             Flashcards
//           </h1>
//           <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Create custom decks, flip through cards, and master your subjects</p>
//         </div>

//         <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//           {selectedDeck && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowAddCardModal(true)}
//               style={{
//                 padding: '12px 20px', borderRadius: '14px', border: 'none',
//                 background: '#F3E8FF', color: '#7C3AED',
//                 fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
//                 //border: '1px solid #D8B4FE',
//               }}
//             >
//               + Add Card
//             </motion.button>
//           )}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => setShowCreateModal(true)}
//             style={{
//               padding: '12px 22px', borderRadius: '14px', border: 'none',
//               background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
//               color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
//               boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
//             }}
//           >
//             + New Deck
//           </motion.button>
//         </div>
//       </div>

//       {selectedDeck ? (
//         // Study Mode View
//         <div style={{ maxWidth: '640px', margin: '0 auto' }}>
//           <button
//             onClick={() => setSelectedDeck(null)}
//             style={{
//               background: 'none', border: 'none', color: '#2563EB',
//               fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', padding: 0,
//               display: 'inline-flex', alignItems: 'center', gap: '6px',
//             }}
//           >
//             <span>←</span> Back to Decks
//           </button>

//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
//             <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedDeck.deck.title}</h2>
//             <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
//               Card {currentCardIndex + 1} of {selectedDeck.cards.length}
//             </span>
//           </div>

//           {/* Progress Bar */}
//           <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '10px', marginBottom: '28px', overflow: 'hidden' }}>
//             <div style={{
//               height: '100%', borderRadius: '10px', transition: 'width 0.3s ease',
//               width: selectedDeck.cards.length > 0 ? `${((currentCardIndex + 1) / selectedDeck.cards.length) * 100}%` : '0%',
//               background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
//             }} />
//           </div>

//           {selectedDeck.cards.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
//               <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Cards in This Deck</h3>
//               <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>Add some flashcards to start your study session!</p>
//               <button
//                 onClick={() => setShowAddCardModal(true)}
//                 style={{ padding: '10px 20px', borderRadius: '10px', background: '#7C3AED', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
//               >
//                 Add First Card
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* Flashcard Box */}
//               <motion.div
//                 onClick={() => setIsFlipped(!isFlipped)}
//                 animate={{ rotateY: isFlipped ? 180 : 0 }}
//                 transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//                 style={{
//                   willChange: 'transform, opacity',
//                   background: '#FFFFFF',
//                   border: '1px solid #CBD5E1',
//                   borderRadius: '24px',
//                   padding: '48px 36px',
//                   minHeight: '280px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   cursor: 'pointer',
//                   perspective: '1000px',
//                   marginBottom: '20px',
//                   boxShadow: '0 10px 30px rgba(124, 58, 237, 0.08)',
//                 }}
//               >
//                 <div style={{
//                   textAlign: 'center',
//                   color: '#0F172A',
//                   fontSize: '1.25rem',
//                   lineHeight: 1.6,
//                   transform: isFlipped ? 'rotateY(180deg)' : 'none',
//                   width: '100%',
//                 }}>
//                   <div style={{
//                     fontSize: '0.75rem', fontWeight: 700, color: isFlipped ? '#7C3AED' : '#2563EB',
//                     marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em',
//                     background: isFlipped ? '#F3E8FF' : '#EFF6FF', display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
//                   }}>
//                     {isFlipped ? 'Answer' : 'Question'}
//                   </div>
//                   <div style={{ fontWeight: 500 }}>
//                     {isFlipped ? selectedDeck.cards[currentCardIndex].back : selectedDeck.cards[currentCardIndex].front}
//                   </div>
//                 </div>
//               </motion.div>

//               <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '28px', fontWeight: 500 }}>
//                 💡 Click anywhere on the card to {isFlipped ? 'see question' : 'reveal answer'}
//               </p>

//               {/* Rating Buttons */}
//               <AnimatePresence>
//                 {isFlipped && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     style={{ willChange: 'transform, opacity', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
//                   >
//                     {[
//                       { label: 'Again', color: '#EF4444', bg: '#FEF2F2', value: 0 },
//                       { label: 'Hard', color: '#F59E0B', bg: '#FEF3C7', value: 1 },
//                       { label: 'Good', color: '#10B981', bg: '#ECFDF5', value: 2 },
//                       { label: 'Easy', color: '#2563EB', bg: '#EFF6FF', value: 3 },
//                     ].map(r => (
//                       <motion.button
//                         key={r.label}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleRateCard(r.value)}
//                         style={{
//                           padding: '12px 24px', borderRadius: '12px', border: `1px solid ${r.color}30`,
//                           background: r.bg, color: r.color,
//                           fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
//                           boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
//                         }}
//                       >
//                         {r.label}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </>
//           )}
//         </div>
//       ) : (
//         // Deck Grid View
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//           {decks.length === 0 ? (
//             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🃏</div>
//               <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Flashcard Decks Yet</h3>
//               <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 20px' }}>Create your first deck to start testing your knowledge with spaced repetition!</p>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 style={{ padding: '12px 24px', borderRadius: '12px', background: '#7C3AED', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
//               >
//                 Create New Deck
//               </button>
//             </div>
//           ) : (
//             decks.map(deck => (
//               <motion.div
//                 key={deck.id}
//                 whileHover={{ y: -4 }}
//                 onClick={() => loadDeck(deck.id)}
//                 style={{
//                   willChange: 'transform, opacity',
//                   background: '#FFFFFF',
//                   border: '1px solid #E2E8F0',
//                   borderRadius: '20px',
//                   padding: '24px',
//                   cursor: 'pointer',
//                   boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   //justify: 'space-between',
//                   transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.borderColor = '#C084FC'
//                   e.currentTarget.style.boxShadow = '0 10px 24px rgba(124, 58, 237, 0.08)'
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.borderColor = '#E2E8F0'
//                   e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
//                 }}
//               >
//                 <div>
//                   <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
//                     {deck.title}
//                   </h3>
//                   <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px', lineHeight: 1.5 }}>
//                     {deck.description || 'No description provided'}
//                   </p>
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
//                   <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
//                     📚 {(deck as unknown as { card_count?: number }).card_count ?? 0} cards
//                   </span>
//                   <span style={{
//                     padding: '4px 10px', borderRadius: '12px',
//                     background: deck.is_public ? '#ECFDF5' : '#F8FAFC',
//                     color: deck.is_public ? '#059669' : '#64748B',
//                     fontSize: '0.75rem', fontWeight: 700,
//                     border: `1px solid ${deck.is_public ? '#A7F3D0' : '#E2E8F0'}`,
//                   }}>
//                     {deck.is_public ? 'Public' : 'Private'}
//                   </span>
//                 </div>
//               </motion.div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Create Deck Modal */}
//       <AnimatePresence>
//         {showCreateModal && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{
//               willChange: 'transform, opacity',
//               position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
//               backdropFilter: 'blur(4px)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               zIndex: 100, padding: '20px',
//             }}
//             onClick={() => setShowCreateModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 willChange: 'transform, opacity',
//                 background: '#FFFFFF', border: '1px solid #E2E8F0',
//                 borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '460px',
//                 boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
//               }}
//             >
//               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
//                 New Flashcard Deck 🃏
//               </h2>

//               <div style={{ marginBottom: '18px' }}>
//                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
//                   Deck Title *
//                 </label>
//                 <input
//                   value={deckTitle}
//                   onChange={(e) => setDeckTitle(e.target.value)}
//                   placeholder="e.g., Organic Chemistry Formulas"
//                   style={{
//                     width: '100%', padding: '12px 16px', borderRadius: '12px',
//                     background: '#F8FAFC', border: '1px solid #CBD5E1',
//                     color: '#0F172A', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
//                   Description (optional)
//                 </label>
//                 <textarea
//                   value={deckDesc}
//                   onChange={(e) => setDeckDesc(e.target.value)}
//                   placeholder="What is this deck about?"
//                   rows={3}
//                   style={{
//                     width: '100%', padding: '12px 16px', borderRadius: '12px',
//                     background: '#F8FAFC', border: '1px solid #CBD5E1',
//                     color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
//                     fontFamily: 'var(--font-body)', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'flex', gap: '12px' }}>
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   style={{
//                     flex: 1, padding: '14px', borderRadius: '12px',
//                     background: '#F1F5F9', border: '1px solid #CBD5E1',
//                     color: '#475569', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <motion.button
//                   whileHover={{ scale: deckTitle.trim() ? 1.02 : 1 }}
//                   whileTap={{ scale: deckTitle.trim() ? 0.98 : 1 }}
//                   onClick={handleCreateDeck}
//                   disabled={!deckTitle.trim()}
//                   style={{
//                     flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
//                     background: deckTitle.trim() ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#E2E8F0',
//                     color: deckTitle.trim() ? '#FFFFFF' : '#94A3B8',
//                     fontSize: '0.92rem', fontWeight: 700, cursor: deckTitle.trim() ? 'pointer' : 'default',
//                     boxShadow: deckTitle.trim() ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
//                   }}
//                 >
//                   Create Deck
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Card Modal */}
//       <AnimatePresence>
//         {showAddCardModal && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{
//               willChange: 'transform, opacity',
//               position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
//               backdropFilter: 'blur(4px)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               zIndex: 100, padding: '20px',
//             }}
//             onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 willChange: 'transform, opacity',
//                 background: '#FFFFFF', border: '1px solid #E2E8F0',
//                 borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '460px',
//                 boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
//               }}
//             >
//               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
//                 Add Flashcard 📝
//               </h2>

//               <div style={{ marginBottom: '18px' }}>
//                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
//                   Front (Question / Prompt) *
//                 </label>
//                 <textarea
//                   value={cardFront}
//                   onChange={(e) => setCardFront(e.target.value)}
//                   placeholder="What is the powerhouse of the cell?"
//                   rows={3}
//                   style={{
//                     width: '100%', padding: '12px 16px', borderRadius: '12px',
//                     background: '#F8FAFC', border: '1px solid #CBD5E1',
//                     color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
//                     fontFamily: 'var(--font-body)', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
//                   Back (Answer) *
//                 </label>
//                 <textarea
//                   value={cardBack}
//                   onChange={(e) => setCardBack(e.target.value)}
//                   placeholder="Mitochondria"
//                   rows={3}
//                   style={{
//                     width: '100%', padding: '12px 16px', borderRadius: '12px',
//                     background: '#F8FAFC', border: '1px solid #CBD5E1',
//                     color: '#0F172A', fontSize: '0.92rem', outline: 'none', resize: 'vertical',
//                     fontFamily: 'var(--font-body)', boxSizing: 'border-box',
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'flex', gap: '12px' }}>
//                 <button
//                   onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
//                   style={{
//                     flex: 1, padding: '14px', borderRadius: '12px',
//                     background: '#F1F5F9', border: '1px solid #CBD5E1',
//                     color: '#475569', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <motion.button
//                   whileHover={{ scale: cardFront.trim() && cardBack.trim() ? 1.02 : 1 }}
//                   whileTap={{ scale: cardFront.trim() && cardBack.trim() ? 0.98 : 1 }}
//                   onClick={handleAddCard}
//                   disabled={!cardFront.trim() || !cardBack.trim()}
//                   style={{
//                     flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
//                     background: cardFront.trim() && cardBack.trim() ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#E2E8F0',
//                     color: cardFront.trim() && cardBack.trim() ? '#FFFFFF' : '#94A3B8',
//                     fontSize: '0.92rem', fontWeight: 700, cursor: cardFront.trim() && cardBack.trim() ? 'pointer' : 'default',
//                     boxShadow: cardFront.trim() && cardBack.trim() ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
//                   }}
//                 >
//                   Add Card
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as flashcardsService from '@/services/flashcards.service'
import type { FlashcardDeck, Flashcard } from '@/types/database.types'

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [selectedDeck, setSelectedDeck] = useState<{ deck: FlashcardDeck; cards: Flashcard[] } | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)

  // Loading & Submission States to prevent freezing
  const [isSubmittingDeck, setIsSubmittingDeck] = useState(false)
  const [isSubmittingCard, setIsSubmittingCard] = useState(false)

  // Form states
  const [deckTitle, setDeckTitle] = useState('')
  const [deckDesc, setDeckDesc] = useState('')
  const [cardFront, setCardFront] = useState('')
  const [cardBack, setCardBack] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await flashcardsService.getDecks()
        if (!cancelled && res.success && res.data) setDecks(res.data)
      } catch (err) {
        console.error('Failed to fetch decks:', err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const loadDecks = async () => {
    try {
      const res = await flashcardsService.getDecks()
      if (res.success && res.data) setDecks(res.data)
    } catch (err) {
      console.error('Failed to reload decks:', err)
    }
  }

  const loadDeck = async (id: string) => {
    try {
      const res = await flashcardsService.getDeck(id)
      if (res.success && res.data) {
        setSelectedDeck({ deck: res.data, cards: res.data.cards ?? [] })
        setCurrentCardIndex(0)
        setIsFlipped(false)
      }
    } catch (err) {
      console.error('Failed to load deck details:', err)
    }
  }

  const handleCreateDeck = async () => {
    if (!deckTitle.trim() || isSubmittingDeck) return
    setIsSubmittingDeck(true)
    try {
      const res = await flashcardsService.createDeck(deckTitle.trim(), deckDesc.trim(), null, true)
      if (res && res.success) {
        setShowCreateModal(false)
        setDeckTitle('')
        setDeckDesc('')
        await loadDecks()
      } else {
        alert('Failed to create deck. Please check your Supabase connection or permissions.')
      }
    } catch (err) {
      console.error('Error creating deck:', err)
      alert('An unexpected error occurred while creating the deck.')
    } finally {
      setIsSubmittingDeck(false)
    }
  }

  const handleAddCard = async () => {
    if (!selectedDeck || !cardFront.trim() || !cardBack.trim() || isSubmittingCard) return
    setIsSubmittingCard(true)
    try {
      const res = await flashcardsService.addCard(
        selectedDeck.deck.id,
        cardFront.trim(),
        cardBack.trim(),
        selectedDeck.cards.length
      )
      if (res && res.success) {
        await loadDeck(selectedDeck.deck.id)
        setShowAddCardModal(false)
        setCardFront('')
        setCardBack('')
      } else {
        alert('Failed to add card. Please check your inputs or permissions.')
      }
    } catch (err) {
      console.error('Error adding card:', err)
      alert('An unexpected error occurred while adding the card.')
    } finally {
      setIsSubmittingCard(false)
    }
  }

  const handleRateCard = async (rating: number) => {
    if (!selectedDeck) return
    try {
      const card = selectedDeck.cards[currentCardIndex]
      await flashcardsService.updateCardProgress(card.id, rating)
      if (currentCardIndex < selectedDeck.cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1)
        setIsFlipped(false)
      }
    } catch (err) {
      console.error('Error updating card progress:', err)
    }
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
            background: '#F3E8FF',
            border: '1px solid #E9D5FF',
            color: '#7C3AED',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <span>🃏</span> Active Recall & Revision
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Flashcards
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Create custom decks, flip through cards, and master your subjects</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {selectedDeck && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddCardModal(true)}
              style={{
                padding: '12px 20px', borderRadius: '14px', border: 'none',
                background: '#F3E8FF', color: '#7C3AED',
                fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              + Add Card
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 22px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
            }}
          >
            + New Deck
          </motion.button>
        </div>
      </div>

      {selectedDeck ? (
        // Study Mode View
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <button
            onClick={() => setSelectedDeck(null)}
            style={{
              background: 'none', border: 'none', color: '#2563EB',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', padding: 0,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span>←</span> Back to Decks
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedDeck.deck.title}</h2>
            <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
              Card {currentCardIndex + 1} of {selectedDeck.cards.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '10px', marginBottom: '28px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '10px', transition: 'width 0.3s ease',
              width: selectedDeck.cards.length > 0 ? `${((currentCardIndex + 1) / selectedDeck.cards.length) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
            }} />
          </div>

          {selectedDeck.cards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Cards in This Deck</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>Add some flashcards to start your study session!</p>
              <button
                onClick={() => setShowAddCardModal(true)}
                style={{ padding: '10px 20px', borderRadius: '10px', background: '#7C3AED', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Add First Card
              </button>
            </div>
          ) : (
            <>
              {/* Flashcard Box */}
              <motion.div
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '24px',
                  padding: '48px 36px',
                  minHeight: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  perspective: '1000px',
                  marginBottom: '20px',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.08)',
                }}
              >
                <div style={{
                  textAlign: 'center',
                  color: '#0F172A',
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                  width: '100%',
                }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 700, color: isFlipped ? '#7C3AED' : '#2563EB',
                    marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: isFlipped ? '#F3E8FF' : '#EFF6FF', display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                  }}>
                    {isFlipped ? 'Answer' : 'Question'}
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    {isFlipped ? selectedDeck.cards[currentCardIndex].back : selectedDeck.cards[currentCardIndex].front}
                  </div>
                </div>
              </motion.div>

              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '28px', fontWeight: 500 }}>
                💡 Click anywhere on the card to {isFlipped ? 'see question' : 'reveal answer'}
              </p>

              {/* Rating Buttons */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
                  >
                    {[
                      { label: 'Again', color: '#EF4444', bg: '#FEF2F2', value: 0 },
                      { label: 'Hard', color: '#F59E0B', bg: '#FEF3C7', value: 1 },
                      { label: 'Good', color: '#10B981', bg: '#ECFDF5', value: 2 },
                      { label: 'Easy', color: '#2563EB', bg: '#EFF6FF', value: 3 },
                    ].map(r => (
                      <motion.button
                        key={r.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRateCard(r.value)}
                        style={{
                          padding: '12px 24px', borderRadius: '12px', border: `1px solid ${r.color}30`,
                          background: r.bg, color: r.color,
                          fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        }}
                      >
                        {r.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ) : (
        // Deck Grid View
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {decks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🃏</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Flashcard Decks Yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 20px' }}>Create your first deck to start testing your knowledge with spaced repetition!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ padding: '12px 24px', borderRadius: '12px', background: '#7C3AED', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Create New Deck
              </button>
            </div>
          ) : (
            decks.map(deck => (
              <motion.div
                key={deck.id}
                whileHover={{ y: -4 }}
                onClick={() => loadDeck(deck.id)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C084FC'
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(124, 58, 237, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
                }}
              >
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {deck.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px', lineHeight: 1.5 }}>
                    {deck.description || 'No description provided'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                    📚 {(deck as unknown as { card_count?: number }).card_count ?? 0} cards
                  </span>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px',
                    background: deck.is_public ? '#ECFDF5' : '#F8FAFC',
                    color: deck.is_public ? '#059669' : '#64748B',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {deck.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Create Deck Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>New Flashcard Deck</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Group your flashcards into a new study topic</p>
              
              <input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="Deck title *"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
              />
              <textarea
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '24px' }}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: deckTitle.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: deckTitle.trim() ? 0.98 : 1 }}
                  onClick={handleCreateDeck}
                  disabled={!deckTitle.trim() || isSubmittingDeck}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                    background: deckTitle.trim() ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#E2E8F0',
                    color: deckTitle.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: deckTitle.trim() ? 'pointer' : 'default',
                    boxShadow: deckTitle.trim() ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
                  }}
                >
                  {isSubmittingDeck ? 'Creating...' : 'Create Deck'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
            onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Add Flashcard</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Add a question and answer pair to this deck</p>
              
              <textarea
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="Front (question) *"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '12px' }}
              />
              <textarea
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="Back (answer) *"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '24px' }}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: (cardFront.trim() && cardBack.trim()) ? 1.02 : 1 }}
                  whileTap={{ scale: (cardFront.trim() && cardBack.trim()) ? 0.98 : 1 }}
                  onClick={handleAddCard}
                  disabled={!cardFront.trim() || !cardBack.trim() || isSubmittingCard}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                    background: (cardFront.trim() && cardBack.trim()) ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#E2E8F0',
                    color: (cardFront.trim() && cardBack.trim()) ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: (cardFront.trim() && cardBack.trim()) ? 'pointer' : 'default',
                    boxShadow: (cardFront.trim() && cardBack.trim()) ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
                  }}
                >
                  {isSubmittingCard ? 'Adding...' : 'Add Card'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}