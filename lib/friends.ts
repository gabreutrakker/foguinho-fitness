// Friends management utilities
import type { User } from "./auth"

export interface Friend {
  id: string
  usuarioId: string
  amigoId: string
  status: "pendente" | "aceito" | "recusado"
  dataSolicitacao: string
}

// Get all users (for searching friends)
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersStr = localStorage.getItem("foguinho_users")
  if (!usersStr) return []

  return JSON.parse(usersStr)
}

// Get user by id
export function getUserById(userId: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.id === userId) || null
}

// Get all friend relationships for user
export function getFriendships(userId: string): Friend[] {
  if (typeof window === "undefined") return []

  const friendsStr = localStorage.getItem("foguinho_friends")
  if (!friendsStr) return []

  const friends: Friend[] = JSON.parse(friendsStr)
  return friends.filter((f) => f.usuarioId === userId || f.amigoId === userId)
}

// Get accepted friends
export function getAcceptedFriends(userId: string): User[] {
  const friendships = getFriendships(userId).filter((f) => f.status === "aceito")

  const friendIds = friendships.map((f) => (f.usuarioId === userId ? f.amigoId : f.usuarioId))

  return friendIds.map((id) => getUserById(id)).filter((u) => u !== null) as User[]
}

// Get pending friend requests (received)
export function getPendingRequests(userId: string): Array<Friend & { user: User }> {
  const friendships = getFriendships(userId).filter((f) => f.amigoId === userId && f.status === "pendente")

  return friendships
    .map((f) => {
      const user = getUserById(f.usuarioId)
      return user ? { ...f, user } : null
    })
    .filter((f) => f !== null) as Array<Friend & { user: User }>
}

// Get sent friend requests
export function getSentRequests(userId: string): Array<Friend & { user: User }> {
  const friendships = getFriendships(userId).filter((f) => f.usuarioId === userId && f.status === "pendente")

  return friendships
    .map((f) => {
      const user = getUserById(f.amigoId)
      return user ? { ...f, user } : null
    })
    .filter((f) => f !== null) as Array<Friend & { user: User }>
}

// Send friend request
export function sendFriendRequest(userId: string, amigoId: string): { success: boolean; error?: string } {
  if (userId === amigoId) {
    return { success: false, error: "Você não pode adicionar a si mesmo" }
  }

  const friendsStr = localStorage.getItem("foguinho_friends")
  const friends: Friend[] = friendsStr ? JSON.parse(friendsStr) : []

  // Check if friendship already exists
  const existing = friends.find(
    (f) => (f.usuarioId === userId && f.amigoId === amigoId) || (f.usuarioId === amigoId && f.amigoId === userId),
  )

  if (existing) {
    return { success: false, error: "Solicitação já existe" }
  }

  const newFriend: Friend = {
    id: Date.now().toString(),
    usuarioId: userId,
    amigoId,
    status: "pendente",
    dataSolicitacao: new Date().toISOString(),
  }

  friends.push(newFriend)
  localStorage.setItem("foguinho_friends", JSON.stringify(friends))

  return { success: true }
}

// Accept friend request
export function acceptFriendRequest(friendshipId: string): boolean {
  const friendsStr = localStorage.getItem("foguinho_friends")
  if (!friendsStr) return false

  const friends: Friend[] = JSON.parse(friendsStr)
  const friendship = friends.find((f) => f.id === friendshipId)

  if (!friendship) return false

  friendship.status = "aceito"
  localStorage.setItem("foguinho_friends", JSON.stringify(friends))

  return true
}

// Reject friend request
export function rejectFriendRequest(friendshipId: string): boolean {
  const friendsStr = localStorage.getItem("foguinho_friends")
  if (!friendsStr) return false

  const friends: Friend[] = JSON.parse(friendsStr)
  const filteredFriends = friends.filter((f) => f.id !== friendshipId)

  localStorage.setItem("foguinho_friends", JSON.stringify(filteredFriends))

  return true
}

// Remove friend
export function removeFriend(userId: string, friendId: string): boolean {
  const friendsStr = localStorage.getItem("foguinho_friends")
  if (!friendsStr) return false

  const friends: Friend[] = JSON.parse(friendsStr)
  const filteredFriends = friends.filter(
    (f) => !((f.usuarioId === userId && f.amigoId === friendId) || (f.usuarioId === friendId && f.amigoId === userId)),
  )

  localStorage.setItem("foguinho_friends", JSON.stringify(filteredFriends))

  return true
}

// Get friend's daily progress percentage
export function getFriendProgress(friendId: string): number {
  const { getDailyCompletionPercentage } = require("./progress")
  return getDailyCompletionPercentage(friendId)
}
