import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    }

    const achievements = await sql`
      SELECT * FROM conquistas 
      WHERE usuario_id = ${userId} 
      ORDER BY data_conquista DESC
    `

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error("[v0] Get achievements error:", error)
    return NextResponse.json({ error: "Erro ao buscar conquistas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { userId, type, title, description, icon } = await request.json()

    const existing = await sql`SELECT id FROM conquistas WHERE usuario_id = ${userId} AND tipo = ${type}`

    if (existing.length > 0) {
      return NextResponse.json({ achievement: existing[0] })
    }

    const result = await sql`
      INSERT INTO conquistas (usuario_id, tipo, titulo, descricao, icone) 
      VALUES (${userId}, ${type}, ${title}, ${description}, ${icon})
      RETURNING *
    `

    return NextResponse.json({ achievement: result[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create achievement error:", error)
    return NextResponse.json({ error: "Erro ao criar conquista" }, { status: 500 })
  }
}
