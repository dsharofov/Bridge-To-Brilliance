// 'use client'

// import { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import * as studyService from '@/services/study.service'
// import type { UserAchievement, Achievement } from '@/types/database.types'

// export default function AchievementsPage() {
//   const [unlocked, setUnlocked] = useState<UserAchievement[]>([])
//   const [all, setAll] = useState<Achievement[]>([])

//   useEffect(() => {
//     Promise.all([studyService.getAchievements(), studyService.getAllAchievements()]).then(([uRes, aRes]) => {
//       if (uRes.success && uRes.data) setUnlocked(uRes.data)
//       if (aRes.success && aRes.data) setAll(aRes.data)
//     })
//   }, [])

//   const unlockedIds = new Set(unlocked.map(u => u.achievement_id))
//   const unlockedCount = unlocked.length
//   const totalCount = all.length
//   const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

//   const categories = Array.from(new Set(all.map(a => a.category)))

//   return (
//     <div>
//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1A1A2E', marginBottom: '4px' }}>
//           Achievements 🏆
//         </h1>
//         <p style={{ color: 'rgba(0,0,0,0.5)' }}>Track your milestones and accomplishments</p>
//       </div>

//       {/* Progress Overview */}
//       <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px' }}>
//         <div style={{ position: 'relative', width: '100px', height: '100px' }}>
//           <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
//             <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
//             <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB300" strokeWidth="8" strokeLinecap="round" strokeDasharray={251.2} strokeDashoffset={251.2 - (percentage / 100) * 251.2} />
//           </svg>
//           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A2E' }}>{percentage}%</span>
//           </div>
//         </div>
//         <div>
//           <h2 style={{ fontSize: '1.3rem', color: '#1A1A2E', marginBottom: '4px' }}>{unlockedCount} of {totalCount} Unlocked</h2>
//           <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.9rem' }}>Keep studying to unlock more achievements!</p>
//         </div>
//       </div>

//       {/* Category Sections */}
//       {categories.map(category => {
//         const categoryAchievements = all.filter(a => a.category === category)
//         return (
//           <div key={category} style={{ marginBottom: '32px' }}>
//             <h3 style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
//               {category.replace('_', ' ')}
//             </h3>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
//               {categoryAchievements.map(achievement => {
//                 const isUnlocked = unlockedIds.has(achievement.id)
//                 const userAch = unlocked.find(u => u.achievement_id === achievement.id)
//                 return (
//                   <motion.div
//                     key={achievement.id}
//                     whileHover={{ y: -4 }}
//                       style={{ willChange: 'transform, opacity',
//                       background: isUnlocked ? 'rgba(255, 179, 0, 0.05)' : 'rgba(0,0,0,0.02)',
//                       border: `1px solid ${isUnlocked ? 'rgba(255, 179, 0, 0.2)' : 'rgba(0,0,0,0.06)'}`,
//                       borderRadius: '16px', padding: '20px',
//                       opacity: isUnlocked ? 1 : 0.5,
//                     }}
//                   >
//                     <div style={{ willChange: 'transform, opacity',  display: 'flex', gap: '16px', alignItems: 'center' }}>
//                       <div style={{
//                         width: '56px', height: '56px', borderRadius: '14px',
//                         background: isUnlocked ? 'rgba(255, 179, 0, 0.15)' : 'rgba(0,0,0,0.03)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: '1.8rem',
//                         filter: isUnlocked ? 'none' : 'grayscale(1)',
//                       }}>
//                         {achievement.icon}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <h4 style={{ fontSize: '1rem', color: isUnlocked ? '#FFB300' : 'rgba(0,0,0,0.5)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                           {achievement.name}
//                           {isUnlocked && <span style={{ fontSize: '0.7rem' }}>✅</span>}
//                         </h4>
//                         <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginBottom: '4px' }}>
//                           {achievement.description}
//                         </p>
//                         {userAch && (
//                           <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.3)' }}>
//                             Unlocked {new Date(userAch.unlocked_at).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as studyService from '@/services/study.service'
import type { UserAchievement, Achievement } from '@/types/database.types'

export default function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([])
  const [all, setAll] = useState<Achievement[]>([])

  useEffect(() => {
    Promise.all([studyService.getAchievements(), studyService.getAllAchievements()]).then(([uRes, aRes]) => {
      if (uRes.success && uRes.data) setUnlocked(uRes.data)
      if (aRes.success && aRes.data) setAll(aRes.data)
    })
  }, [])

  const unlockedIds = new Set(unlocked.map(u => u.achievement_id))
  const unlockedCount = unlocked.length
  const totalCount = all.length
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const categories = Array.from(new Set(all.map(a => a.category)))

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
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
          marginBottom: '12px',
        }}>
          <span>🏆</span> Milestones & Rewards
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '6px',
        }}>
          Your Achievements
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>
          Track your study goals, unlock badges, and showcase your learning accomplishments.
        </p>
      </div>

      {/* Progress Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.05)',
          flexWrap: 'wrap',
        }}
      >
        {/* Radial Progress Circle */}
        <div style={{ position: 'relative', width: '108px', height: '108px', flexShrink: 0 }}>
          <svg width="108" height="108" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="54" cy="54" r="44" fill="none" stroke="#F1F5F9" strokeWidth="10" />
            <circle
              cx="54"
              cy="54"
              r="44"
              fill="none"
              stroke="url(#blueGoldGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={276.4}
              strokeDashoffset={276.4 - (percentage / 100) * 276.4}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <defs>
              <linearGradient id="blueGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{percentage}%</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>Done</span>
          </div>
        </div>

        {/* Overview Stats Details */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {unlockedCount} of {totalCount} Badges Unlocked
            </h2>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            {percentage === 100 
              ? '🎉 Outstanding! You have completed all study achievements!' 
              : 'Keep completing focus sessions, quizzes, and notes to unlock the rest!'}
          </p>

          {/* Quick Progress Bar */}
          <div style={{ width: '100%', height: '8px', borderRadius: '10px', background: '#F1F5F9', overflow: 'hidden' }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #F59E0B 100%)',
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </motion.div>

      {/* Category Sections */}
      {categories.map((category, catIdx) => {
        const categoryAchievements = all.filter(a => a.category === category)
        const categoryUnlockedCount = categoryAchievements.filter(a => unlockedIds.has(a.id)).length

        return (
          <div key={category} style={{ marginBottom: '36px' }}>
            {/* Category Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '16px', borderRadius: '4px', background: '#2563EB' }} />
                <h3 style={{
                  color: '#1E293B',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}>
                  {category.replace('_', ' ')}
                </h3>
              </div>

              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, background: '#F1F5F9', padding: '3px 10px', borderRadius: '12px' }}>
                {categoryUnlockedCount} / {categoryAchievements.length}
              </span>
            </div>

            {/* Achievement Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {categoryAchievements.map((achievement, i) => {
                const isUnlocked = unlockedIds.has(achievement.id)
                const userAch = unlocked.find(u => u.achievement_id === achievement.id)

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (catIdx * 0.05) + (i * 0.03) }}
                    whileHover={{ y: -4 }}
                    style={{
                      willChange: 'transform, opacity',
                      background: isUnlocked ? 'linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)' : '#FFFFFF',
                      border: `1px solid ${isUnlocked ? '#FCD34D' : '#E2E8F0'}`,
                      borderRadius: '18px',
                      padding: '20px',
                      boxShadow: isUnlocked ? '0 4px 16px rgba(245, 158, 11, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      
                      {/* Icon Circle */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: isUnlocked ? '#FEF3C7' : '#F8FAFC',
                        border: `1px solid ${isUnlocked ? '#FBBF24' : '#E2E8F0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        flexShrink: 0,
                        filter: isUnlocked ? 'none' : 'grayscale(1)',
                        opacity: isUnlocked ? 1 : 0.4,
                      }}>
                        {achievement.icon}
                      </div>

                      {/* Info Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <h4 style={{
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: isUnlocked ? '#92400E' : '#64748B',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}>
                            {achievement.name}
                          </h4>
                          {isUnlocked ? (
                            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>✅</span>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>🔒</span>
                          )}
                        </div>

                        <p style={{
                          fontSize: '0.82rem',
                          color: isUnlocked ? '#78350F' : '#94A3B8',
                          lineHeight: 1.45,
                          margin: '0 0 8px',
                        }}>
                          {achievement.description}
                        </p>

                        {/* Unlocked Date or Locked Tag */}
                        {userAch ? (
                          <span style={{
                            fontSize: '0.72rem',
                            color: '#D97706',
                            fontWeight: 600,
                            background: 'rgba(245, 158, 11, 0.12)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            display: 'inline-block',
                          }}>
                            Unlocked {new Date(userAch.unlocked_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.72rem',
                            color: '#94A3B8',
                            fontWeight: 500,
                            background: '#F1F5F9',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            display: 'inline-block',
                          }}>
                            Locked
                          </span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
