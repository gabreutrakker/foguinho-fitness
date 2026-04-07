"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AchievementCard } from "@/components/achievement-card"
import { StatsCard } from "@/components/stats-card"
import { getCurrentUser } from "@/lib/auth"
import { getPet, getPetStageInfo } from "@/lib/pet"
import { getGoals } from "@/lib/goals"
import { getAchievements, getAchievementStats, checkAchievements } from "@/lib/achievements"
import { getAcceptedFriends } from "@/lib/friends"
import { getTodayCompletedCount } from "@/lib/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Flame, Target, Users, Trophy, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [pet, setPet] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [stats, setStats] = useState({
    goalsCount: 0,
    friendsCount: 0,
    completedToday: { completed: 0, total: 0 },
    achievementStats: { total: 0, totalPossible: 0, percentage: 0 },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const user = getCurrentUser()
    if (!user) return

    setUserName(user.nome)
    setUserEmail(user.email)

    const userPet = getPet(user.id)
    setPet(userPet)

    const goals = getGoals(user.id)
    const friends = getAcceptedFriends(user.id)
    const completedToday = getTodayCompletedCount(user.id)

    // Check for new achievements
    checkAchievements(user.id)

    const userAchievements = getAchievements(user.id)
    setAchievements(userAchievements)

    const achievementStats = getAchievementStats(user.id)

    setStats({
      goalsCount: goals.length,
      friendsCount: friends.length,
      completedToday,
      achievementStats,
    })
  }

  const stageInfo = pet ? getPetStageInfo(pet.estagio) : null

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
              <h1 className="text-2xl font-bold text-orange-600">Meu Perfil</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Profile Header */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Pet Avatar */}
                <div
                  className={cn(
                    "rounded-full bg-gradient-to-br flex items-center justify-center shadow-xl flex-shrink-0",
                    stageInfo?.cor || "from-orange-400 to-red-400",
                    "w-32 h-32",
                  )}
                >
                  <Flame className="w-16 h-16 text-white" />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800">{userName}</h2>
                  <p className="text-gray-600 mt-1">{userEmail}</p>
                  {pet && (
                    <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        {pet.nome} • Nível {pet.nivel}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {stageInfo?.nome}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Metas Criadas" value={stats.goalsCount} icon={Target} iconColor="text-blue-600" />
            <StatsCard title="Amigos" value={stats.friendsCount} icon={Users} iconColor="text-green-600" />
            <StatsCard
              title="Hoje"
              value={`${stats.completedToday.completed}/${stats.completedToday.total}`}
              description="Metas completas"
              icon={TrendingUp}
              iconColor="text-orange-600"
            />
            <StatsCard title="Nível do Pet" value={pet?.nivel || 0} icon={Flame} iconColor="text-red-600" />
          </div>

          {/* Achievements Section */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2 text-orange-600">
                  <Trophy className="w-6 h-6" />
                  Conquistas
                </CardTitle>
                <span className="text-sm text-gray-600">
                  {stats.achievementStats.total} de {stats.achievementStats.totalPossible}
                </span>
              </div>
              <Progress value={stats.achievementStats.percentage} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Você ainda não tem conquistas.</p>
                  <p className="text-sm text-gray-500 mt-2">Complete metas para desbloquear conquistas!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-orange-600">
                <Calendar className="w-6 h-6" />
                Resumo de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Metas Ativas</p>
                  <p className="text-sm text-gray-600">Metas que você está trabalhando</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">{stats.goalsCount}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Progresso de Hoje</p>
                  <p className="text-sm text-gray-600">Metas completadas hoje</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedToday.total > 0
                    ? Math.round((stats.completedToday.completed / stats.completedToday.total) * 100)
                    : 0}
                  %
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Experiência do Pet</p>
                  <p className="text-sm text-gray-600">XP para o próximo nível</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">{pet?.experiencia || 0}/100</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
