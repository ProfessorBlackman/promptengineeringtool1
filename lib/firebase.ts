import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getMessaging, isSupported } from "firebase/messaging"
import {getFunctions} from "firebase/functions";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Check if we're using demo configuration
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY

if (isDemoMode) {
  console.warn("⚠️ Using demo Firebase configuration. Set up your Firebase environment variables for production.")
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const firebaseAuth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Initialize messaging only on client side and if supported
export const getMessagingInstance = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getMessaging(app)
  }
  return null
}

export { isDemoMode }
export default app
