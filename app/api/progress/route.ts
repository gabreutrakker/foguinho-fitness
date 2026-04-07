import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    const progress = await sql`
      SELECT p.*, m.titulo, m.tipo, m.meta_diaria, m.unidade
      FROM progresso p
      JOIN metas m ON p.meta_id = m.id
      WHERE p.usuario_id = ${userId} AND p.data = ${date}
    `

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("[v0] Get progress error:", error)
    return NextResponse.json({ error: "Erro ao buscar progresso" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { userId, goalId, date, completed, quantity } = await request.json()

    await sql`
      INSERT INTO progresso (usuario_id, meta_id, data, quantidade_completada, completado, data_atualizacao)
      VALUES (${userId}, ${goalId}, ${date}, ${quantity}, ${completed}, CURRENT_TIMESTAMP)
      ON CONFLICT (usuario_id, meta_id, data)
      DO UPDATE SET
        quantidade_completada = ${quantity},
        completado = ${completed},
        data_atualizacao = CURRENT_TIMESTAMP
    `

    const result = await sql`
      SELECT * FROM progresso WHERE usuario_id = ${userId} AND meta_id = ${goalId} AND data = ${date}
    `

    if (completed) {
      await sql`
        UPDATE pet
        SET experiencia = experiencia + 10,
            felicidade = LEAST(felicidade + 5, 100)
        WHERE usuario_id = ${userId}
      `
    }

    return NextResponse.json({ progress: result[0] })
  } catch (error) {
    console.error("[v0] Update progress error:", error)
    return NextResponse.json({ error: "Erro ao atualizar progresso" }, { status: 500 })
  }
}
