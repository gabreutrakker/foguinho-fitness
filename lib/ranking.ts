// Ranking utilities
import { getOrCreatePet } from "./pet"

export interface RankingEntry {
  usuario_id: string
  nome: string
  nivel: number
  experiencia: number
  estagio: string
  pet_nome: string
  metas_completadas: number
  conquistas: number
  pontos: number
}

// Sincroniza o pet do usuario atual (localStorage) com o banco de dados
export async function syncCurrentUserPet(userId: string): Promise<void> {
  try {
    const pet = getOrCreatePet(userId)

    await fetch("/api/pet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        nome: pet.nome,
        experiencia: pet.experiencia,
        energia: pet.energia,
        felicidade: pet.felicidade,
        nivel: pet.nivel,
        estagio: pet.estagio,
      }),
    })
  } catch (error) {
    console.error("[v0] Erro ao sincronizar pet:", error)
  }
}

// Busca o ranking geral de todos os usuarios
export async function getRanking(userId: string): Promise<RankingEntry[]> {
  try {
    await syncCurrentUserPet(userId)
    const response = await fetch(`/api/ranking?userId=${encodeURIComponent(userId)}`, { cache: "no-store" })
    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Erro ao buscar ranking:", data.error)
      return []
    }

    return (data.ranking || []).map((entry: RankingEntry & { usuario_id: string | number }) => ({
      ...entry,
      usuario_id: String(entry.usuario_id),
    }))
  } catch (error) {
    console.error("[v0] Erro ao buscar ranking:", error)
    return []
  }
}
