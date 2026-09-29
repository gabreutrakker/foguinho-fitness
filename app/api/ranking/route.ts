import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const sql = getDb()
    const userId = new URL(request.url).searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    const ranking = await sql`
      WITH friend_ids AS (
        SELECT CASE WHEN usuario_id = ${userId} THEN amigo_id ELSE usuario_id END AS id
        FROM amigos WHERE status = 'aceito' AND (usuario_id = ${userId} OR amigo_id = ${userId})
        UNION SELECT ${userId}::integer
      )
      SELECT u.id AS usuario_id, u.nome, u.email, u.biografia, u.avatar_url,
        COALESCE(p.nivel, 1) AS nivel, COALESCE(p.experiencia, 0) AS experiencia,
        COALESCE(p.estagio, 'bebe') AS estagio, COALESCE(p.nome, 'Pet') AS pet_nome,
        COALESCE(c.total_completadas, 0) AS metas_completadas, COALESCE(co.total_conquistas, 0) AS conquistas,
        (COALESCE(p.nivel, 1) * 1000 + COALESCE(p.experiencia, 0) + COALESCE(c.total_completadas, 0) * 50 + COALESCE(co.total_conquistas, 0) * 100) AS pontos
      FROM friend_ids f JOIN usuarios u ON u.id = f.id LEFT JOIN pet p ON p.usuario_id = u.id
      LEFT JOIN (SELECT usuario_id, COUNT(*) AS total_completadas FROM progresso WHERE completado = true GROUP BY usuario_id) c ON c.usuario_id = u.id
      LEFT JOIN (SELECT usuario_id, COUNT(*) AS total_conquistas FROM conquistas GROUP BY usuario_id) co ON co.usuario_id = u.id
      ORDER BY pontos DESC, u.data_criacao ASC`
    return NextResponse.json({ ranking, updatedAt: new Date().toISOString() })
  } catch (error) { console.error("[v0] Get ranking error:", error); return NextResponse.json({ error: "Erro ao buscar ranking" }, { status: 500 }) }
}
