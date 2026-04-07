const requireAuth = () => ({ id: "user123" }) // Mock implementation for requireAuth
const user = requireAuth()

function getGoals(userId) {
  const key = "foguinho_goals_" + userId
  const goalsJson = localStorage.getItem(key)
  return goalsJson ? JSON.parse(goalsJson) : []
}

function saveGoals(userId, goals) {
  const key = "foguinho_goals_" + userId
  localStorage.setItem(key, JSON.stringify(goals))
}

function displayGoals() {
  const goals = getGoals(user.id)
  const container = document.getElementById("goalsContainer")

  if (goals.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-gray); grid-column: 1/-1;">Nenhuma meta criada ainda. Clique em "Nova Meta" para começar!</p>'
    return
  }

  container.innerHTML = goals
    .map((goal) => {
      const icon = getGoalIcon(goal.type)
      return `
            <div class="goal-card">
                <div class="goal-card-header">
                    <span class="goal-type-badge">${icon}</span>
                    <div class="goal-card-actions">
                        <button class="icon-btn" onclick="editGoal('${goal.id}')" title="Editar">✏️</button>
                        <button class="icon-btn" onclick="toggleGoal('${goal.id}')" title="${goal.active ? "Desativar" : "Ativar"}">${goal.active ? "⏸️" : "▶️"}</button>
                        <button class="icon-btn" onclick="deleteGoal('${goal.id}')" title="Excluir">🗑️</button>
                    </div>
                </div>
                <h3>${goal.name}</h3>
                <p class="goal-target">Meta: ${goal.target} ${goal.unit}/dia</p>
                <span class="goal-status ${goal.active ? "active" : "inactive"}">
                    ${goal.active ? "Ativa" : "Inativa"}
                </span>
            </div>
        `
    })
    .join("")
}

function getGoalIcon(type) {
  const icons = {
    water: "💧",
    exercise: "🏃",
    study: "📚",
    sleep: "😴",
    food: "🥗",
    meditation: "🧘",
    other: "✨",
  }
  return icons[type] || "✨"
}

// Modal functions
const modal = document.getElementById("goalModal")
const addGoalBtn = document.getElementById("addGoalBtn")
const closeModal = document.getElementById("closeModal")
const cancelBtn = document.getElementById("cancelBtn")
const goalForm = document.getElementById("goalForm")

addGoalBtn.addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Nova Meta"
  goalForm.reset()
  document.getElementById("goalId").value = ""
  modal.classList.add("active")
})

closeModal.addEventListener("click", () => {
  modal.classList.remove("active")
})

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active")
})

goalForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const goalId = document.getElementById("goalId").value
  const name = document.getElementById("goalName").value
  const type = document.getElementById("goalType").value
  const target = Number.parseInt(document.getElementById("goalTarget").value)
  const unit = document.getElementById("goalUnit").value

  const goals = getGoals(user.id)

  if (goalId) {
    // Edit existing goal
    const index = goals.findIndex((g) => g.id === goalId)
    if (index !== -1) {
      goals[index] = { ...goals[index], name, type, target, unit }
    }
  } else {
    // Create new goal
    const newGoal = {
      id: Date.now().toString(),
      name,
      type,
      target,
      unit,
      active: true,
      createdAt: new Date().toISOString(),
    }
    goals.push(newGoal)
  }

  saveGoals(user.id, goals)
  displayGoals()
  modal.classList.remove("active")
})

function editGoal(goalId) {
  const goals = getGoals(user.id)
  const goal = goals.find((g) => g.id === goalId)

  if (goal) {
    document.getElementById("modalTitle").textContent = "Editar Meta"
    document.getElementById("goalId").value = goal.id
    document.getElementById("goalName").value = goal.name
    document.getElementById("goalType").value = goal.type
    document.getElementById("goalTarget").value = goal.target
    document.getElementById("goalUnit").value = goal.unit
    modal.classList.add("active")
  }
}

function toggleGoal(goalId) {
  const goals = getGoals(user.id)
  const goal = goals.find((g) => g.id === goalId)

  if (goal) {
    goal.active = !goal.active
    saveGoals(user.id, goals)
    displayGoals()
  }
}

function deleteGoal(goalId) {
  if (confirm("Tem certeza que deseja excluir esta meta?")) {
    const goals = getGoals(user.id).filter((g) => g.id !== goalId)
    saveGoals(user.id, goals)
    displayGoals()
  }
}

// Initialize
displayGoals()
