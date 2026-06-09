"use client"

import { useEffect, useState } from "react"
import { type Pet, getOrCreatePet, getPetStageInfo, feedPet } from "@/lib/pet"
import { getCurrentUser } from "@/lib/auth"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { PetCreature } from "@/components/pet-creature"

export function PetDisplay() {
  const [pet, setPet] = useState<Pet | null>(null)
  const [isFeeding, setIsFeeding] = useState(false)

  const loadPet = () => {
    const user = getCurrentUser()
    if (user) {
      const userPet = getOrCreatePet(user.id)
      setPet(userPet)
    }
  }

  useEffect(() => {
    loadPet()

    const interval = setInterval(loadPet, 2000)
    return () => clearInterval(interval)
  }, [])

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

  if (!pet) {
    return (
      <Card className="border-2 border-orange-200">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Carregando seu Foguinho...</p>
        </CardContent>
      </Card>
    )
  }

  const stageInfo = getPetStageInfo(pet.estagio)
  const xpPercentage = pet.experiencia

  return (
    <Card className="border-2 border-orange-200 shadow-lg overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Pet Info Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-orange-600">{pet.nome}</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              Nível {pet.nivel}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {stageInfo.nome} • {stageInfo.descricao}
          </p>
        </div>

        {/* Pet Visual */}
        <div className="flex justify-center py-6 relative">
          <div className={cn("transition-all duration-300", isFeeding && "scale-110")}>
            <PetCreature 
              stage={pet.estagio as "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"} 
              isAnimated={true}
              size="lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {/* Energy Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-700">Energia</span>
              </div>
              <span className="font-semibold text-yellow-600">{pet.energia}%</span>
            </div>
            <Progress value={pet.energia} className="h-3 bg-yellow-100" />
          </div>

          {/* Happiness Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="font-medium text-gray-700">Felicidade</span>
              </div>
              <span className="font-semibold text-pink-600">{pet.felicidade}%</span>
            </div>
            <Progress value={pet.felicidade} className="h-3 bg-pink-100" />
          </div>

          {/* XP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-700">Experiência</span>
              </div>
              <span className="font-semibold text-purple-600">{xpPercentage}/100 XP</span>
            </div>
            <Progress value={xpPercentage} className="h-3 bg-purple-100" />
          </div>
        </div>

        {/* Feed Button */}
        <Button
          onClick={handleFeed}
          disabled={isFeeding || pet.energia >= 100}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
        >
          {isFeeding ? "Alimentando..." : "Alimentar Foguinho"}
        </Button>
      </CardContent>
    </Card>
  )
}
