"use client"

import type { Achievement } from "@/lib/achievements"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const timeAgo = formatDistanceToNow(new Date(achievement.dataConquista), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <Card className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0">{achievement.icone}</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{achievement.titulo}</h3>
            <p className="text-sm text-gray-600 mt-1">{achievement.descricao}</p>
            <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
