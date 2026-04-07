const PROGRESS_KEY = "foguinho_progress_"
const GOALS_KEY = "foguinho_goals_"

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

function getTodayProgress(userId) {
  const key = PROGRESS_KEY + userId + "_" + getTodayKey()
  const progressJson = localStorage.getItem(key)
  return progressJson ? JSON.parse(progressJson) : {}
}

function saveTodayProgress(userId, progress) {
  const key = PROGRESS_KEY + userId + "_" + getTodayKey()
  localStorage.setItem(key, JSON.stringify(progress))
}

function updateGoalProgress(userId, goalId, current) {
  const progress = getTodayProgress(userId)
  progress[goalId] = current
  saveTodayProgress(userId, progress)

  // Check if goal is completed
  const goals = getGoals(userId)
  const goal = goals.find((g) => g.id === goalId)

  if (goal && current >= goal.target) {
    // Reward the pet
    addXP(userId, 20)
    updateHappiness(userId, 5)
  }
}

function calculateDailyProgress(userId) {
  const goals = getGoals(userId).filter((g) => g.active)
  if (goals.length === 0) return 0

  const progress = getTodayProgress(userId)
  let completed = 0

  goals.forEach((goal) => {
    const current = progress[goal.id] || 0
    if (current >= goal.target) {
      completed++
    }
  })

  return Math.round((completed / goals.length) * 100)
}

function displayDailyProgress(userId) {
  const percent = calculateDailyProgress(userId)
  document.getElementById("progressPercent").textContent = `${percent}%`

  // Update circle
  const circle = document.getElementById("progressRing")
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (percent / 100) * circumference
  circle.style.strokeDashoffset = offset
}

function displayGoalsProgress(userId) {
  const goals = getGoals(userId).filter((g) => g.active)
  const progress = getTodayProgress(userId)
  const container = document.getElementById("goalsList")

  if (goals.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-gray);">Nenhuma meta ativa. <a href="goals.html">Adicione metas</a> para começar!</p>'
    return
  }

  container.innerHTML = goals
    .map((goal) => {
      const current = progress[goal.id] || 0
      const isCompleted = current >= goal.target
      const icon = getGoalIcon(goal.type)

      return `
            <div class="goal-item">
                <div class="goal-info">
                    <span class="goal-icon">${icon}</span>
                    <div class="goal-details">
                        <h4>${goal.name}</h4>
                        <p class="goal-progress-text">${current} / ${goal.target} ${goal.unit}</p>
                    </div>
                </div>
                <div class="goal-actions">
                    ${
                      !isCompleted
                        ? `
                        <button onclick="incrementGoal('${goal.id}', ${goal.target})" class="btn-success">+</button>
                        <button onclick="decrementGoal('${goal.id}')" class="btn-secondary">-</button>
                    `
                        : '<span style="color: var(--success); font-weight: bold;">✓ Completo</span>'
                    }
                </div>
            </div>
        `
    })
    .join("")
}

function incrementGoal(goalId, target) {
  const user = getCurrentUser()
  const progress = getTodayProgress(user.id)
  const current = (progress[goalId] || 0) + 1

  if (current <= target) {
    updateGoalProgress(user.id, goalId, current)
    displayGoalsProgress(user.id)
    displayDailyProgress(user.id)
    displayPet(user.id)
  }
}

function decrementGoal(goalId) {
  const user = getCurrentUser()
  const progress = getTodayProgress(user.id)
  const current = Math.max(0, (progress[goalId] || 0) - 1)

  updateGoalProgress(user.id, goalId, current)
  displayGoalsProgress(user.id)
  displayDailyProgress(user.id)
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

function getGoals(userId) {
  const key = GOALS_KEY + userId
  const goalsJson = localStorage.getItem(key)
  return goalsJson ? JSON.parse(goalsJson) : []
}

// Declare the undeclared variables
function addXP(userId, xp) {
  // Implementation for adding XP to the user
  console.log(`Added ${xp} XP to user ${userId}`)
}

function updateHappiness(userId, happiness) {
  // Implementation for updating happiness of the user
  console.log(`Updated happiness by ${happiness} for user ${userId}`)
}

function getCurrentUser() {
  // Implementation for getting the current user
  return { id: "user123" } // Example user object
}

function displayPet(userId) {
  // Implementation for displaying the pet
  console.log(`Displaying pet for user ${userId}`)
}
