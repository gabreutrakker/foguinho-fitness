"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { getPet, feedPet, type Pet } from "@/lib/pet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Heart, Zap, Sparkles, Star, Crown, Flame, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { PetCreature } from "@/components/pet-creature"

// Informacoes detalhadas de cada estagio do pet
const PET_STAGES = [
  {
    id: "bebe",
    nome: "Bebe",
    nivelMin: 1,
    nivelMax: 4,
    descricao: "Uma pequena chama que acabou de nascer. Precisa de muito cuidado!",
    cor: "from-orange-300 to-yellow-300",
    tamanho: "w-20 h-20",
    brilho: false,
    coroa: false,
    aura: false,
  },
  {
    id: "crianca",
    nome: "Crianca",
    nivelMin: 5,
    nivelMax: 9,
    descricao: "Seu Foguinho esta crescendo e ficando mais forte!",
    cor: "from-orange-400 to-yellow-400",
    tamanho: "w-24 h-24",
    brilho: true,
    coroa: false,
    aura: false,
  },
  {
    id: "adolescente",
    nome: "Adolescente",
    nivelMin: 10,
    nivelMax: 14,
    descricao: "Uma chama poderosa que irradia energia!",
    cor: "from-orange-500 to-red-500",
    tamanho: "w-28 h-28",
    brilho: true,
    coroa: false,
    aura: true,
  },
  {
    id: "adulto",
    nome: "Adulto",
    nivelMin: 15,
    nivelMax: 19,
    descricao: "Um Foguinho maduro e majestoso!",
    cor: "from-red-500 to-pink-500",
    tamanho: "w-32 h-32",
    brilho: true,
    coroa: false,
    aura: true,
  },
  {
    id: "lendario",
    nome: "Lendario",
    nivelMin: 20,
    nivelMax: 99,
    descricao: "A lenda maxima! Um Foguinho divino!",
    cor: "from-purple-500 via-pink-500 to-orange-500",
    tamanho: "w-36 h-36",
    brilho: true,
    coroa: true,
    aura: true,
  },
]

function PetVisual({ stage, isCurrentStage, isUnlocked }: { stage: typeof PET_STAGES[0]; isCurrentStage: boolean; isUnlocked: boolean }) {
  const sizeMap: Record<string, "sm" | "md" | "lg" | "xl"> = {
    bebe: "sm",
    crianca: "sm",
    adolescente: "md",
    adulto: "md",
    lendario: "lg",
  }

  return (
    <div className="relative flex items-center justify-center py-4">
      {isUnlocked ? (
        <div className={cn(isCurrentStage && "drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]")}>
          <PetCreature 
            stage={stage.id as "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"} 
            isAnimated={isCurrentStage}
            size={sizeMap[stage.id]}
          />
        </div>
      ) : (
        <div className="relative">
          <div className="opacity-30 grayscale">
            <PetCreature 
              stage={stage.id as "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"} 
              isAnimated={false}
              size={sizeMap[stage.id]}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-800 rounded-full p-3">
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PetPage() {
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [isFeeding, setIsFeeding] = useState(false)

  useEffect(() => {
    loadPet()
    const interval = setInterval(loadPet, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadPet = () => {
    const user = getCurrentUser()
    if (user) {
      const userPet = getPet(user.id)
      setPet(userPet)
    }
  }

  const handleFeed = () => {
    const user = getCurrentUser()
    if (!user) return

    setIsFeeding(true)
    const updatedPet = feedPet(user.id)
    if (updatedPet) {
      setPet(updatedPet)
    }
    setTimeout(() => setIsFeeding(false), 1000)
  }

  const currentStage = PET_STAGES.find((s) => pet?.estagio === s.id) || PET_STAGES[0]

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
              <h1 className="text-2xl font-bold text-orange-600">Meu Foguinho</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Current Pet Card */}
          <Card className="border-2 border-orange-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-orange-600">{pet?.nome || "Foguinho"}</CardTitle>
                  <p className="text-gray-600">
                    {currentStage.nome} - Nivel {pet?.nivel || 1}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white rounded-full shadow-md">
                  <span className="text-lg font-bold text-purple-600">{pet?.experiencia || 0}/100 XP</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Pet Display */}
              <div className="flex justify-center py-8">
                <div className="drop-shadow-[0_0_25px_rgba(251,146,60,0.6)]">
                  <PetCreature 
                    stage={currentStage.id as "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"} 
                    isAnimated={true}
                    size="xl"
                  />
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6">{currentStage.descricao}</p>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">Energia</span>
                    </div>
                    <span className="font-semibold text-yellow-600">{pet?.energia || 0}%</span>
                  </div>
                  <Progress value={pet?.energia || 0} className="h-3 bg-yellow-100" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-medium text-gray-700">Felicidade</span>
                    </div>
                    <span className="font-semibold text-pink-600">{pet?.felicidade || 0}%</span>
                  </div>
                  <Progress value={pet?.felicidade || 0} className="h-3 bg-pink-100" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-700">Experiencia</span>
                    </div>
                    <span className="font-semibold text-purple-600">{pet?.experiencia || 0}/100 XP</span>
                  </div>
                  <Progress value={pet?.experiencia || 0} className="h-3 bg-purple-100" />
                </div>
              </div>

              {/* Feed Button */}
              <Button
                onClick={handleFeed}
                disabled={isFeeding || (pet?.energia || 0) >= 100}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-12"
              >
                {isFeeding ? "Alimentando..." : "Alimentar Foguinho"}
              </Button>
            </CardContent>
          </Card>

          {/* Evolution Stages */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Evolucoes do Foguinho
              </CardTitle>
              <p className="text-sm text-gray-600">Veja todas as formas que seu Foguinho pode alcançar!</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PET_STAGES.map((stage) => {
                  const isUnlocked = pet ? pet.nivel >= stage.nivelMin : false
                  const isCurrent = pet?.estagio === stage.id

                  return (
                    <Card
                      key={stage.id}
                      className={cn(
                        "border-2 transition-all duration-300",
                        isCurrent
                          ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg"
                          : isUnlocked
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-gray-50 opacity-60"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <PetVisual stage={stage} isCurrentStage={isCurrent} isUnlocked={isUnlocked} />

                          <h3
                            className={cn(
                              "font-bold text-lg mt-2",
                              isCurrent ? "text-orange-600" : isUnlocked ? "text-green-600" : "text-gray-500"
                            )}
                          >
                            {stage.nome}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Nivel {stage.nivelMin} - {stage.nivelMax}
                          </p>

                          <p
                            className={cn(
                              "text-sm mt-2",
                              isCurrent || isUnlocked ? "text-gray-600" : "text-gray-400"
                            )}
                          >
                            {stage.descricao}
                          </p>

                          {isCurrent && (
                            <span className="mt-3 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                              ATUAL
                            </span>
                          )}
                          {!isCurrent && isUnlocked && (
                            <span className="mt-3 px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs font-bold">
                              DESBLOQUEADO
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="mt-3 px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs font-bold">
                              NIVEL {stage.nivelMin}+
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
