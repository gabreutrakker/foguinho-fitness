const PET_KEY = "foguinho_pet_"

function getPetData(userId) {
  const key = PET_KEY + userId
  const petJson = localStorage.getItem(key)

  if (petJson) {
    return JSON.parse(petJson)
  }

  // Initialize new pet
  const newPet = {
    name: "Foguinho",
    level: 1,
    xp: 0,
    happiness: 80,
    energy: 100,
    stage: "baby",
  }

  savePetData(userId, newPet)
  return newPet
}

function savePetData(userId, petData) {
  const key = PET_KEY + userId
  localStorage.setItem(key, JSON.stringify(petData))
}

function getPetStage(level) {
  if (level >= 20) return { name: "Lendário", emoji: "🔥✨" }
  if (level >= 15) return { name: "Épico", emoji: "🔥⚡" }
  if (level >= 10) return { name: "Adulto", emoji: "🔥💪" }
  if (level >= 5) return { name: "Jovem", emoji: "🔥😊" }
  return { name: "Bebê", emoji: "🔥" }
}

function addXP(userId, amount) {
  const pet = getPetData(userId)
  pet.xp += amount

  // Level up logic
  const xpNeeded = pet.level * 100
  if (pet.xp >= xpNeeded) {
    pet.level++
    pet.xp = pet.xp - xpNeeded
    pet.happiness = Math.min(100, pet.happiness + 10)
  }

  savePetData(userId, pet)
  return pet
}

function updateHappiness(userId, amount) {
  const pet = getPetData(userId)
  pet.happiness = Math.max(0, Math.min(100, pet.happiness + amount))
  savePetData(userId, pet)
  return pet
}

function decreaseEnergy(userId) {
  const pet = getPetData(userId)
  pet.energy = Math.max(0, pet.energy - 10)
  savePetData(userId, pet)
  return pet
}

function displayPet(userId) {
  const pet = getPetData(userId)
  const stage = getPetStage(pet.level)

  document.getElementById("petName").textContent = pet.name
  document.getElementById("petLevel").textContent = pet.level
  document.getElementById("petEmoji").textContent = stage.emoji
  document.getElementById("petStage").textContent = stage.name

  const xpNeeded = pet.level * 100
  const xpPercent = (pet.xp / xpNeeded) * 100

  document.getElementById("happinessValue").textContent = `${pet.happiness}/100`
  document.getElementById("happinessBar").style.width = `${pet.happiness}%`

  document.getElementById("energyValue").textContent = `${pet.energy}/100`
  document.getElementById("energyBar").style.width = `${pet.energy}%`

  document.getElementById("xpValue").textContent = `${pet.xp}/${xpNeeded}`
  document.getElementById("xpBar").style.width = `${xpPercent}%`
}
