// Ranking utilities
import { getOrCreatePet } from "./pet"

export interface RankingEntry {
  usuario_id: string
  nome: string
  nivel: number
  experiencia: number
  estagio: string
  pet_nome: string
  avatar_url?: string | null
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
    const response = await fetch(`/api/ranking?userId=${encodeURIComponent(userId)}&ts=${Date.now()}`, { cache: "no-store" })
    const contentType = response.headers.get("content-type") || ""
    const data = contentType.includes("application/json") ? await response.json() : null

    if (!response.ok || !data) {
      console.error("[v0] Erro ao buscar ranking:", data?.error || `HTTP ${response.status}`)
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
