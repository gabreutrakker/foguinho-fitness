// Pet management utilities
export interface Pet {
  usuarioId: string
  nome: string
  nivel: number
  experiencia: number
  energia: number
  felicidade: number
  estagio: "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"
  ultimaAlimentacao: string
}

// Get pet for current user
export function getPet(userId: string): Pet | null {
  if (typeof window === "undefined") return null

  const petsStr = localStorage.getItem("foguinho_pets")
  if (!petsStr) return null

  const pets: Pet[] = JSON.parse(petsStr)
  return pets.find((p) => p.usuarioId === userId) || null
}

// Update pet (creates if not exists)
export function updatePet(userId: string, updates: Partial<Pet>): Pet {
  const petsStr = localStorage.getItem("foguinho_pets")
  const pets: Pet[] = petsStr ? JSON.parse(petsStr) : []

  let petIndex = pets.findIndex((p) => p.usuarioId === userId)
  
  // Create pet if doesn't exist
  if (petIndex === -1) {
    const newPet: Pet = {
      usuarioId: userId,
      nome: "Foguinho",
      nivel: 1,
      experiencia: 0,
      energia: 100,
      felicidade: 100,
      estagio: "bebe",
      ultimaAlimentacao: new Date().toISOString(),
      ...updates
    }
    pets.push(newPet)
    localStorage.setItem("foguinho_pets", JSON.stringify(pets))
    return newPet
  }

  pets[petIndex] = { ...pets[petIndex], ...updates }
  localStorage.setItem("foguinho_pets", JSON.stringify(pets))

  return pets[petIndex]
}

// Create a new pet for user
export function createPet(userId: string, nome: string = "Foguinho"): Pet {
  const petsStr = localStorage.getItem("foguinho_pets")
  const pets: Pet[] = petsStr ? JSON.parse(petsStr) : []

  const newPet: Pet = {
    usuarioId: userId,
    nome,
    nivel: 1,
    experiencia: 0,
    energia: 100,
    felicidade: 100,
    estagio: "bebe",
    ultimaAlimentacao: new Date().toISOString(),
  }

  pets.push(newPet)
  localStorage.setItem("foguinho_pets", JSON.stringify(pets))

  return newPet
}

// Get or create pet for user
export function getOrCreatePet(userId: string): Pet {
  let pet = getPet(userId)
  if (!pet) {
    pet = createPet(userId)
  }
  return pet
}

// Add experience and level up if needed
export function addExperience(userId: string, xp: number): { pet: Pet; leveledUp: boolean; newStage?: string } {
  const pet = getOrCreatePet(userId)
  if (!pet) return { pet: createPet(userId), leveledUp: false }

  let newExperience = pet.experiencia + xp
  let newLevel = pet.nivel
  let leveledUp = false
  let newStage = pet.estagio

  // Level up logic: 100 XP per level
  while (newExperience >= 100) {
    newExperience -= 100
    newLevel++
    leveledUp = true
  }

  // Stage evolution based on level
  if (newLevel >= 20 && pet.estagio !== "lendario") {
    newStage = "lendario"
  } else if (newLevel >= 15 && pet.estagio !== "adulto" && pet.estagio !== "lendario") {
    newStage = "adulto"
  } else if (
    newLevel >= 10 &&
    pet.estagio !== "adolescente" &&
    pet.estagio !== "adulto" &&
    pet.estagio !== "lendario"
  ) {
    newStage = "adolescente"
  } else if (newLevel >= 5 && pet.estagio === "bebe") {
    newStage = "crianca"
  }

  const updatedPet = updatePet(userId, {
    experiencia: newExperience,
    nivel: newLevel,
    estagio: newStage,
  })!

  return {
    pet: updatedPet,
    leveledUp,
    newStage: newStage !== pet.estagio ? newStage : undefined,
  }
}

// Update pet stats (energia, felicidade)
export function updatePetStats(userId: string, energia?: number, felicidade?: number): Pet | null {
  const updates: Partial<Pet> = {}

  if (energia !== undefined) {
    updates.energia = Math.max(0, Math.min(100, energia))
  }

  if (felicidade !== undefined) {
    updates.felicidade = Math.max(0, Math.min(100, felicidade))
  }

  return updatePet(userId, updates)
}

// Feed pet (restore energy and happiness)
export function feedPet(userId: string): Pet {
  const pet = getOrCreatePet(userId)

  return updatePet(userId, {
    energia: Math.min(100, pet.energia + 20),
    felicidade: Math.min(100, pet.felicidade + 15),
    ultimaAlimentacao: new Date().toISOString(),
  })
}

// Get pet stage info
export function getPetStageInfo(estagio: Pet["estagio"]) {
  const stages = {
    bebe: {
      nome: "Bebê",
      descricao: "Seu Foguinho está começando sua jornada!",
      cor: "from-orange-400 to-yellow-400",
      tamanho: "w-24 h-24",
    },
    crianca: {
      nome: "Criança",
      descricao: "Seu Foguinho está crescendo forte!",
      cor: "from-orange-500 to-red-400",
      tamanho: "w-32 h-32",
    },
    adolescente: {
      nome: "Adolescente",
      descricao: "Seu Foguinho está ficando poderoso!",
      cor: "from-red-500 to-pink-500",
      tamanho: "w-40 h-40",
    },
    adulto: {
      nome: "Adulto",
      descricao: "Seu Foguinho atingiu a maturidade!",
      cor: "from-red-600 to-purple-500",
      tamanho: "w-48 h-48",
    },
    lendario: {
      nome: "Lendário",
      descricao: "Seu Foguinho é uma lenda viva!",
      cor: "from-purple-600 to-pink-600",
      tamanho: "w-56 h-56",
    },
  }

  return stages[estagio]
}
