"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { PetDisplay } from "@/components/pet-display"
import { DailyProgressCard } from "@/components/daily-progress-card"
import { getCurrentUser, logout } from "@/lib/auth"
import { getTodayCompletedCount } from "@/lib/progress"
import { getFriendsData } from "@/lib/friends"
import { getOrCreatePet } from "@/lib/pet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Target, Trophy, Users, Flame, BarChart3, Bell } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [completedCount, setCompletedCount] = useState({ completed: 0, total: 0 })
  const [friendsCount, setFriendsCount] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    setUserName(user.nome)
    setCompletedCount(getTodayCompletedCount(user.id))
    void getFriendsData(user.id).then((data) => {
      setFriendsCount(data.friends.length)
      setPendingRequests(data.requests.length)
    }).catch(() => {
      setFriendsCount(0)
      setPendingRequests(0)
    })
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <header className="bg-white border-b-2 border-orange-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-orange-600">Foguinho Fitness</h1>
              <p className="text-sm text-gray-600">Olá, {userName}!</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PetDisplay />
            <DailyProgressCard />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card
              className="border-2 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => router.push("/goals")}
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-1.5 text-orange-600">
                  <Target className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Metas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {completedCount.completed}/{completedCount.total}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">
                  {completedCount.total === 0
                    ? "Nenhuma meta"
                    : completedCount.completed === completedCount.total && completedCount.total > 0
                      ? "Completas!"
                      : "Continue!"}
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => router.push("/pet")}
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-1.5 text-orange-600">
                  <Flame className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Meu Pet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{getCurrentUser() ? getOrCreatePet(getCurrentUser()!.id).nome : "Meu Pet"}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">Ver evolucoes</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => router.push("/achievements")}
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-1.5 text-orange-600">
                  <Trophy className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Conquistas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-2xl md:text-3xl font-bold text-gray-800">9</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">Ver todas</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => router.push("/friends")}
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-1.5 text-orange-600">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Amigos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{friendsCount}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">
                  {friendsCount === 0 ? "Adicionar" : "Competindo!"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-14"
              onClick={() => router.push("/goals")}
            >
              <Target className="w-5 h-5 mr-2" />
              Metas
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold h-14"
              onClick={() => router.push("/pet")}
            >
              <Flame className="w-5 h-5 mr-2" />
              Pet
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold h-14"
              onClick={() => router.push("/achievements")}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Conquistas
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold h-14"
              onClick={() => router.push("/ranking")}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Ranking
            </Button>
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold h-14"
            onClick={() => router.push("/notifications")}
          >
            <Bell className="w-5 h-5 mr-2" />
            Avisos
            {pendingRequests > 0 && <span aria-label={`${pendingRequests} pedidos de amizade pendentes`} className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-xs font-bold text-white shadow">{pendingRequests > 99 ? "99+" : pendingRequests}</span>}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold h-14 bg-transparent"
            onClick={() => router.push("/profile")}
          >
              <Users className="w-5 h-5 mr-2" />
              Perfil
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
