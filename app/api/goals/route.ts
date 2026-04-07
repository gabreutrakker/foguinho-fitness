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

    const goals = await sql`SELECT * FROM metas WHERE usuario_id = ${userId} ORDER BY data_criacao DESC`

    return NextResponse.json({ goals })
  } catch (error) {
    console.error("[v0] Get goals error:", error)
    return NextResponse.json({ error: "Erro ao buscar metas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { userId, title, description, type, dailyGoal, unit } = await request.json()

    const result = await sql`
      INSERT INTO metas (usuario_id, titulo, descricao, tipo, meta_diaria, unidade, ativo) 
      VALUES (${userId}, ${title}, ${description}, ${type}, ${dailyGoal}, ${unit}, ${true})
      RETURNING *
    `

    return NextResponse.json({ goal: result[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create goal error:", error)
    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDb()
    const { id, title, description, type, dailyGoal, unit, active } = await request.json()

    const result = await sql`
      UPDATE metas 
      SET titulo = ${title}, descricao = ${description}, tipo = ${type}, 
          meta_diaria = ${dailyGoal}, unidade = ${unit}, ativo = ${active}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ goal: result[0] })
  } catch (error) {
    console.error("[v0] Update goal error:", error)
    return NextResponse.json({ error: "Erro ao atualizar meta" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    await sql`DELETE FROM metas WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete goal error:", error)
    return NextResponse.json({ error: "Erro ao deletar meta" }, { status: 500 })
  }
}
