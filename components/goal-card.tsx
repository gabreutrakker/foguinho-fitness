"use client"

import { type Goal, getGoalTypeInfo, toggleGoalActive, deleteGoal } from "@/lib/goals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Power } from "lucide-react"
import { cn } from "@/lib/utils"

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onToggle: (goalId: string) => void
}

export function GoalCard({ goal, onEdit, onDelete, onToggle }: GoalCardProps) {
  const typeInfo = getGoalTypeInfo(goal.tipo)

  const handleToggle = () => {
    toggleGoalActive(goal.id)
    onToggle(goal.id)
  }

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a meta "${goal.titulo}"?`)) {
      deleteGoal(goal.id)
      onDelete(goal.id)
    }
  }

  return (
    <Card className={cn("border-2 transition-all", typeInfo.borderCor, !goal.ativo && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{typeInfo.icone}</span>
            <div className="flex-1">
              <CardTitle className="text-lg">{goal.titulo}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{goal.descricao}</p>
            </div>
          </div>
          <Badge
            variant={goal.ativo ? "default" : "secondary"}
            className={cn(goal.ativo && typeInfo.bgCor, goal.ativo && typeInfo.cor)}
          >
            {goal.ativo ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={cn("p-3 rounded-lg", typeInfo.bgCor)}>
          <p className={cn("text-sm font-medium", typeInfo.cor)}>Meta Diária</p>
          <p className="text-2xl font-bold text-gray-800">
            {goal.metaDiaria} {goal.unidade}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(goal)} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            className={cn("flex-1", goal.ativo ? "text-orange-600" : "text-green-600")}
          >
            <Power className="w-4 h-4 mr-1" />
            {goal.ativo ? "Desativar" : "Ativar"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
