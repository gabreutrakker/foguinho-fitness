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

    const friends = await sql`
      SELECT a.*, u.nome, u.email
      FROM amigos a
      JOIN usuarios u ON a.amigo_id = u.id
      WHERE a.usuario_id = ${userId}
      ORDER BY a.data_solicitacao DESC
    `

    return NextResponse.json({ friends })
  } catch (error) {
    console.error("[v0] Get friends error:", error)
    return NextResponse.json({ error: "Erro ao buscar amigos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const { userId, friendEmail } = await request.json()

    const users = await sql`SELECT id FROM usuarios WHERE email = ${friendEmail}`

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const friendId = users[0].id

    const result = await sql`
      INSERT INTO amigos (usuario_id, amigo_id, status) 
      VALUES (${userId}, ${friendId}, 'pendente')
      RETURNING *
    `

    return NextResponse.json({ friend: result[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Add friend error:", error)
    return NextResponse.json({ error: "Erro ao adicionar amigo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDb()
    const { id, status } = await request.json()

    const result = await sql`
      UPDATE amigos 
      SET status = ${status} 
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ friend: result[0] })
  } catch (error) {
    console.error("[v0] Update friend error:", error)
    return NextResponse.json({ error: "Erro ao atualizar amigo" }, { status: 500 })
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

    await sql`DELETE FROM amigos WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete friend error:", error)
    return NextResponse.json({ error: "Erro ao deletar amigo" }, { status: 500 })
  }
}
