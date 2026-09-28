"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { getRanking, syncCurrentUserPet, type RankingEntry } from "@/lib/ranking"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trophy, Medal, Award, Crown, Flame, Target, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const ESTAGIO_LABEL: Record<string, string> = {
  bebe: "Bebê",
  crianca: "Criança",
  adolescente: "Adolescente",
  adulto: "Adulto",
  lendario: "Lendário",
}

export default function RankingPage() {
  const router = useRouter()
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRanking() {
      const user = getCurrentUser()
      if (user) {
        setCurrentUserId(user.id)
        // Sincroniza o pet do usuario atual antes de buscar o ranking
        await syncCurrentUserPet(user.id.toString())
      }
      if (!user) {
        setLoading(false)
        return
      }
      const data = await getRanking(user.id.toString())
      setRanking(data)
      setLoading(false)
    }
    loadRanking()
  }, [])

  const topThree = ranking.slice(0, 3)
  const rest = ranking.slice(3)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <header className="bg-white border-b-2 border-orange-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="text-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-orange-600">Ranking</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <Flame className="w-12 h-12 text-orange-400 mx-auto animate-pulse" />
              <p className="text-gray-600 mt-4">Carregando ranking...</p>
            </div>
          ) : ranking.length === 0 ? (
            <Card className="border-2 border-orange-200">
              <CardContent className="p-10 text-center">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-600 mt-4">Ainda nao ha usuarios no ranking.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Info Card */}
              <Card className="border-2 border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">Como pontuar?</h2>
                      <p className="text-sm text-gray-600">
                        Suba de nivel, complete metas e desbloqueie conquistas para ganhar pontos!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pódio - Top 3 */}
              {topThree.length > 0 && (
                <div className="grid grid-cols-3 gap-3 items-end">
                  {/* 2º Lugar */}
                  <PodiumSpot entry={topThree[1]} position={2} currentUserId={currentUserId} />
                  {/* 1º Lugar */}
                  <PodiumSpot entry={topThree[0]} position={1} currentUserId={currentUserId} />
                  {/* 3º Lugar */}
                  <PodiumSpot entry={topThree[2]} position={3} currentUserId={currentUserId} />
                </div>
              )}

              {/* Lista do restante */}
              {rest.length > 0 && (
                <div className="space-y-3">
                  {rest.map((entry, index) => (
                    <RankingRow
                      key={entry.usuario_id}
                      entry={entry}
                      position={index + 4}
                      isCurrentUser={entry.usuario_id === currentUserId}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

function PodiumSpot({
  entry,
  position,
  currentUserId,
}: {
  entry: RankingEntry | undefined
  position: number
  currentUserId: number | null
}) {
  if (!entry) return <div />

  const isCurrentUser = entry.usuario_id === currentUserId

  const config = {
    1: {
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
      ring: "ring-yellow-400",
      height: "h-32",
      avatar: "w-20 h-20",
      label: "1º",
    },
    2: {
      icon: Medal,
      color: "from-gray-300 to-gray-400",
      ring: "ring-gray-300",
      height: "h-24",
      avatar: "w-16 h-16",
      label: "2º",
    },
    3: {
      icon: Award,
      color: "from-orange-300 to-amber-500",
      ring: "ring-orange-300",
      height: "h-20",
      avatar: "w-16 h-16",
      label: "3º",
    },
  }[position]!

  const Icon = config.icon

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-2">
        <div
          className={cn(
            "rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg ring-4",
            config.color,
            config.ring,
            config.avatar,
          )}
        >
          <Flame className="w-1/2 h-1/2 text-white" />
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <Icon className="w-6 h-6 text-yellow-500 drop-shadow" />
        </div>
      </div>

      {/* Nome */}
      <p
        className={cn(
          "text-sm font-bold text-center truncate w-full px-1",
          isCurrentUser ? "text-orange-600" : "text-gray-800",
        )}
      >
        {entry.nome}
        {isCurrentUser && " (Você)"}
      </p>
      <p className="text-xs text-gray-500">Nível {entry.nivel}</p>

      {/* Base do pódio */}
      <div
        className={cn(
          "w-full rounded-t-lg bg-gradient-to-br flex flex-col items-center justify-center mt-2 shadow-inner",
          config.color,
          config.height,
        )}
      >
        <span className="text-2xl font-bold text-white drop-shadow">{config.label}</span>
        <span className="text-xs font-semibold text-white/90">{entry.pontos} pts</span>
      </div>
    </div>
  )
}

function RankingRow({
  entry,
  position,
  isCurrentUser,
}: {
  entry: RankingEntry
  position: number
  isCurrentUser: boolean
}) {
  return (
    <Card
      className={cn(
        "border-2 transition-all",
        isCurrentUser ? "border-orange-400 bg-orange-50 shadow-md" : "border-orange-100 hover:shadow-md",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Posição */}
          <div className="w-8 text-center flex-shrink-0">
            <span className="text-lg font-bold text-gray-400">{position}</span>
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={cn("font-bold truncate", isCurrentUser ? "text-orange-600" : "text-gray-800")}>
              {entry.nome}
              {isCurrentUser && " (Você)"}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Nível {entry.nivel}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {entry.metas_completadas} metas
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {entry.conquistas}
              </span>
            </div>
          </div>

          {/* Pontos */}
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-orange-600">{entry.pontos}</p>
            <p className="text-xs text-gray-400">pontos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
