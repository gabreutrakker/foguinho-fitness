// Achievements management utilities
export interface Achievement {
  id: string
  usuarioId: string
  tipo: string
  titulo: string
  descricao: string
  icone: string
  dataConquista: string
}

// Get all achievements for user
export function getAchievements(userId: string): Achievement[] {
  if (typeof window === "undefined") return []

  const achievementsStr = localStorage.getItem("foguinho_achievements")
  if (!achievementsStr) return []

  const achievements: Achievement[] = JSON.parse(achievementsStr)
  return achievements
    .filter((a) => a.usuarioId === userId)
    .sort((a, b) => new Date(b.dataConquista).getTime() - new Date(a.dataConquista).getTime())
}

// Add achievement
export function addAchievement(
  userId: string,
  tipo: string,
  titulo: string,
  descricao: string,
  icone: string,
): Achievement {
  const achievementsStr = localStorage.getItem("foguinho_achievements")
  const achievements: Achievement[] = achievementsStr ? JSON.parse(achievementsStr) : []

  const newAchievement: Achievement = {
    id: Date.now().toString(),
    usuarioId: userId,
    tipo,
    titulo,
    descricao,
    icone,
    dataConquista: new Date().toISOString(),
  }

  achievements.push(newAchievement)
  localStorage.setItem("foguinho_achievements", JSON.stringify(achievements))

  return newAchievement
}

// Check and award achievements based on user progress
export function checkAchievements(userId: string): Achievement[] {
  const existingAchievements = getAchievements(userId)
  const existingTypes = new Set(existingAchievements.map((a) => a.tipo))
  const newAchievements: Achievement[] = []

  const pet = getPet(userId)
  const goals = getGoals(userId)
  const todayProgress = getTodayProgress(userId)
  const friends = getAcceptedFriends(userId)

  // First goal achievement
  if (goals.length >= 1 && !existingTypes.has("primeira_meta")) {
    newAchievements.push(addAchievement(userId, "primeira_meta", "Primeira Meta", "Criou sua primeira meta!", "🎯"))
  }

  // First completed goal
  const completedToday = todayProgress.filter((p) => p.completado).length
  if (completedToday >= 1 && !existingTypes.has("primeira_conclusao")) {
    newAchievements.push(
      addAchievement(userId, "primeira_conclusao", "Primeira Conquista", "Completou sua primeira meta!", "✅"),
    )
  }

  // All goals completed in a day
  if (goals.length > 0 && completedToday === goals.length && !existingTypes.has("dia_perfeito")) {
    newAchievements.push(
      addAchievement(userId, "dia_perfeito", "Dia Perfeito", "Completou todas as metas do dia!", "⭐"),
    )
  }

  // Pet level milestones
  if (pet) {
    if (pet.nivel >= 5 && !existingTypes.has("nivel_5")) {
      newAchievements.push(addAchievement(userId, "nivel_5", "Nível 5", "Seu Foguinho chegou ao nível 5!", "🔥"))
    }
    if (pet.nivel >= 10 && !existingTypes.has("nivel_10")) {
      newAchievements.push(addAchievement(userId, "nivel_10", "Nível 10", "Seu Foguinho chegou ao nível 10!", "💪"))
    }
    if (pet.nivel >= 20 && !existingTypes.has("nivel_20")) {
      newAchievements.push(addAchievement(userId, "nivel_20", "Lendário", "Seu Foguinho é lendário!", "👑"))
    }
  }

  // Friend achievements
  if (friends.length >= 1 && !existingTypes.has("primeiro_amigo")) {
    newAchievements.push(
      addAchievement(userId, "primeiro_amigo", "Primeiro Amigo", "Adicionou seu primeiro amigo!", "👥"),
    )
  }

  if (friends.length >= 5 && !existingTypes.has("popular")) {
    newAchievements.push(addAchievement(userId, "popular", "Popular", "Tem 5 amigos ou mais!", "🌟"))
  }

  return newAchievements
}

// Get achievement statistics
export function getAchievementStats(userId: string) {
  const achievements = getAchievements(userId)
  const totalPossible = 9 // Total number of possible achievements

  return {
    total: achievements.length,
    totalPossible,
    percentage: Math.round((achievements.length / totalPossible) * 100),
  }
}

import { getPet } from "./pet"
import { getGoals } from "./goals"
import { getTodayProgress } from "./progress"
import { getAcceptedFriends } from "./friends"
