// Progress tracking utilities
import { getActiveGoals } from "./goals"

export interface Progress {
  id: string
  usuarioId: string
  metaId: string
  data: string // YYYY-MM-DD format
  quantidadeCompletada: number
  completado: boolean
  dataAtualizacao: string
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

// Get progress for a specific date
export function getProgressByDate(userId: string, date: string): Progress[] {
  if (typeof window === "undefined") return []

  const progressStr = localStorage.getItem("foguinho_progress")
  if (!progressStr) return []

  const progress: Progress[] = JSON.parse(progressStr)
  return progress.filter((p) => p.usuarioId === userId && p.data === date)
}

// Get today's progress
export function getTodayProgress(userId: string): Progress[] {
  return getProgressByDate(userId, getTodayDate())
}

// Get progress for a specific goal and date
export function getGoalProgress(userId: string, metaId: string, date: string): Progress | null {
  const progress = getProgressByDate(userId, date)
  return progress.find((p) => p.metaId === metaId) || null
}

// Update or create progress
export function updateProgress(
  userId: string,
  metaId: string,
  quantidadeCompletada: number,
  metaDiaria: number,
): Progress {
  const progressStr = localStorage.getItem("foguinho_progress")
  const allProgress: Progress[] = progressStr ? JSON.parse(progressStr) : []

  const today = getTodayDate()
  const existingIndex = allProgress.findIndex((p) => p.usuarioId === userId && p.metaId === metaId && p.data === today)

  const completado = quantidadeCompletada >= metaDiaria

  if (existingIndex !== -1) {
    // Update existing progress
    allProgress[existingIndex] = {
      ...allProgress[existingIndex],
      quantidadeCompletada,
      completado,
      dataAtualizacao: new Date().toISOString(),
    }
  } else {
    // Create new progress
    const newProgress: Progress = {
      id: Date.now().toString(),
      usuarioId: userId,
      metaId,
      data: today,
      quantidadeCompletada,
      completado,
      dataAtualizacao: new Date().toISOString(),
    }
    allProgress.push(newProgress)
  }

  localStorage.setItem("foguinho_progress", JSON.stringify(allProgress))

  return allProgress[existingIndex !== -1 ? existingIndex : allProgress.length - 1]
}

// Calculate daily completion percentage
export function getDailyCompletionPercentage(userId: string): number {
  const activeGoals = getActiveGoals(userId)

  if (activeGoals.length === 0) return 0

  const todayProgress = getTodayProgress(userId)
  const completedGoals = todayProgress.filter((p) => p.completado).length

  return Math.round((completedGoals / activeGoals.length) * 100)
}

// Get completed goals count for today
export function getTodayCompletedCount(userId: string): { completed: number; total: number } {
  const activeGoals = getActiveGoals(userId)
  const todayProgress = getTodayProgress(userId)
  const completedGoals = todayProgress.filter((p) => p.completado).length

  return {
    completed: completedGoals,
    total: activeGoals.length,
  }
}

// Get progress history for a goal (last 7 days)
export function getGoalProgressHistory(userId: string, metaId: string, days = 7): Progress[] {
  if (typeof window === "undefined") return []

  const progressStr = localStorage.getItem("foguinho_progress")
  if (!progressStr) return []

  const allProgress: Progress[] = JSON.parse(progressStr)

  // Get dates for the last N days
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split("T")[0])
  }

  return allProgress
    .filter((p) => p.usuarioId === userId && p.metaId === metaId && dates.includes(p.data))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}
