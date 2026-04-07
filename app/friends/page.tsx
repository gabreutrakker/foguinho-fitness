"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { FriendCard } from "@/components/friend-card"
import { getCurrentUser, type User } from "@/lib/auth"
import {
  getAcceptedFriends,
  getPendingRequests,
  getSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getAllUsers,
} from "@/lib/friends"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, UserPlus, Check, X } from "lucide-react"

export default function FriendsPage() {
  const router = useRouter()
  const [friends, setFriends] = useState<User[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [sentRequests, setSentRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const user = getCurrentUser()
    if (!user) return

    setCurrentUserId(user.id)
    setFriends(getAcceptedFriends(user.id))
    setPendingRequests(getPendingRequests(user.id))
    setSentRequests(getSentRequests(user.id))
  }

  const handleSearch = () => {
    const user = getCurrentUser()
    if (!user || !searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const allUsers = getAllUsers()
    const friendIds = new Set([
      ...friends.map((f) => f.id),
      ...pendingRequests.map((r) => r.usuarioId),
      ...sentRequests.map((r) => r.amigoId),
    ])

    const results = allUsers.filter(
      (u) =>
        u.id !== user.id &&
        !friendIds.has(u.id) &&
        (u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setSearchResults(results)
  }

  const handleSendRequest = (friendId: string) => {
    const user = getCurrentUser()
    if (!user) return

    const result = sendFriendRequest(user.id, friendId)
    if (result.success) {
      loadData()
      handleSearch()
    } else {
      alert(result.error)
    }
  }

  const handleAccept = (friendshipId: string) => {
    acceptFriendRequest(friendshipId)
    loadData()
  }

  const handleReject = (friendshipId: string) => {
    rejectFriendRequest(friendshipId)
    loadData()
  }

  const handleRemove = (friendId: string) => {
    const user = getCurrentUser()
    if (!user) return

    removeFriend(user.id, friendId)
    loadData()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <header className="bg-white border-b-2 border-orange-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="text-orange-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-orange-600">Amigos</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Search Section */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg">Buscar Amigos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Button size="sm" onClick={() => handleSendRequest(user.id)} variant="outline">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Solicitações Recebidas</CardTitle>
                  <Badge className="bg-orange-100 text-orange-700">{pendingRequests.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.user.nome}</p>
                      <p className="text-sm text-gray-600">{request.user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sent Requests */}
          {sentRequests.length > 0 && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Solicitações Enviadas</CardTitle>
                  <Badge variant="secondary">{sentRequests.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {sentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.user.nome}</p>
                      <p className="text-sm text-gray-600">Aguardando resposta...</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="text-gray-600"
                    >
                      Cancelar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Meus Amigos {friends.length > 0 && `(${friends.length})`}
            </h2>
            {friends.length === 0 ? (
              <Card className="border-2 border-orange-200">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">Você ainda não tem amigos.</p>
                  <p className="text-sm text-gray-500 mt-2">Use a busca acima para adicionar amigos!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} onRemove={handleRemove} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
