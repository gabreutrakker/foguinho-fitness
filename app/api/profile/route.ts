import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  try {
    const sql = getDb()
    const rows = await sql`SELECT id, nome, email, biografia, avatar_url FROM usuarios WHERE id = ${userId}`
    if (!rows.length) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    return NextResponse.json({ user: rows[0] })
  } catch { return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 }) }
}

export async function PUT(request: Request) {
  try {
    const sql = getDb()
    const { userId, biografia, avatarUrl, nome } = await request.json()
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    if (typeof biografia === "string" && biografia.length > 500) return NextResponse.json({ error: "Biografia muito longa" }, { status: 400 })
    if (typeof avatarUrl === "string" && avatarUrl.length > 2_000_000) return NextResponse.json({ error: "Imagem muito grande" }, { status: 400 })
    const rows = await sql`UPDATE usuarios SET nome = COALESCE(${nome || null}, nome), biografia = COALESCE(${biografia ?? null}, biografia), avatar_url = COALESCE(${avatarUrl ?? null}, avatar_url) WHERE id = ${userId} RETURNING id, nome, email, biografia, avatar_url`
    return NextResponse.json({ user: rows[0] })
  } catch { return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 }) }
}

export async function PATCH(request: Request) { return PUT(request) }

export async function DELETE(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  try { const sql = getDb(); const rows = await sql`UPDATE usuarios SET avatar_url = '' WHERE id = ${userId} RETURNING id, avatar_url`; return NextResponse.json({ user: rows[0] }) }
  catch { return NextResponse.json({ error: "Erro ao remover avatar" }, { status: 500 }) }
}
