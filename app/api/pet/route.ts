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

    const pets = await sql`SELECT * FROM pet WHERE usuario_id = ${userId}`

    if (pets.length === 0) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ pet: pets[0] })
  } catch (error) {
    console.error("[v0] Get pet error:", error)
    return NextResponse.json({ error: "Erro ao buscar pet" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getDb()
    const { userId, experiencia, energia, felicidade, nivel, estagio } = await request.json()

    const result = await sql`
      UPDATE pet
      SET experiencia = ${experiencia},
          energia = ${energia},
          felicidade = ${felicidade},
          nivel = ${nivel},
          estagio = ${estagio},
          ultima_alimentacao = CURRENT_TIMESTAMP
      WHERE usuario_id = ${userId}
      RETURNING *
    `

    return NextResponse.json({ pet: result[0] })
  } catch (error) {
    console.error("[v0] Update pet error:", error)
    return NextResponse.json({ error: "Erro ao atualizar pet" }, { status: 500 })
  }
}
