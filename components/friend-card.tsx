"use client"

import type { User } from "@/lib/auth"
import { getFriendProgress } from "@/lib/friends"
import { getPet, getPetStageInfo } from "@/lib/pet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, TrendingUp, UserMinus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FriendCardProps {
  friend: User
  onRemove?: (friendId: string) => void
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const progress = getFriendProgress(friend.id)
  const pet = getPet(friend.id)
  const stageInfo = pet ? getPetStageInfo(pet.estagio) : null

  const handleRemove = () => {
    if (confirm(`Tem certeza que deseja remover ${friend.nome} dos seus amigos?`)) {
      onRemove?.(friend.id)
    }
  }

  return (
    <Card className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center",
                stageInfo?.cor || "from-gray-400 to-gray-500",
              )}
            >
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{friend.nome}</h3>
              {pet && (
                <p className="text-xs text-gray-600">
                  {pet.nome} • Nível {pet.nivel}
                </p>
              )}
            </div>
          </div>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-600 hover:bg-red-50">
              <UserMinus className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Progresso Hoje</span>
            </div>
            <span className="font-semibold text-green-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
