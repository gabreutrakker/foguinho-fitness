export interface User {
  id: number
  nome: string
  email: string
  data_criacao: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Get current user from localStorage (session management)
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("foguinho_user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Login user via API
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Erro ao fazer login" }
    }

    // Store user in localStorage for session
    localStorage.setItem("foguinho_user", JSON.stringify(data.user))

    return { success: true, user: data.user }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}

// Register new user via API
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Erro ao criar conta" }
    }

    // Store user in localStorage for session
    localStorage.setItem("foguinho_user", JSON.stringify(data.user))

    return { success: true, user: data.user }
  } catch (error) {
    console.error("[v0] Register error:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}

// Logout user
export function logout() {
  localStorage.removeItem("foguinho_user")
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
