import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  try {
    const sql = getDb()
    const search = new URL(request.url).searchParams.get("search")?.trim()
    if (search) {
      const users = await sql`SELECT id, nome, email, biografia, avatar_url FROM usuarios WHERE (LOWER(email) = LOWER(${search}) OR LOWER(nome) LIKE LOWER(${`%${search}%`})) AND id <> ${userId} ORDER BY nome LIMIT 20`
      return NextResponse.json({ users })
    }
    const friends = await sql`SELECT a.id, a.status, a.data_solicitacao, u.id AS amigo_id, u.nome, u.email, u.biografia, u.avatar_url, COALESCE(p.nivel, 1) AS nivel, COALESCE(p.experiencia, 0) AS experiencia, COALESCE(p.nome, 'Pet') AS pet_nome, COALESCE((SELECT COUNT(*) FROM progresso pr WHERE pr.usuario_id = u.id AND pr.completado = true), 0) AS metas_completadas FROM amigos a JOIN usuarios u ON u.id = CASE WHEN a.usuario_id = ${userId} THEN a.amigo_id ELSE a.usuario_id END LEFT JOIN pet p ON p.usuario_id = u.id WHERE (a.usuario_id = ${userId} OR a.amigo_id = ${userId}) AND a.status = 'aceito' ORDER BY u.nome`
    const requests = await sql`SELECT a.id, a.data_solicitacao, u.id AS usuario_id, u.nome, u.email, u.biografia, u.avatar_url FROM amigos a JOIN usuarios u ON u.id = a.usuario_id WHERE a.amigo_id = ${userId} AND a.status = 'pendente' ORDER BY a.data_solicitacao DESC`
    const sent = await sql`SELECT a.id, a.data_solicitacao, u.id AS amigo_id, u.nome, u.email FROM amigos a JOIN usuarios u ON u.id = a.amigo_id WHERE a.usuario_id = ${userId} AND a.status = 'pendente' ORDER BY a.data_solicitacao DESC`
    return NextResponse.json({ friends, requests, sent })
  } catch { return NextResponse.json({ error: "Erro ao buscar amigos" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const sql = getDb(); const { userId, friendEmail, friendId } = await request.json()
    const users = friendId ? await sql`SELECT id FROM usuarios WHERE id = ${friendId}` : await sql`SELECT id FROM usuarios WHERE LOWER(email) = LOWER(${friendEmail}) OR LOWER(nome) = LOWER(${friendEmail})`
    if (!users.length) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    const targetId = users[0].id
    if (String(targetId) === String(userId)) return NextResponse.json({ error: "Você não pode adicionar a si mesmo" }, { status: 400 })
    const existing = await sql`SELECT id, status FROM amigos WHERE (usuario_id = ${userId} AND amigo_id = ${targetId}) OR (usuario_id = ${targetId} AND amigo_id = ${userId})`
    if (existing.length) return NextResponse.json({ error: existing[0].status === 'aceito' ? "Vocês já são amigos" : "Solicitação já existe" }, { status: 409 })
    const result = await sql`INSERT INTO amigos (usuario_id, amigo_id, status) VALUES (${userId}, ${targetId}, 'pendente') RETURNING *`
    return NextResponse.json({ friend: result[0] }, { status: 201 })
  } catch { return NextResponse.json({ error: "Erro ao enviar pedido" }, { status: 500 }) }
}

export async function PUT(request: Request) {
  try { const sql = getDb(); const { id, userId, status } = await request.json(); const result = await sql`UPDATE amigos SET status = ${status} WHERE id = ${id} AND (amigo_id = ${userId} OR usuario_id = ${userId}) RETURNING *`; return NextResponse.json({ friend: result[0] }) }
  catch { return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 }) }
}

export async function DELETE(request: Request) {
  try { const sql = getDb(); const { searchParams } = new URL(request.url); const id = searchParams.get("id"); const userId = searchParams.get("userId"); if (!id || !userId) return NextResponse.json({ error: "id e userId são obrigatórios" }, { status: 400 }); await sql`DELETE FROM amigos WHERE id = ${id} AND (usuario_id = ${userId} OR amigo_id = ${userId})`; return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: "Erro ao remover amigo" }, { status: 500 }) }
}
