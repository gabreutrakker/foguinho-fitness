import type { User } from "./auth"

export interface FriendRecord {
  id: string
  usuario_id: string
  amigo_id: string
  status: "pendente" | "aceito" | "recusado"
  nome: string
  email: string
  biografia?: string | null
  avatar_url?: string | null
  nivel?: number
  experiencia?: number
  pet_nome?: string
  metas_completadas?: number
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Não foi possível concluir a operação")
  return data
}

export async function getFriendsData(userId: string) {
  return request<{ friends: FriendRecord[]; requests: FriendRecord[]; sent: FriendRecord[] }>(`/api/friends?userId=${encodeURIComponent(userId)}`)
}

export async function searchUsers(userId: string, search: string) {
  const data = await request<{ users: User[] }>(`/api/friends?userId=${encodeURIComponent(userId)}&search=${encodeURIComponent(search)}`)
  return data.users
}

export async function sendFriendRequest(userId: string, friendEmail: string) {
  return request(`/api/friends`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, friendEmail }) })
}

export async function updateFriendRequest(id: string, userId: string, status: "aceito" | "recusado") {
  return request(`/api/friends`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, userId, status }) })
}

export async function removeFriend(friendshipId: string, userId: string) {
  return request(`/api/friends?id=${encodeURIComponent(friendshipId)}&userId=${encodeURIComponent(userId)}`, { method: "DELETE" })
}

export function getAcceptedFriends(_userId: string): User[] { return [] }
export function getPendingRequests(_userId: string): never[] { return [] }
export function getSentRequests(_userId: string): never[] { return [] }
export function getAllUsers(): User[] { return [] }
export function getFriendProgress(_friendId: string): number { return 0 }
export function getUserById(_userId: string): User | null { return null }
export function getFriendships(_userId: string): never[] { return [] }
export function acceptFriendRequest(_id: string): boolean { return false }
export function rejectFriendRequest(_id: string): boolean { return false }

export type Friend = FriendRecord
export type { User }

export function friendRecordToUser(friend: FriendRecord): User {
  return { id: String(friend.amigo_id), nome: friend.nome, email: friend.email, biografia: friend.biografia || "", avatar_url: friend.avatar_url || "", data_criacao: new Date().toISOString() }
}

export async function getFriendProgressAsync(userId: string) {
  const data = await request<{ ranking: Array<{ usuario_id: string; metas_completadas: number }> }>(`/api/ranking?userId=${encodeURIComponent(userId)}`)
  return data.ranking.find((entry) => entry.usuario_id === userId)?.metas_completadas || 0
}
