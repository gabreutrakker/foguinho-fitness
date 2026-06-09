import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const sql = getDb()

    // Ranking baseado no nivel e experiencia do pet, mais metas completadas
    const ranking = await sql`
      SELECT 
        u.id AS usuario_id,
        u.nome,
        COALESCE(p.nivel, 1) AS nivel,
        COALESCE(p.experiencia, 0) AS experiencia,
        COALESCE(p.estagio, 'bebe') AS estagio,
        COALESCE(p.nome, 'Foguinho') AS pet_nome,
        COALESCE(c.total_completadas, 0) AS metas_completadas,
        COALESCE(co.total_conquistas, 0) AS conquistas,
        (COALESCE(p.nivel, 1) * 1000 + COALESCE(p.experiencia, 0) + COALESCE(c.total_completadas, 0) * 50 + COALESCE(co.total_conquistas, 0) * 100) AS pontos
      FROM usuarios u
      LEFT JOIN pet p ON p.usuario_id = u.id
      LEFT JOIN (
        SELECT usuario_id, COUNT(*) AS total_completadas
        FROM progresso
        WHERE completado = true
        GROUP BY usuario_id
      ) c ON c.usuario_id = u.id
      LEFT JOIN (
        SELECT usuario_id, COUNT(*) AS total_conquistas
        FROM conquistas
        GROUP BY usuario_id
      ) co ON co.usuario_id = u.id
      ORDER BY pontos DESC, u.data_criacao ASC
      LIMIT 100
    `

    return NextResponse.json({ ranking })
  } catch (error) {
    console.error("[v0] Get ranking error:", error)
    return NextResponse.json({ error: "Erro ao buscar ranking" }, { status: 500 })
  }
}
