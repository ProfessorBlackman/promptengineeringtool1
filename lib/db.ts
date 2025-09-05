import type {Timestamp} from "firebase/firestore"
import {firestore} from "@/lib/firebase";

// Prompt type stored in Firestore
export type PromptDoc = {
    title: string
    content: string
    description?: string
    category: string
    tags: string[]
    parameters: Array<{
        name: string
        type: "text" | "number" | "select"
        defaultValue: string
        options?: string[]
        description?: string
    }>
    constraints: Array<{
        type: "length" | "format" | "content" | "style"
        value: string
        description: string
    }>
    createdAt: Date | Timestamp
    updatedAt: Date | Timestamp
    metadata?: Record<string, unknown>
}

export async function addPrompt(uid: string, data: Omit<PromptDoc, "createdAt" | "updatedAt">) {
    const {collection, addDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "prompts")
    const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return docRef.id
}

export async function updatePrompt(uid: string, id: string, data: Partial<PromptDoc>) {
    const {doc, updateDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = doc(firestore, "users", uid, "prompts", id)
    await updateDoc(ref, {...data, updatedAt: serverTimestamp()})
}

export async function deletePrompt(uid: string, id: string) {
    const {doc, deleteDoc} = await import("firebase/firestore")
    await deleteDoc(doc(firestore, "users", uid, "prompts", id))
}

export async function listPrompts(uid: string) {
    const {collection, getDocs, orderBy, query} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "prompts")
    const q = query(ref, orderBy("updatedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({id: d.id, ...(d.data() as PromptDoc)}))
}

// User preferences
export type UserPreferences = {
    theme?: "light" | "dark" | "system"
    defaultModel?: string
    [key: string]: unknown
}

export async function getPreferences(uid: string): Promise<UserPreferences | null> {
    const {doc, getDoc} = await import("firebase/firestore")
    const ref = doc(firestore, "users", uid)
    const snap = await getDoc(ref)
    return snap.exists() ? ((snap.data().preferences as UserPreferences) ?? {}) : null
}

export async function setPreferences(uid: string, prefs: UserPreferences) {
    const {doc, setDoc} = await import("firebase/firestore")
    const ref = doc(firestore, "users", uid)
    await setDoc(ref, {preferences: prefs}, {merge: true})
}

// LLM type stored in Firestore
export type LLMDoc = {
    name: string
    provider: string
    description: string
    modelId: string
    endpoint?: string
    apiUrl: string
    capabilities: string[]
    strengths: string[]
    isPublic: boolean
    createdAt: Date | Timestamp
    updatedAt: Date | Timestamp
}

// API Key type stored in Firestore
export type APIKeyDoc = {
    name: string
    provider: string
    keyValue: string
    description?: string
    isActive: boolean
    createdAt: Date | Timestamp
    updatedAt: Date | Timestamp
}

// LLM functions
export async function addLLM(uid: string, data: Omit<LLMDoc, "createdAt" | "updatedAt">) {
    const {collection, addDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "llms")
    const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return docRef.id
}

export async function updateLLM(uid: string, id: string, data: Partial<LLMDoc>) {
    const {doc, updateDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = doc(firestore, "users", uid, "llms", id)
    await updateDoc(ref, {...data, updatedAt: serverTimestamp()})
}

export async function deleteLLM(uid: string, id: string) {
    const {doc, deleteDoc} = await import("firebase/firestore")
    await deleteDoc(doc(firestore, "users", uid, "llms", id))
}

export async function listLLMs(uid: string) {
    const {collection, getDocs, orderBy, query} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "llms")
    const q = query(ref, orderBy("updatedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({id: d.id, ...(d.data() as LLMDoc)}))
}

export async function listPublicLLMs() {
    const {collection, getDocs, orderBy, query, where} = await import("firebase/firestore")
    const ref = collection(firestore, "public_llms")
    const q = query(ref, where("isPublic", "==", true), orderBy("updatedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({id: d.id, ...(d.data() as LLMDoc)}))
}

// API Key functions
export async function addAPIKey(uid: string, data: Omit<APIKeyDoc, "createdAt" | "updatedAt">) {
    const {collection, addDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "api_keys")
    const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return docRef.id
}

export async function updateAPIKey(uid: string, id: string, data: Partial<APIKeyDoc>) {
    const {doc, updateDoc, serverTimestamp} = await import("firebase/firestore")
    const ref = doc(firestore, "users", uid, "api_keys", id)
    await updateDoc(ref, {...data, updatedAt: serverTimestamp()})
}

export async function deleteAPIKey(uid: string, id: string) {
    const {doc, deleteDoc} = await import("firebase/firestore")
    await deleteDoc(doc(firestore, "users", uid, "api_keys", id))
}

export async function listAPIKeys(uid: string) {
    const {collection, getDocs, orderBy, query} = await import("firebase/firestore")
    const ref = collection(firestore, "users", uid, "api_keys")
    const q = query(ref, orderBy("updatedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({id: d.id, ...(d.data() as APIKeyDoc)}))
}
