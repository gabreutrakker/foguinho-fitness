"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import { getActiveGoals, type Goal } from "@/lib/goals"
import { getTodayProgress, updateProgress, getDailyCompletionPercentage } from "@/lib/progress"
import { addExperience, updatePetStats } from "@/lib/pet"
import { checkAchievements } from "@/lib/achievements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyProgressCard() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const user = getCurrentUser()
    if (!user) return

    const activeGoals = getActiveGoals(user.id)
    setGoals(activeGoals)

    const todayProgress = getTodayProgress(user.id)
    const progressMap: Record<string, number> = {}

    todayProgress.forEach((p) => {
      progressMap[p.metaId] = p.quantidadeCompletada
    })

    setProgress(progressMap)
    setPercentage(getDailyCompletionPercentage(user.id))
  }

  const handleUpdateProgress = (goal: Goal, value: number) => {
    const user = getCurrentUser()
    if (!user) return

    const oldProgress = progress[goal.id] || 0
    const wasCompleted = oldProgress >= goal.metaDiaria
    const isNowCompleted = value >= goal.metaDiaria

    updateProgress(user.id, goal.id, value, goal.metaDiaria)

    // If goal just got completed, reward the pet
    if (!wasCompleted && isNowCompleted) {
      const xpGain = 20
      const result = addExperience(user.id, xpGain)

      // Increase pet happiness
      updatePetStats(user.id, undefined, result.pet.felicidade + 10)

      // Check for new achievements
      const newAchievements = checkAchievements(user.id)

      // Show notification
      if (result.leveledUp) {
        alert(`Parabéns! Seu Foguinho subiu para o nível ${result.pet.nivel}!`)
      }
      if (result.newStage) {
        alert(`Incrível! Seu Foguinho evoluiu para ${result.newStage}!`)
      }
      if (newAchievements.length > 0) {
        alert(`Nova conquista desbloqueada: ${newAchievements[0].titulo}!`)
      }
    }

    loadData()
  }

  if (goals.length === 0) {
    return (
      <Card className="border-2 border-orange-200">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Você ainda não tem metas ativas.</p>
          <p className="text-sm text-gray-500 mt-2">Crie suas primeiras metas para começar!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-orange-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-orange-600">Progresso de Hoje</CardTitle>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{percentage}%</span>
          </div>
        </div>
        <Progress value={percentage} className="h-3 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const currentProgress = progress[goal.id] || 0
          const isCompleted = currentProgress >= goal.metaDiaria
          const progressPercentage = Math.min((currentProgress / goal.metaDiaria) * 100, 100)

          return (
            <div key={goal.id} className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={cn("font-medium", isCompleted && "text-green-600")}>{goal.titulo}</p>
                    <p className="text-sm text-gray-600">
                      Meta: {goal.metaDiaria} {goal.unidade}
                    </p>
                  </div>
                </div>
              </div>

              <Progress value={progressPercentage} className="h-2" />

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={currentProgress}
                  onChange={(e) => handleUpdateProgress(goal, Number.parseInt(e.target.value) || 0)}
                  className="flex-1"
                  placeholder="0"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">{goal.unidade}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateProgress(goal, currentProgress + 1)}
                  className="bg-transparent"
                >
                  +1
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
