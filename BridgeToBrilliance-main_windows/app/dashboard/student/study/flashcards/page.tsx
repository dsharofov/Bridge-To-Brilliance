'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as flashcardsService from '@/services/flashcards.service'
import type { FlashcardDeck, Flashcard } from '@/types/database.types'

// Traditional Colorful Geometric SVG Icons
function IconTraditionalStar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#starGrad)" />
      <defs>
        <linearGradient id="starGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
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

function IconArrowGeo({ size = 16, color = '#2563EB' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconShuffleGeo({ size = 16, color = '#7C3AED' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  )
}

function IconLayersGeo({ size = 18, color = '#0EA5E9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [selectedDeck, setSelectedDeck] = useState<{ deck: FlashcardDeck; cards: Flashcard[] } | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)

  // Loading & Submission states
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
      const res = await flashcardsService.createDeck(deckTitle.trim(), deckDesc.trim(), null, false)
      if (res && res.success) {
        setShowCreateModal(false)
        setDeckTitle('')
        setDeckDesc('')
        await loadDecks()
      } else {
        alert('Failed to create deck.')
      }
    } catch (err) {
      console.error('Error creating deck:', err)
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
        alert('Failed to add card.')
      }
    } catch (err) {
      console.error('Error adding card:', err)
    } finally {
      setIsSubmittingCard(false)
    }
  }

  const handleRateCard = async (rating: number) => {
    if (!selectedDeck || !selectedDeck.cards[currentCardIndex]) return
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

  const handleShuffleCards = () => {
    if (!selectedDeck || selectedDeck.cards.length <= 1) return
    const shuffled = [...selectedDeck.cards].sort(() => Math.random() - 0.5)
    setSelectedDeck({ ...selectedDeck, cards: shuffled })
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const getDeckCardCount = (deck: FlashcardDeck & { cards?: Flashcard[]; card_count?: number }) => {
    if (deck.cards && Array.isArray(deck.cards)) return deck.cards.length
    if (typeof deck.card_count === 'number') return deck.card_count
    return 0
  }

  const currentCard = selectedDeck?.cards[currentCardIndex]

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header Bar */}
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
            <IconTraditionalStar size={16} /> Personal Flashcard Decks
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Flashcards
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Private study decks engineered for rapid mastery.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {selectedDeck && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddCardModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', borderRadius: '0px', border: '1px solid #7C3AED',
                background: '#FAF5FF', color: '#7C3AED',
                fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              <IconPlusGeo size={16} color="#7C3AED" /> Add Card
            </motion.button>
          )}
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
            <IconPlusGeo size={16} color="#FFFFFF" /> New Deck
          </motion.button>
        </div>
      </div>

      {selectedDeck ? (
        /* Traditional Flip Study Mode */
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setSelectedDeck(null)}
              style={{
                background: 'none', border: 'none', color: '#2563EB',
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', padding: 0,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              <IconArrowGeo size={16} color="#2563EB" /> Back to Decks
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShuffleCards}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', background: '#F8FAFC', border: '1px solid #CBD5E1',
                borderRadius: '0px', fontSize: '0.82rem', fontWeight: 700, color: '#7C3AED', cursor: 'pointer',
              }}
            >
              <IconShuffleGeo size={14} color="#7C3AED" /> Shuffle Deck
            </motion.button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
            <h2 style={{ color: '#0F172A', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>{selectedDeck.deck.title}</h2>
            <span style={{ color: '#0EA5E9', fontSize: '0.85rem', fontWeight: 700, background: '#EFF6FF', padding: '4px 10px', border: '1px solid #BFDBFE' }}>
              Card {selectedDeck.cards.length > 0 ? currentCardIndex + 1 : 0} of {selectedDeck.cards.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '0px', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '0px', transition: 'width 0.3s ease',
              width: selectedDeck.cards.length > 0 ? `${((currentCardIndex + 1) / selectedDeck.cards.length) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #0EA5E9 0%, #7C3AED 100%)',
            }} />
          </div>

          {selectedDeck.cards.length === 0 || !currentCard ? (
            <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '20px', border: '2px dashed #CBD5E1' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Empty Deck</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>Add flashcards to begin studying.</p>
              <button
                onClick={() => setShowAddCardModal(true)}
                style={{ padding: '12px 24px', borderRadius: '0px', background: '#7C3AED', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Add First Card
              </button>
            </div>
          ) : (
            <>
              {/* Traditional Flip Flashcard Box */}
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
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
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
                    fontSize: '0.75rem', fontWeight: 700, color: isFlipped ? '#7C3AED' : '#0EA5E9',
                    marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: isFlipped ? '#F3E8FF' : '#EFF6FF', display: 'inline-block', padding: '4px 12px', borderRadius: '0px',
                    border: `1px solid ${isFlipped ? '#E9D5FF' : '#BFDBFE'}`,
                  }}>
                    {isFlipped ? 'Answer' : 'Question'}
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    {isFlipped ? currentCard.back : currentCard.front}
                  </div>
                </div>
              </motion.div>

              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '28px', fontWeight: 500 }}>
                💡 Click anywhere on the card to {isFlipped ? 'see question' : 'reveal answer'}
              </p>

              {/* Rating Buttons (Visible when flipped) */}
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
                          padding: '12px 24px', borderRadius: '0px', border: `1px solid ${r.color}30`,
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
        /* Deck List */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {decks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <IconLayersGeo size={48} color="#0EA5E9" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Study Decks</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 20px' }}>Create your first deck to organize your flashcards!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ padding: '12px 24px', borderRadius: '0px', background: 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Create New Deck
              </button>
            </div>
          ) : (
            decks.map(deck => {
              const cardCount = getDeckCardCount(deck as FlashcardDeck & { cards?: Flashcard[]; card_count?: number })
              return (
                <motion.div
                  key={deck.id}
                  whileHover={{ y: -4 }}
                  onClick={() => loadDeck(deck.id)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(14, 165, 233, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                      {deck.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px', lineHeight: 1.5 }}>
                      {deck.description || 'No description provided'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#0EA5E9', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <IconLayersGeo size={14} color="#0EA5E9" />
                      {cardCount} {cardCount === 1 ? 'card' : 'cards'}
                    </span>
                    <span style={{
                      padding: '4px 10px', borderRadius: '0px',
                      background: '#F0FDF4', color: '#166534',
                      fontSize: '0.75rem', fontWeight: 700,
                      border: '1px solid #BBF7D0',
                    }}>
                      Private
                    </span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {/* Create Deck Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>New Deck</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Create a personal study deck.</p>
              
              <input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="Deck title *"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
              />
              <textarea
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '24px' }}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '0px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: deckTitle.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: deckTitle.trim() ? 0.98 : 1 }}
                  onClick={handleCreateDeck}
                  disabled={!deckTitle.trim() || isSubmittingDeck}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '0px', border: 'none',
                    background: deckTitle.trim() ? 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)' : '#E2E8F0',
                    color: deckTitle.trim() ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: deckTitle.trim() ? 'pointer' : 'default',
                  }}
                >
                  {isSubmittingDeck ? 'Creating...' : 'Create'}
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
            onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Add Flashcard</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Create a flashcard question and answer pair</p>
              
              <textarea
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="Front (question) *"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '12px' }}
              />
              <textarea
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="Back (answer) *"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '0px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', marginBottom: '24px' }}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setShowAddCardModal(false); setCardFront(''); setCardBack('') }}
                  style={{ flex: 1, padding: '12px', borderRadius: '0px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: (cardFront.trim() && cardBack.trim()) ? 1.02 : 1 }}
                  whileTap={{ scale: (cardFront.trim() && cardBack.trim()) ? 0.98 : 1 }}
                  onClick={handleAddCard}
                  disabled={!cardFront.trim() || !cardBack.trim() || isSubmittingCard}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '0px', border: 'none',
                    background: (cardFront.trim() && cardBack.trim()) ? 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)' : '#E2E8F0',
                    color: (cardFront.trim() && cardBack.trim()) ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.9rem', fontWeight: 700, cursor: (cardFront.trim() && cardBack.trim()) ? 'pointer' : 'default',
                  }}
                >
                  {isSubmittingCard ? 'Adding...' : 'Add'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}