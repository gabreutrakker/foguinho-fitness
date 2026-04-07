"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { GoalCard } from "@/components/goal-card"
import { GoalFormDialog } from "@/components/goal-form-dialog"
import { getCurrentUser } from "@/lib/auth"
import { type Goal, getGoals, createGoal, updateGoal } from "@/lib/goals"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    const user = getCurrentUser()
    if (user) {
      const userGoals = getGoals(user.id)
      setGoals(userGoals)
    }
  }

  const handleSave = (data: {
    titulo: string
    descricao: string
    tipo: Goal["tipo"]
    metaDiaria: number
    unidade: string
  }) => {
    const user = getCurrentUser()
    if (!user) return

    if (editingGoal) {
      updateGoal(editingGoal.id, data)
    } else {
      createGoal(user.id, data.titulo, data.descricao, data.tipo, data.metaDiaria, data.unidade)
    }

    loadGoals()
    setEditingGoal(null)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setDialogOpen(true)
  }

  const handleNew = () => {
    setEditingGoal(null)
    setDialogOpen(true)
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
              <h1 className="text-2xl font-bold text-orange-600">Minhas Metas</h1>
            </div>
            <Button
              onClick={handleNew}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {goals.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma meta cadastrada</h2>
              <p className="text-gray-600 mb-6">Comece criando sua primeira meta para cuidar do seu Foguinho!</p>
              <Button
                onClick={handleNew}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeira Meta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} onDelete={loadGoals} onToggle={loadGoals} />
              ))}
            </div>
          )}
        </main>

        <GoalFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} goal={editingGoal} />
      </div>
    </AuthGuard>
  )
}
