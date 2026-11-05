// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import * as quizzesService from '@/services/quizzes.service'
// import type { Quiz, QuizQuestion } from '@/types/database.types'

// export default function QuizzesPage() {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [activeQuiz, setActiveQuiz] = useState<{ quiz: Quiz; questions: QuizQuestion[] } | null>(null)
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [answers, setAnswers] = useState<Record<string, unknown>>({})
//   const [showResults, setShowResults] = useState(false)
//   const [score, setScore] = useState(0)
//   const [totalPoints, setTotalPoints] = useState(0)

//   useEffect(() => {
//     let cancelled = false
//     const load = async () => {
//       const res = await quizzesService.getQuizzes()
//       if (!cancelled && res.success && res.data) setQuizzes(res.data)
//     }
//     load()
//     return () => { cancelled = true }
//   }, [])

//   const startQuiz = async (id: string) => {
//     const res = await quizzesService.getQuiz(id)
//     if (res.success && res.data) {
//       setActiveQuiz({ quiz: res.data, questions: res.data.questions ?? [] })
//       setCurrentQuestion(0)
//       setAnswers({})
//       setShowResults(false)
//     }
//   }

//   const selectAnswer = (questionId: string, answer: unknown) => {
//     setAnswers(prev => ({ ...prev, [questionId]: answer }))
//   }

//   const submitQuiz = async () => {
//     if (!activeQuiz) return

//     let earnedScore = 0
//     let maxPoints = 0

//     for (const q of activeQuiz.questions) {
//       maxPoints += q.points
//       if (answers[q.id] === q.correct_answer) {
//         earnedScore += q.points
//       }
//     }

//     setScore(earnedScore)
//     setTotalPoints(maxPoints)

//     await quizzesService.submitQuizAttempt(activeQuiz.quiz.id, answers, earnedScore, maxPoints)
//     setShowResults(true)
//   }

//   const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0

//   return (
//     <div>
//       <div style={{ marginBottom: '24px' }}>
//         <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
//           Practice Quizzes 💡
//         </h1>
//         <p style={{ color: 'rgba(0,0,0,0.5)' }}>Test your knowledge with practice quizzes</p>
//       </div>

//       {activeQuiz && !showResults ? (
//         // Quiz Taking Mode
//         <div style={{ maxWidth: '700px', margin: '0 auto' }}>
//           <button
//             onClick={() => setActiveQuiz(null)}
//             style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
//           >
//             ← Back to Quizzes
//           </button>

//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//             <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
//               Question {currentQuestion + 1} of {activeQuiz.questions.length}
//             </span>
//             <span style={{ fontSize: '0.85rem', color: '#FFB300', fontWeight: 600 }}>
//               {activeQuiz.questions[currentQuestion].points} pts
//             </span>
//           </div>

//           <div style={{ height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', marginBottom: '32px' }}>
//             <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #F39C12, #E67E22)', transition: 'width 0.3s', width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }} />
//           </div>

//           <h2 style={{ fontSize: '1.3rem', color: '#1A1A2E', marginBottom: '24px', lineHeight: 1.5 }}>
//             {activeQuiz.questions[currentQuestion].question}
//           </h2>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {activeQuiz.questions[currentQuestion].options?.map((opt: Record<string, unknown>, idx: number) => {
//               const value = String(opt['value'] ?? opt)
//               const label = String(opt['label'] ?? value)
//               const isSelected = answers[activeQuiz.questions[currentQuestion].id] === value
//               return (
//                 <motion.button
//                   key={idx}
//                   onClick={() => selectAnswer(activeQuiz.questions[currentQuestion].id, value)}
//                   whileHover={{ x: 4 }}
//                     style={{ willChange: 'transform, opacity',
//                     padding: '16px 20px', borderRadius: '12px', textAlign: 'left',
//                     background: isSelected ? 'rgba(65, 105, 225, 0.2)' : 'rgba(0,0,0,0.03)',
//                     border: `2px solid ${isSelected ? '#4169E1' : 'rgba(0,0,0,0.08)'}`,
//                     color: '#1A1A2E', fontSize: '1rem', cursor: 'pointer',
//                   }}
//                 >
//                   <span style={{
//                     display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
//                     width: '28px', height: '28px', borderRadius: '50%',
//                     background: isSelected ? '#4169E1' : 'rgba(0,0,0,0.08)',
//                     marginRight: '12px', fontSize: '0.85rem', fontWeight: 600,
//                   }}>
//                     {String.fromCharCode(65 + idx)}
//                   </span>
//                   {label}
//                 </motion.button>
//               )
//             })}
//           </div>

//           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
//             <button
//               onClick={() => setCurrentQuestion(prev => prev - 1)}
//               disabled={currentQuestion === 0}
//               style={{
//                 padding: '12px 24px', borderRadius: '10px',
//                 border: '1px solid rgba(0,0,0,0.08)', background: 'transparent',
//                 color: currentQuestion === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.6)',
//                 fontSize: '0.9rem', cursor: currentQuestion === 0 ? 'default' : 'pointer',
//               }}
//             >
//               Previous
//             </button>
//             {currentQuestion < activeQuiz.questions.length - 1 ? (
//               <button
//                 onClick={() => setCurrentQuestion(prev => prev + 1)}
//                 style={{
//                   padding: '12px 24px', borderRadius: '10px', border: 'none',
//                   background: 'linear-gradient(135deg, #4169E1, #2D4FC8)',
//                   color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
//                 }}
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={submitQuiz}
//                 disabled={Object.keys(answers).length < activeQuiz.questions.length}
//                 style={{
//                   padding: '12px 24px', borderRadius: '10px', border: 'none',
//                   background: Object.keys(answers).length === activeQuiz.questions.length
//                     ? 'linear-gradient(135deg, #27AE60, #1E8449)'
//                     : 'rgba(0,0,0,0.03)',
//                   color: Object.keys(answers).length === activeQuiz.questions.length ? 'white' : 'rgba(0,0,0,0.3)',
//                   fontSize: '0.9rem', fontWeight: 600,
//                   cursor: Object.keys(answers).length === activeQuiz.questions.length ? 'pointer' : 'default',
//                 }}
//               >
//                 Submit Quiz
//               </button>
//             )}
//           </div>
//         </div>
//       ) : activeQuiz && showResults ? (
//         // Results
//         <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//               style={{ willChange: 'transform, opacity',
//               width: '160px', height: '160px', borderRadius: '50%',
//               background: percentage >= 70 ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
//               border: `4px solid ${percentage >= 70 ? '#27AE60' : '#E74C3C'}`,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               margin: '0 auto 24px',
//             }}
//           >
//             <div>
//               <div style={{ fontSize: '3rem', fontWeight: 700, color: percentage >= 70 ? '#27AE60' : '#E74C3C' }}>
//                 {percentage}%
//               </div>
//               <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
//                 {score}/{totalPoints} pts
//               </div>
//             </div>
//           </motion.div>
//           <h2 style={{ color: '#1A1A2E', marginBottom: '8px' }}>
//             {percentage >= 70 ? '🎉 Great Job!' : '📚 Keep Practicing!'}
//           </h2>
//           <p style={{ color: 'rgba(0,0,0,0.5)', marginBottom: '32px' }}>
//             You scored {score} out of {totalPoints} points
//           </p>

//           {/* Review Answers */}
//           <div style={{ textAlign: 'left', marginBottom: '32px' }}>
//             {activeQuiz.questions.map((q) => {
//               const isCorrect = answers[q.id] === q.correct_answer
//               return (
//                 <div key={q.id} style={{ padding: '16px', marginBottom: '12px', borderRadius: '12px', background: '#ffffff', borderLeft: `4px solid ${isCorrect ? '#27AE60' : '#E74C3C'}` }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
//                     <span style={{ fontSize: '1rem' }}>{isCorrect ? '✅' : '❌'}</span>
//                     <span style={{ fontSize: '0.9rem', color: '#1A1A2E', fontWeight: 500 }}>{q.question}</span>
//                   </div>
//                   {!isCorrect && (
//                     <div style={{ fontSize: '0.8rem', color: '#27AE60' }}>
//                       Correct answer: {q.correct_answer}
//                     </div>
//                   )}
//                   {q.explanation && (
//                     <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginTop: '4px' }}>
//                       {q.explanation}
//                     </div>
//                   )}
//                 </div>
//               )
//             })}
//           </div>

//           <button
//             onClick={() => setActiveQuiz(null)}
//             style={{
//               padding: '12px 32px', borderRadius: '10px', border: 'none',
//               background: 'linear-gradient(135deg, #4169E1, #2D4FC8)',
//               color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
//             }}
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       ) : (
//         // Quiz List
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
//           {quizzes.length === 0 ? (
//             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
//               <p style={{ color: 'rgba(0,0,0,0.5)' }}>No quizzes available yet. Check back soon!</p>
//             </div>
//           ) : (
//             quizzes.map(quiz => (
//               <motion.div
//                 key={quiz.id}
//                 whileHover={{ y: -4 }}
//                 style={{ willChange: 'transform, opacity',  background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '24px' }}
//               >
//                 <h3 style={{ willChange: 'transform, opacity',  fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#1A1A2E', marginBottom: '8px' }}>
//                   {quiz.title}
//                 </h3>
//                 <p style={{ willChange: 'transform, opacity',  fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', marginBottom: '16px' }}>
//                   {quiz.description || 'No description'}
//                 </p>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                   <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.3)' }}>
//                     {(quiz as unknown as { question_count?: number }).question_count ?? 0} questions
//                   </span>
//                   {quiz.time_limit_seconds && (
//                     <span style={{ fontSize: '0.8rem', color: '#FFB300' }}>
//                       ⏱️ {Math.round(quiz.time_limit_seconds / 60)} min
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => startQuiz(quiz.id)}
//                   style={{
//                     width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
//                     background: 'linear-gradient(135deg, #F39C12, #E67E22)',
//                     color: '#1A1A2E', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
//                   }}
//                 >
//                   Start Quiz
//                 </button>
//               </motion.div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as quizzesService from '@/services/quizzes.service'
import type { Quiz, QuizQuestion } from '@/types/database.types'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [activeQuiz, setActiveQuiz] = useState<{ quiz: Quiz; questions: QuizQuestion[] } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const res = await quizzesService.getQuizzes()
      if (!cancelled && res.success && res.data) setQuizzes(res.data)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const startQuiz = async (id: string) => {
    const res = await quizzesService.getQuiz(id)
    if (res.success && res.data) {
      setActiveQuiz({ quiz: res.data, questions: res.data.questions ?? [] })
      setCurrentQuestion(0)
      setAnswers({})
      setShowResults(false)
    }
  }

  const selectAnswer = (questionId: string, answer: unknown) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const submitQuiz = async () => {
    if (!activeQuiz) return

    let earnedScore = 0
    let maxPoints = 0

    for (const q of activeQuiz.questions) {
      maxPoints += q.points
      if (answers[q.id] === q.correct_answer) {
        earnedScore += q.points
      }
    }

    setScore(earnedScore)
    setTotalPoints(maxPoints)

    await quizzesService.submitQuizAttempt(activeQuiz.quiz.id, answers, earnedScore, maxPoints)
    setShowResults(true)
  }

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Top Header Section */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          color: '#D97706',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '10px',
        }}>
          <span>💡</span> Knowledge Assessment
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
          Practice Quizzes
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>Test your understanding, review explanations, and track your scores</p>
      </div>

      {activeQuiz && !showResults ? (
        // Quiz Taking Mode
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <button
            onClick={() => setActiveQuiz(null)}
            style={{
              background: 'none', border: 'none', color: '#2563EB',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', padding: 0,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span>←</span> Back to Quizzes
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Question {currentQuestion + 1} of {activeQuiz.questions.length}
            </span>
            <span style={{
              fontSize: '0.82rem', color: '#D97706', fontWeight: 700,
              background: '#FEF3C7', padding: '4px 10px', borderRadius: '10px', border: '1px solid #FDE68A'
            }}>
              ⭐ {activeQuiz.questions[currentQuestion].points} pts
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '10px', marginBottom: '28px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '10px', transition: 'width 0.3s ease',
              width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%`,
              background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
            }} />
          </div>

          <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '24px', lineHeight: 1.5, fontWeight: 700 }}>
            {activeQuiz.questions[currentQuestion].question}
          </h2>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {activeQuiz.questions[currentQuestion].options?.map((opt: Record<string, unknown>, idx: number) => {
              const value = String(opt['value'] ?? opt)
              const label = String(opt['label'] ?? value)
              const isSelected = answers[activeQuiz.questions[currentQuestion].id] === value
              return (
                <motion.button
                  key={idx}
                  onClick={() => selectAnswer(activeQuiz.questions[currentQuestion].id, value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    willChange: 'transform, opacity',
                    padding: '16px 20px', borderRadius: '16px', textAlign: 'left',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: `2px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                    color: '#0F172A', fontSize: '1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                    background: isSelected ? '#2563EB' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    fontSize: '0.85rem', fontWeight: 700,
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ fontWeight: isSelected ? 600 : 500 }}>{label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
              style={{
                padding: '12px 24px', borderRadius: '12px',
                border: '1px solid #CBD5E1', background: '#FFFFFF',
                color: currentQuestion === 0 ? '#94A3B8' : '#475569',
                fontSize: '0.9rem', fontWeight: 600, cursor: currentQuestion === 0 ? 'default' : 'pointer',
              }}
            >
              ← Previous
            </button>

            {currentQuestion < activeQuiz.questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                style={{
                  padding: '12px 28px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                }}
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: Object.keys(answers).length === activeQuiz.questions.length ? 1.02 : 1 }}
                whileTap={{ scale: Object.keys(answers).length === activeQuiz.questions.length ? 0.98 : 1 }}
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < activeQuiz.questions.length}
                style={{
                  padding: '12px 28px', borderRadius: '12px', border: 'none',
                  background: Object.keys(answers).length === activeQuiz.questions.length
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : '#E2E8F0',
                  color: Object.keys(answers).length === activeQuiz.questions.length ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.9rem', fontWeight: 700,
                  cursor: Object.keys(answers).length === activeQuiz.questions.length ? 'pointer' : 'default',
                  boxShadow: Object.keys(answers).length === activeQuiz.questions.length ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
                }}
              >
                Submit Quiz ✓
              </motion.button>
            )}
          </div>
        </div>
      ) : activeQuiz && showResults ? (
        // Results View
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              willChange: 'transform, opacity',
              width: '160px', height: '160px', borderRadius: '50%',
              background: percentage >= 70 ? '#ECFDF5' : '#FEF2F2',
              border: `6px solid ${percentage >= 70 ? '#10B981' : '#EF4444'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: percentage >= 70 ? '#059669' : '#DC2626', lineHeight: 1 }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
              {score}/{totalPoints} pts
            </div>
          </motion.div>

          <h2 style={{ color: '#0F172A', fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            {percentage >= 70 ? '🎉 Fantastic Job!' : '📚 Keep Practicing!'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '32px' }}>
            You successfully earned {score} out of {totalPoints} possible points.
          </p>

          {/* Review Answers */}
          <div style={{ textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Question Review:</h3>
            {activeQuiz.questions.map((q, i) => {
              const isCorrect = answers[q.id] === q.correct_answer
              return (
                <div key={q.id} style={{
                  padding: '20px', borderRadius: '16px', background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderLeft: `5px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{isCorrect ? '✅' : '❌'}</span>
                    <div style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.4 }}>
                      Q{i + 1}. {q.question}
                    </div>
                  </div>

                  {!isCorrect && (
                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginBottom: '6px', background: '#ECFDF5', padding: '6px 10px', borderRadius: '8px', display: 'inline-block' }}>
                      Correct Answer: {q.correct_answer}
                    </div>
                  )}

                  {q.explanation && (
                    <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginTop: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveQuiz(null)}
            style={{
              padding: '14px 36px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            }}
          >
            Back to Quizzes
          </motion.button>
        </div>
      ) : (
        // Quiz Catalog Grid
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {quizzes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>No Practice Quizzes Yet</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto' }}>Check back soon for new quizzes to test your study progress!</p>
            </div>
          ) : (
            quizzes.map(quiz => (
              <motion.div
                key={quiz.id}
                whileHover={{ y: -4 }}
                style={{
                  willChange: 'transform, opacity',
                  background: '#FFFFFF', border: '1px solid #E2E8F0',
                  borderRadius: '20px', padding: '24px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.04)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FCD34D'
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(217, 119, 6, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.04)'
                }}
              >
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px', lineHeight: 1.5 }}>
                    {quiz.description || 'Test your knowledge with this practice assessment'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '14px', fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                    <span>📝 {(quiz as unknown as { question_count?: number }).question_count ?? 0} questions</span>
                    {quiz.time_limit_seconds && (
                      <span style={{ color: '#D97706' }}>
                        ⏱️ {Math.round(quiz.time_limit_seconds / 60)} min
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startQuiz(quiz.id)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                      color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
                    }}
                  >
                    Start Quiz
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}