"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, type User } from "@/lib/auth"
import { getFriendsData, searchUsers, sendFriendRequest, updateFriendRequest, removeFriend, type FriendRecord } from "@/lib/friends"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, UserPlus, Check, X, Trash2 } from "lucide-react"

export default function FriendsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [friends, setFriends] = useState<FriendRecord[]>([])
  const [requests, setRequests] = useState<FriendRecord[]>([])
  const [sent, setSent] = useState<FriendRecord[]>([])
  const [results, setResults] = useState<User[]>([])
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")

  async function load() {
    const user = getCurrentUser(); if (!user) return
    setUserId(user.id)
    try { const data = await getFriendsData(user.id); setFriends(data.friends); setRequests(data.requests); setSent(data.sent) } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao carregar amigos") }
  }
  useEffect(() => { void load() }, [])

  async function search() {
    if (!userId || !query.trim()) return setResults([])
    try { setResults(await searchUsers(userId, query.trim())) } catch (error) { setMessage(error instanceof Error ? error.message : "Erro na busca") }
  }
  async function add(email: string) { try { await sendFriendRequest(userId, email); setMessage("Pedido enviado"); setResults([]); setQuery(""); await load() } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao enviar pedido") } }
  async function respond(id: string, status: "aceito" | "recusado") { await updateFriendRequest(id, userId, status); await load() }
  async function remove(id: string) { await removeFriend(id, userId); await load() }

  return <AuthGuard><div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50"><header className="bg-white border-b-2 border-orange-200"><div className="container mx-auto px-4 py-4 flex items-center gap-3"><Button variant="ghost" onClick={() => router.push("/home")} className="text-orange-600"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button><h1 className="text-2xl font-bold text-orange-600">Amigos</h1></div></header><main className="container mx-auto px-4 py-6 space-y-5">
    <Card className="border-2 border-orange-200"><CardHeader><CardTitle>Encontrar pessoa</CardTitle></CardHeader><CardContent><div className="flex gap-2"><Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) void search() }} placeholder="Nome ou email" /><Button onClick={() => void search()} className="bg-orange-500"><Search className="w-4 h-4" /></Button></div><div className="mt-3 space-y-2">{results.map((person) => <div key={person.id} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 border"><div className="flex min-w-0 items-center gap-3"><div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-orange-100 flex items-center justify-center">{person.avatar_url ? <img src={person.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="font-bold text-orange-600">{person.nome.charAt(0).toUpperCase()}</span>}</div><div className="min-w-0"><p className="font-semibold truncate">{person.nome}</p><p className="text-xs text-gray-500 truncate">{person.email}</p>{person.biografia && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{person.biografia}</p>}</div></div><Button size="sm" className="shrink-0" onClick={() => void add(person.email)}><UserPlus className="w-4 h-4 mr-1" />Enviar</Button></div>)}</div>{message && <p className="text-sm text-orange-700 mt-3" role="status">{message}</p>}</CardContent></Card>
    {requests.length > 0 && <Card className="border-2 border-orange-200"><CardHeader><CardTitle className="flex justify-between">Notificações <Badge>{requests.length}</Badge></CardTitle></CardHeader><CardContent className="space-y-2">{requests.map((request) => <div key={request.id} className="flex items-center justify-between gap-2 border rounded-lg p-3"><div><p className="font-semibold">{request.nome}</p><p className="text-xs text-gray-500">{request.email}</p></div><div className="flex gap-2"><Button size="sm" onClick={() => void respond(request.id, "aceito")} className="bg-green-600"><Check className="w-4 h-4" /></Button><Button size="sm" variant="outline" onClick={() => void respond(request.id, "recusado")}><X className="w-4 h-4" /></Button></div></div>)}</CardContent></Card>}
    <section><h2 className="text-xl font-bold mb-3">Meus amigos ({friends.length})</h2>{friends.length === 0 ? <Card><CardContent className="p-8 text-center text-gray-600">Nenhum amigo aceito ainda.</CardContent></Card> : <div className="grid gap-3">{friends.map((friend) => <Card key={friend.id} className="border-orange-200"><CardContent className="p-4 flex items-center justify-between"><div><p className="font-bold">{friend.nome}</p><p className="text-sm text-gray-500">{friend.email}</p><p className="text-sm text-orange-600">Nível {friend.nivel || 1} · {friend.metas_completadas || 0} metas concluídas</p><p className="text-xs text-gray-500">Pet: {friend.pet_nome || "Pet"}</p></div><Button variant="outline" size="sm" onClick={() => void remove(friend.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Remover</Button></CardContent></Card>)}</div>}</section>
  </main></div></AuthGuard>
}
