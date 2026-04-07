// Authentication utilities
const AUTH_KEY = "foguinho_current_user"
const USERS_KEY = "foguinho_users"

function getCurrentUser() {
  const userJson = localStorage.getItem(AUTH_KEY)
  return userJson ? JSON.parse(userJson) : null
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

function logout() {
  localStorage.removeItem(AUTH_KEY)
  window.location.href = "index.html"
}

function getAllUsers() {
  const usersJson = localStorage.getItem(USERS_KEY)
  return usersJson ? JSON.parse(usersJson) : []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function registerUser(name, email, password) {
  const users = getAllUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, message: "Email já cadastrado!" }
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production, this should be hashed!
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, user: newUser }
}

function loginUser(email, password) {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    setCurrentUser(user)
    return { success: true, user }
  }

  return { success: false, message: "Email ou senha incorretos!" }
}

function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = "index.html"
    return null
  }
  return user
}

// Setup logout button on all pages
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
})
