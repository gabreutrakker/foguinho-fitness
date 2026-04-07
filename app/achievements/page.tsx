"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { getAchievements } from "@/lib/achievements"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

// Todas as conquistas possíveis no jogo
const ALL_ACHIEVEMENTS = [
  {
    tipo: "primeira_meta",
    titulo: "Primeira Meta",
    descricao: "Crie sua primeira meta",
    icone: "🎯",
    dica: "Vá até a página de metas e crie sua primeira meta!",
  },
  {
    tipo: "primeira_conclusao",
    titulo: "Primeira Conquista",
    descricao: "Complete sua primeira meta",
    icone: "✅",
    dica: "Complete qualquer meta do dia para desbloquear.",
  },
  {
    tipo: "dia_perfeito",
    titulo: "Dia Perfeito",
    descricao: "Complete todas as metas do dia",
    icone: "⭐",
    dica: "Termine todas as suas metas diárias em um único dia.",
  },
  {
    tipo: "nivel_5",
    titulo: "Nível 5",
    descricao: "Seu Foguinho chegou ao nível 5",
    icone: "🔥",
    dica: "Continue completando metas para ganhar XP!",
  },
  {
    tipo: "nivel_10",
    titulo: "Nível 10",
    descricao: "Seu Foguinho chegou ao nível 10",
    icone: "💪",
    dica: "Mantenha a consistência nas suas metas diárias.",
  },
  {
    tipo: "nivel_20",
    titulo: "Lendário",
    descricao: "Seu Foguinho é lendário!",
    icone: "👑",
    dica: "Alcance o nível 20 com seu Foguinho.",
  },
  {
    tipo: "primeiro_amigo",
    titulo: "Primeiro Amigo",
    descricao: "Adicionou seu primeiro amigo",
    icone: "👥",
    dica: "Adicione um amigo para competir juntos!",
  },
  {
    tipo: "popular",
    titulo: "Popular",
    descricao: "Tem 5 amigos ou mais",
    icone: "🌟",
    dica: "Faça 5 amizades no app.",
  },
  {
    tipo: "semana_perfeita",
    titulo: "Semana Perfeita",
    descricao: "Complete todas as metas por 7 dias seguidos",
    icone: "🏆",
    dica: "Mantenha uma sequência de 7 dias perfeitos.",
  },
]

export default function AchievementsPage() {
  const router = useRouter()
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [achievementDates, setAchievementDates] = useState<Record<string, string>>({})

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      const achievements = getAchievements(user.id)
      setUnlockedAchievements(achievements.map((a) => a.tipo))
      const dates: Record<string, string> = {}
      achievements.forEach((a) => {
        dates[a.tipo] = new Date(a.dataConquista).toLocaleDateString("pt-BR")
      })
      setAchievementDates(dates)
    }
  }, [])

  const progress = Math.round((unlockedAchievements.length / ALL_ACHIEVEMENTS.length) * 100)

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
              <h1 className="text-2xl font-bold text-orange-600">Conquistas</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Progress Card */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Seu Progresso</h2>
                    <p className="text-sm text-gray-600">
                      {unlockedAchievements.length} de {ALL_ACHIEVEMENTS.length} conquistas
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-orange-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.tipo)
              const date = achievementDates[achievement.tipo]

              return (
                <Card
                  key={achievement.tipo}
                  className={cn(
                    "border-2 transition-all duration-300 overflow-hidden",
                    isUnlocked
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg"
                      : "border-gray-200 bg-gray-50 opacity-75"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md",
                          isUnlocked
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                            : "bg-gray-300"
                        )}
                      >
                        {isUnlocked ? achievement.icone : <Lock className="w-6 h-6 text-gray-500" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-bold text-lg",
                            isUnlocked ? "text-gray-800" : "text-gray-500"
                          )}
                        >
                          {achievement.titulo}
                        </h3>
                        <p
                          className={cn(
                            "text-sm mt-1",
                            isUnlocked ? "text-gray-600" : "text-gray-400"
                          )}
                        >
                          {achievement.descricao}
                        </p>

                        {isUnlocked ? (
                          <p className="text-xs text-green-600 mt-2 font-medium">
                            Desbloqueado em {date}
                          </p>
                        ) : (
                          <p className="text-xs text-orange-500 mt-2 italic">
                            Dica: {achievement.dica}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
