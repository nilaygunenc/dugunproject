'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { subscribeToPost, likePost, type Post } from '@/lib/firestore'

export default function Gallery({ dict }: { dict: any }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Real-time subscription
    const unsubscribe = subscribeToPost((newPosts) => {
      setPosts(newPosts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLike = async (postId: string, currentLikes: number) => {
    if (likedPosts.has(postId)) return // Already liked
    
    try {
      await likePost(postId, currentLikes)
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ))
      
      setLikedPosts(prev => new Set(prev).add(postId))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#BBDEFB] border-t-[#42A5F5]"></div>
          <div className="absolute inset-0 rounded-full glow"></div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#42A5F5] to-[#1976D2] rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-[#0D47A1]">{dict.gallery.empty}</p>
      </div>
    )
  }

  return (
    <div className="masonry-grid">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="masonry-item"
        >
          <div className="memory-card">
            {/* Media */}
            {post.media_urls.map((url, i) => (
              <div key={i} className="mb-4 overflow-hidden rounded-xl">
                {post.media_types[i]?.startsWith('video') ? (
                  <video
                    src={url}
                    controls
                    className="w-full rounded-xl"
                  />
                ) : (
                  <img
                    src={url}
                    alt={`Memory by ${post.guest_name}`}
                    className="w-full rounded-xl hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            ))}

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#42A5F5] to-[#1976D2] rounded-full flex items-center justify-center text-white font-bold">
                  {post.guest_name.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-[#0D47A1]">{post.guest_name}</p>
              </div>
              
              {post.message && (
                <p className="text-sm text-[#1976D2] leading-relaxed">{post.message}</p>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#BBDEFB]">
                <button
                  onClick={() => handleLike(post.id, post.likes)}
                  disabled={likedPosts.has(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    likedPosts.has(post.id)
                      ? 'bg-[#E3F2FD] text-[#1976D2] cursor-not-allowed'
                      : 'bg-white hover:bg-[#E3F2FD] text-[#42A5F5] hover:text-[#1976D2] border-2 border-[#BBDEFB]'
                  }`}
                >
                  <svg className="w-5 h-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <a
                  href={post.media_urls[0]}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#E3F2FD] text-[#42A5F5] hover:text-[#1976D2] rounded-lg font-semibold transition-all border-2 border-[#BBDEFB]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-sm">{dict.gallery.download}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
