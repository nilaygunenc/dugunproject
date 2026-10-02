import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

export type Post = {
  id: string
  guest_name: string
  message: string | null
  media_urls: string[]
  media_types: string[]
  likes: number
  created_at: Date
}

type PostInput = Omit<Post, 'id' | 'created_at'>

const POSTS_COLLECTION = 'posts'

/**
 * Yeni post oluştur
 */
export async function createPost(data: PostInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...data,
      created_at: Timestamp.now(),
    })
    console.log('✅ Post oluşturuldu:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('❌ Post oluşturma hatası:', error)
    throw error
  }
}

/**
 * Tüm postları getir
 */
export async function getPosts(limitCount: number = 100): Promise<Post[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const posts: Post[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        guest_name: data.guest_name,
        message: data.message,
        media_urls: data.media_urls,
        media_types: data.media_types,
        likes: data.likes,
        created_at: data.created_at.toDate(),
      })
    })

    return posts
  } catch (error) {
    console.error('❌ Post getirme hatası:', error)
    throw error
  }
}

/**
 * Post beğen
 */
export async function likePost(postId: string, currentLikes: number): Promise<void> {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId)
    await updateDoc(postRef, {
      likes: currentLikes + 1,
    })
    console.log('✅ Post beğenildi:', postId)
  } catch (error) {
    console.error('❌ Beğeni hatası:', error)
    throw error
  }
}

/**
 * Post sil (Admin)
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId))
    console.log('✅ Post silindi:', postId)
  } catch (error) {
    console.error('❌ Silme hatası:', error)
    throw error
  }
}

/**
 * Real-time post dinleyici
 */
export function subscribeToPost(
  callback: (posts: Post[]) => void,
  limitCount: number = 100
): () => void {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy('created_at', 'desc'),
    limit(limitCount)
  )

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const posts: Post[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      posts.push({
        id: doc.id,
        guest_name: data.guest_name,
        message: data.message,
        media_urls: data.media_urls,
        media_types: data.media_types,
        likes: data.likes,
        created_at: data.created_at.toDate(),
      })
    })

    callback(posts)
  })

  return unsubscribe
}
