const requireAuth = () => {
  // Implementation of requireAuth function
  return { name: "John Doe", id: 123 }
}

const displayPet = (userId) => {
  // Implementation of displayPet function
  console.log(`Displaying pet for user ${userId}`)
}

const displayDailyProgress = (userId) => {
  // Implementation of displayDailyProgress function
  console.log(`Displaying daily progress for user ${userId}`)
}

const displayGoalsProgress = (userId) => {
  // Implementation of displayGoalsProgress function
  console.log(`Displaying goals progress for user ${userId}`)
}

const user = requireAuth()

if (user) {
  document.getElementById("userName").textContent = user.name
  displayPet(user.id)
  displayDailyProgress(user.id)
  displayGoalsProgress(user.id)
}
