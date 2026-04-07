// Goals management utilities
export interface Goal {
  id: string
  usuarioId: string
  titulo: string
  descricao: string
  tipo: "agua" | "exercicio" | "estudo" | "sono" | "outro"
  metaDiaria: number
  unidade: string
  ativo: boolean
  dataCriacao: string
}

// Get all goals for user
export function getGoals(userId: string): Goal[] {
  if (typeof window === "undefined") return []

  const goalsStr = localStorage.getItem("foguinho_goals")
  if (!goalsStr) return []

  const goals: Goal[] = JSON.parse(goalsStr)
  return goals.filter((g) => g.usuarioId === userId)
}

// Get active goals for user
export function getActiveGoals(userId: string): Goal[] {
  return getGoals(userId).filter((g) => g.ativo)
}

// Get goal by id
export function getGoalById(goalId: string): Goal | null {
  if (typeof window === "undefined") return null

  const goalsStr = localStorage.getItem("foguinho_goals")
  if (!goalsStr) return null

  const goals: Goal[] = JSON.parse(goalsStr)
  return goals.find((g) => g.id === goalId) || null
}

// Create new goal
export function createGoal(
  userId: string,
  titulo: string,
  descricao: string,
  tipo: Goal["tipo"],
  metaDiaria: number,
  unidade: string,
): Goal {
  const goalsStr = localStorage.getItem("foguinho_goals")
  const goals: Goal[] = goalsStr ? JSON.parse(goalsStr) : []

  const newGoal: Goal = {
    id: Date.now().toString(),
    usuarioId: userId,
    titulo,
    descricao,
    tipo,
    metaDiaria,
    unidade,
    ativo: true,
    dataCriacao: new Date().toISOString(),
  }

  goals.push(newGoal)
  localStorage.setItem("foguinho_goals", JSON.stringify(goals))

  return newGoal
}

// Update goal
export function updateGoal(
  goalId: string,
  updates: Partial<Omit<Goal, "id" | "usuarioId" | "dataCriacao">>,
): Goal | null {
  const goalsStr = localStorage.getItem("foguinho_goals")
  if (!goalsStr) return null

  const goals: Goal[] = JSON.parse(goalsStr)
  const goalIndex = goals.findIndex((g) => g.id === goalId)

  if (goalIndex === -1) return null

  goals[goalIndex] = { ...goals[goalIndex], ...updates }
  localStorage.setItem("foguinho_goals", JSON.stringify(goals))

  return goals[goalIndex]
}

// Delete goal
export function deleteGoal(goalId: string): boolean {
  const goalsStr = localStorage.getItem("foguinho_goals")
  if (!goalsStr) return false

  const goals: Goal[] = JSON.parse(goalsStr)
  const filteredGoals = goals.filter((g) => g.id !== goalId)

  if (filteredGoals.length === goals.length) return false

  localStorage.setItem("foguinho_goals", JSON.stringify(filteredGoals))

  // Also delete related progress
  const progressStr = localStorage.getItem("foguinho_progress")
  if (progressStr) {
    const progress = JSON.parse(progressStr)
    const filteredProgress = progress.filter((p: any) => p.metaId !== goalId)
    localStorage.setItem("foguinho_progress", JSON.stringify(filteredProgress))
  }

  return true
}

// Toggle goal active status
export function toggleGoalActive(goalId: string): Goal | null {
  const goal = getGoalById(goalId)
  if (!goal) return null

  return updateGoal(goalId, { ativo: !goal.ativo })
}

// Get goal type info
export function getGoalTypeInfo(tipo: Goal["tipo"]) {
  const types = {
    agua: {
      nome: "Água",
      icone: "💧",
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
      borderCor: "border-blue-200",
    },
    exercicio: {
      nome: "Exercício",
      icone: "💪",
      cor: "text-green-600",
      bgCor: "bg-green-50",
      borderCor: "border-green-200",
    },
    estudo: {
      nome: "Estudo",
      icone: "📚",
      cor: "text-purple-600",
      bgCor: "bg-purple-50",
      borderCor: "border-purple-200",
    },
    sono: {
      nome: "Sono",
      icone: "😴",
      cor: "text-indigo-600",
      bgCor: "bg-indigo-50",
      borderCor: "border-indigo-200",
    },
    outro: {
      nome: "Outro",
      icone: "⭐",
      cor: "text-gray-600",
      bgCor: "bg-gray-50",
      borderCor: "border-gray-200",
    },
  }

  return types[tipo]
}
