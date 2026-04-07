// Declare necessary variables or import them
function requireAuth() {
  // Placeholder for authentication logic
  return { id: 1, name: "John Doe", email: "john.doe@example.com" }
}

function getGoals(userId) {
  // Placeholder for getting goals logic
  return [{ id: 1, name: "Goal 1", target: 10, active: true }]
}

function getFriends(userId) {
  // Placeholder for getting friends logic
  return { friends: [{ id: 1, name: "Friend 1" }] }
}

function getTodayProgress(userId) {
  // Placeholder for getting today's progress logic
  return { 1: 10 }
}

function getPetData(userId) {
  // Placeholder for getting pet data logic
  return { level: 5 }
}

function calculateDailyProgress(userId) {
  // Placeholder for calculating daily progress logic
  return 100
}

const user = requireAuth()

function displayProfile() {
  document.getElementById("profileName").textContent = user.name
  document.getElementById("profileEmail").textContent = user.email
  document.getElementById("profileInitial").textContent = user.name.charAt(0).toUpperCase()

  // Calculate stats
  const goals = getGoals(user.id)
  const activeGoals = goals.filter((g) => g.active)
  const friendsData = getFriends(user.id)

  // Count completed goals (simplified - counts today's completed goals)
  const progress = getTodayProgress(user.id)
  let completedToday = 0
  activeGoals.forEach((goal) => {
    const current = progress[goal.id] || 0
    if (current >= goal.target) completedToday++
  })

  document.getElementById("totalGoals").textContent = goals.length
  document.getElementById("completedGoals").textContent = completedToday
  document.getElementById("currentStreak").textContent = calculateStreak(user.id)
  document.getElementById("totalFriends").textContent = friendsData.friends.length
}

function calculateStreak(userId) {
  // Simplified streak calculation
  // In a real app, you'd check multiple days
  const progress = getTodayProgress(userId)
  const goals = getGoals(userId).filter((g) => g.active)

  if (goals.length === 0) return 0

  let completed = 0
  goals.forEach((goal) => {
    const current = progress[goal.id] || 0
    if (current >= goal.target) completed++
  })

  return completed === goals.length ? 1 : 0
}

function getAchievements(userId) {
  const goals = getGoals(userId)
  const pet = getPetData(userId)
  const friendsData = getFriends(userId)
  const progress = getTodayProgress(userId)

  const achievements = [
    {
      id: "first_goal",
      name: "Primeira Meta",
      description: "Crie sua primeira meta",
      icon: "🎯",
      unlocked: goals.length > 0,
    },
    {
      id: "perfect_day",
      name: "Dia Perfeito",
      description: "Complete todas as metas do dia",
      icon: "⭐",
      unlocked: calculateDailyProgress(userId) === 100,
    },
    {
      id: "level_5",
      name: "Nível 5",
      description: "Alcance o nível 5 com seu pet",
      icon: "🔥",
      unlocked: pet.level >= 5,
    },
    {
      id: "level_10",
      name: "Nível 10",
      description: "Alcance o nível 10 com seu pet",
      icon: "💪",
      unlocked: pet.level >= 10,
    },
    {
      id: "social",
      name: "Social",
      description: "Adicione seu primeiro amigo",
      icon: "👥",
      unlocked: friendsData.friends.length > 0,
    },
    {
      id: "popular",
      name: "Popular",
      description: "Tenha 5 amigos",
      icon: "🌟",
      unlocked: friendsData.friends.length >= 5,
    },
  ]

  return achievements
}

function displayAchievements() {
  const achievements = getAchievements(user.id)
  const container = document.getElementById("achievementsList")

  container.innerHTML = achievements
    .map(
      (achievement) => `
        <div class="achievement-card ${achievement.unlocked ? "" : "locked"}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `,
    )
    .join("")
}

// Initialize
displayProfile()
displayAchievements()
