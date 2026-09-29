import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
  try { const sql = getDb(); const notifications = await sql`SELECT a.id, a.status, a.data_solicitacao, u.id AS usuario_id, u.nome, u.email, u.biografia, u.avatar_url FROM amigos a JOIN usuarios u ON u.id = a.usuario_id WHERE a.amigo_id = ${userId} AND a.status = 'pendente' ORDER BY a.data_solicitacao DESC`; return NextResponse.json({ notifications }) }
  catch { return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 }) }
}
