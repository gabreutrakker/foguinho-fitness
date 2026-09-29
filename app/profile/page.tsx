"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AchievementCard } from "@/components/achievement-card"
import { StatsCard } from "@/components/stats-card"
import { getCurrentUser } from "@/lib/auth"
import { getOrCreatePet, getPetStageInfo, updatePet } from "@/lib/pet"
import { getGoals } from "@/lib/goals"
import { getAchievements, getAchievementStats, checkAchievements } from "@/lib/achievements"
import { getFriendsData } from "@/lib/friends"
import { getTodayCompletedCount } from "@/lib/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Flame, Target, Users, Trophy, TrendingUp, Calendar, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [petName, setPetName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
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
    setBio(user.biografia || "")
    setAvatarUrl(user.avatar_url || "")

    const userPet = getOrCreatePet(user.id)
    setPetName(userPet.nome)
    setPet(userPet)

    const goals = getGoals(user.id)
    const completedToday = getTodayCompletedCount(user.id)

    // Check for new achievements
    checkAchievements(user.id)

    const userAchievements = getAchievements(user.id)
    setAchievements(userAchievements)

    const achievementStats = getAchievementStats(user.id)

    void getFriendsData(user.id).then((data) => {
      setStats((current) => ({ ...current, friendsCount: data.friends.length }))
    })

    setStats({
      goalsCount: goals.length,
      friendsCount: 0,
      completedToday,
      achievementStats,
    })
  }

  const stageInfo = pet ? getPetStageInfo(pet.estagio) : null

  const handleAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setSaveMessage("Escolha uma imagem válida")
      return
    }
    if (file.size > 1_500_000) {
      setSaveMessage("A imagem deve ter no máximo 1,5 MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(typeof reader.result === "string" ? reader.result : "")
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    const user = getCurrentUser()
    if (!user) return
    const nextPet = updatePet(user.id, { nome: petName.trim() || "Meu Pet" })
    setPet(nextPet)
    setPetName(nextPet.nome)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, biografia: bio.trim(), avatarUrl }),
      })
      if (!response.ok) throw new Error("profile update failed")
      const data = await response.json()
      localStorage.setItem("foguinho_user", JSON.stringify({ ...user, ...data.user }))
      setSaveMessage("Perfil atualizado")
    } catch (error) {
      console.error("[v0] Falha ao salvar perfil:", error)
      setSaveMessage("Não foi possível salvar agora")
    }
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
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={`Foto de perfil de ${userName}`} className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white" />
                  ) : (
                    <div
                      className={cn(
                        "rounded-full bg-gradient-to-br flex items-center justify-center shadow-xl",
                        stageInfo?.cor || "from-orange-400 to-red-400",
                        "w-32 h-32",
                      )}
                    >
                      <Flame className="w-16 h-16 text-white" />
                    </div>
                  )}
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

          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader><CardTitle className="text-xl text-orange-600">Editar perfil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><label htmlFor="pet-name" className="text-sm font-medium">Nome do pet</label><Input id="pet-name" value={petName} maxLength={40} onChange={(event) => setPetName(event.target.value)} placeholder="Escolha um nome" /></div>
              <div className="space-y-2"><label htmlFor="bio" className="text-sm font-medium">Biografia</label><Textarea id="bio" value={bio} maxLength={500} onChange={(event) => setBio(event.target.value)} placeholder="Conte um pouco sobre você" /></div>
              <div className="space-y-2">
                <label htmlFor="avatar-file" className="text-sm font-medium">Foto de perfil</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarFile} className="cursor-pointer" />
                  {avatarUrl && <Button type="button" variant="outline" onClick={() => setAvatarUrl("")} aria-label="Remover foto"><X className="w-4 h-4 mr-1" />Remover</Button>}
                </div>
                <p className="text-xs text-gray-500">PNG, JPG ou WebP, até 1,5 MB.</p>
              </div>
              <div className="flex items-center gap-3"><Button onClick={() => void saveProfile()} className="bg-orange-500 hover:bg-orange-600">Salvar alterações</Button>{saveMessage && <span className="text-sm text-gray-600" role="status">{saveMessage}</span>}</div>
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
