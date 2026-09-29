"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { getFriendsData, updateFriendRequest, type FriendRecord } from "@/lib/friends"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, Check, X } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [requests, setRequests] = useState<FriendRecord[]>([])
  const [message, setMessage] = useState("")

  async function load() {
    const user = getCurrentUser()
    if (!user) return
    setUserId(user.id)
    const data = await getFriendsData(user.id)
    setRequests(data.requests)
  }
  useEffect(() => { void load() }, [])

  async function respond(id: string, status: "aceito" | "recusado") {
    try { await updateFriendRequest(id, userId, status); setMessage(status === "aceito" ? "Amizade aceita" : "Pedido recusado"); await load() } catch { setMessage("Não foi possível atualizar o pedido") }
  }

  return <AuthGuard><div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50"><header className="bg-white border-b-2 border-orange-200"><div className="container mx-auto px-4 py-4 flex items-center gap-3"><Button variant="ghost" onClick={() => router.push("/home")} className="text-orange-600"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button><h1 className="text-2xl font-bold text-orange-600">Notificações</h1></div></header><main className="container mx-auto px-4 py-6"><Card className="border-2 border-orange-200"><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-orange-500" />Pedidos de amizade</CardTitle></CardHeader><CardContent className="space-y-3">{requests.length === 0 ? <p className="text-center text-gray-600 py-8">Você não tem novas notificações.</p> : requests.map((request) => <div key={request.id} className="flex items-center justify-between gap-3 border rounded-lg p-3"><div className="flex min-w-0 items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-orange-100 flex items-center justify-center">{request.avatar_url ? <img src={request.avatar_url} alt={`Foto de ${request.nome}`} className="h-full w-full object-cover" /> : <span className="font-bold text-orange-600">{request.nome.charAt(0).toUpperCase()}</span>}</div><div className="min-w-0"><p className="font-semibold truncate">{request.nome}</p><p className="text-xs text-gray-500 truncate">{request.email}</p></div></div><div className="flex gap-2 shrink-0"><Button size="sm" onClick={() => void respond(request.id, "aceito")} className="bg-green-600"><Check className="w-4 h-4" /></Button><Button size="sm" variant="outline" onClick={() => void respond(request.id, "recusado")}><X className="w-4 h-4" /></Button></div></div>)}{message && <p role="status" className="text-sm text-orange-700">{message}</p>}</CardContent></Card></main></div></AuthGuard>
}
