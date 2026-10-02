'use client'

import { useState, useEffect } from 'react'
import { subscribeToPost, type Post } from '@/lib/firestore'
import { motion, AnimatePresence } from 'framer-motion'

export default function LiveSlideshow({ dict }: { dict: any }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Subscribe to real-time Firebase updates
    const unsubscribe = subscribeToPost((updatedPosts) => {
      setPosts(updatedPosts)
      console.log('📡 Real-time güncelleme:', updatedPosts.length, 'post')
    }, 50)

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (posts.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [posts.length])

  if (posts.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D47A1] to-[#1976D2]">
        <div className="relative mb-8">
          <svg className="w-32 h-32 pulse-glow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="20" r="4" fill="#90CAF9" />
            <circle cx="30" cy="40" r="3" fill="#64B5F6" />
            <circle cx="70" cy="40" r="3" fill="#64B5F6" />
            <circle cx="20" cy="70" r="3" fill="#42A5F5" />
            <circle cx="50" cy="60" r="5" fill="#BBDEFB" />
            <circle cx="80" cy="70" r="3" fill="#42A5F5" />
            <line x1="50" y1="20" x2="30" y2="40" stroke="#90CAF9" strokeWidth="1" opacity="0.6" />
            <line x1="50" y1="20" x2="70" y2="40" stroke="#90CAF9" strokeWidth="1" opacity="0.6" />
            <line x1="30" y1="40" x2="50" y2="60" stroke="#64B5F6" strokeWidth="1" opacity="0.6" />
            <line x1="70" y1="40" x2="50" y2="60" stroke="#64B5F6" strokeWidth="1" opacity="0.6" />
            <line x1="50" y1="60" x2="20" y2="70" stroke="#42A5F5" strokeWidth="1" opacity="0.6" />
            <line x1="50" y1="60" x2="80" y2="70" stroke="#42A5F5" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 glow-text">{dict.live.title}</h1>
        <p className="text-2xl text-[#BBDEFB]">{dict.live.waiting}</p>
        <div className="flex gap-3 mt-8">
          <div className="w-3 h-3 bg-[#90CAF9] rounded-full glow animate-pulse"></div>
          <div className="w-3 h-3 bg-[#64B5F6] rounded-full glow animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#42A5F5] rounded-full glow animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    )
  }

  const currentPost = posts[currentIndex]

  return (
    <div className="h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#0D47A1] to-[#1976D2]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="max-w-5xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#BBDEFB]">
            {/* Media */}
            <div className="relative aspect-video bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
              {currentPost.media_types[0]?.startsWith('video') ? (
                <video
                  src={currentPost.media_urls[0]}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentPost.media_urls[0]}
                  alt={`Memory by ${currentPost.guest_name}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* New Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-[#42A5F5] to-[#1976D2] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg glow flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {dict.live.new_memory}
              </div>
            </div>

            {/* Content */}
            <div className="p-10 bg-gradient-to-br from-white to-[#E3F2FD]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#42A5F5] to-[#1976D2] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {currentPost.guest_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0D47A1]">
                    {currentPost.guest_name}
                  </h2>
                  <p className="text-sm text-[#1976D2]">
                    {new Date(currentPost.created_at).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {currentPost.message && (
                <p className="text-2xl text-[#1976D2] mb-6 leading-relaxed">
                  "{currentPost.message}"
                </p>
              )}
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border-2 border-[#BBDEFB]">
                  <svg className="w-7 h-7 text-[#42A5F5]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-2xl font-bold text-[#0D47A1]">{currentPost.likes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {posts.slice(0, 10).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: i === currentIndex % 10 ? 1.2 : 0.8,
                  opacity: i === currentIndex % 10 ? 1 : 0.5
                }}
                className={`h-3 rounded-full transition-all ${
                  i === currentIndex % 10
                    ? 'w-12 bg-white glow'
                    : 'w-3 bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
