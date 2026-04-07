const requireAuth = () => {
  /* Implementation of requireAuth */
}
const getAllUsers = () => {
  /* Implementation of getAllUsers */
}
const getPetData = (friendId) => {
  /* Implementation of getPetData */
}
const calculateDailyProgress = (friendId) => {
  /* Implementation of calculateDailyProgress */
}

const user = requireAuth()
const FRIENDS_KEY = "foguinho_friends_"

function getFriends(userId) {
  const key = FRIENDS_KEY + userId
  const friendsJson = localStorage.getItem(key)
  return friendsJson ? JSON.parse(friendsJson) : { friends: [], requests: [] }
}

function saveFriends(userId, friendsData) {
  const key = FRIENDS_KEY + userId
  localStorage.setItem(key, JSON.stringify(friendsData))
}

function searchUsers(query) {
  if (!query) return []
  const allUsers = getAllUsers()
  return allUsers.filter((u) => u.id !== user.id && u.email.toLowerCase().includes(query.toLowerCase()))
}

function sendFriendRequest(toUserId) {
  const friendsData = getFriends(toUserId)

  // Check if already friends or request exists
  if (friendsData.friends.includes(user.id) || friendsData.requests.some((r) => r.from === user.id)) {
    alert("Solicitação já enviada ou já são amigos!")
    return
  }

  friendsData.requests.push({
    from: user.id,
    date: new Date().toISOString(),
  })

  saveFriends(toUserId, friendsData)
  alert("Solicitação enviada!")
}

function acceptFriendRequest(fromUserId) {
  // Add to current user's friends
  const myFriends = getFriends(user.id)
  myFriends.friends.push(fromUserId)
  myFriends.requests = myFriends.requests.filter((r) => r.from !== fromUserId)
  saveFriends(user.id, myFriends)

  // Add to other user's friends
  const theirFriends = getFriends(fromUserId)
  theirFriends.friends.push(user.id)
  saveFriends(fromUserId, theirFriends)

  displayFriends()
  displayRequests()
}

function removeFriend(friendId) {
  if (confirm("Tem certeza que deseja remover este amigo?")) {
    // Remove from current user
    const myFriends = getFriends(user.id)
    myFriends.friends = myFriends.friends.filter((id) => id !== friendId)
    saveFriends(user.id, myFriends)

    // Remove from other user
    const theirFriends = getFriends(friendId)
    theirFriends.friends = theirFriends.friends.filter((id) => id !== user.id)
    saveFriends(friendId, theirFriends)

    displayFriends()
  }
}

function displayFriends() {
  const friendsData = getFriends(user.id)
  const container = document.getElementById("friendsList")
  const allUsers = getAllUsers()

  if (friendsData.friends.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-gray); grid-column: 1/-1;">Nenhum amigo ainda. Busque usuários acima para adicionar!</p>'
    return
  }

  container.innerHTML = friendsData.friends
    .map((friendId) => {
      const friend = allUsers.find((u) => u.id === friendId)
      if (!friend) return ""

      const pet = getPetData(friendId)
      const progress = calculateDailyProgress(friendId)

      return `
            <div class="friend-card">
                <div class="friend-avatar">${friend.name.charAt(0).toUpperCase()}</div>
                <h3>${friend.name}</h3>
                <p class="friend-email">${friend.email}</p>
                <div class="friend-stats">
                    <div class="friend-stat">
                        <div class="friend-stat-value">${pet.level}</div>
                        <div class="friend-stat-label">Nível</div>
                    </div>
                    <div class="friend-stat">
                        <div class="friend-stat-value">${progress}%</div>
                        <div class="friend-stat-label">Hoje</div>
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn btn-danger" onclick="removeFriend('${friendId}')">Remover</button>
                </div>
            </div>
        `
    })
    .join("")
}

function displayRequests() {
  const friendsData = getFriends(user.id)
  const container = document.getElementById("requestsList")
  const allUsers = getAllUsers()

  if (friendsData.requests.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-gray); grid-column: 1/-1;">Nenhuma solicitação pendente.</p>'
    return
  }

  container.innerHTML = friendsData.requests
    .map((request) => {
      const requester = allUsers.find((u) => u.id === request.from)
      if (!requester) return ""

      return `
            <div class="friend-card">
                <div class="friend-avatar">${requester.name.charAt(0).toUpperCase()}</div>
                <h3>${requester.name}</h3>
                <p class="friend-email">${requester.email}</p>
                <div class="friend-actions">
                    <button class="btn btn-success" onclick="acceptFriendRequest('${requester.id}')">Aceitar</button>
                </div>
            </div>
        `
    })
    .join("")
}

// Search functionality
const searchInput = document.getElementById("searchInput")
const searchResults = document.getElementById("searchResults")

searchInput.addEventListener("input", (e) => {
  const query = e.target.value
  const results = searchUsers(query)

  if (query && results.length > 0) {
    searchResults.innerHTML = results
      .map(
        (u) => `
            <div class="friend-card">
                <div class="friend-avatar">${u.name.charAt(0).toUpperCase()}</div>
                <h3>${u.name}</h3>
                <p class="friend-email">${u.email}</p>
                <button class="btn btn-primary" onclick="sendFriendRequest('${u.id}')">Adicionar</button>
            </div>
        `,
      )
      .join("")
  } else if (query) {
    searchResults.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Nenhum usuário encontrado.</p>'
  } else {
    searchResults.innerHTML = ""
  }
})

// Initialize
displayFriends()
displayRequests()
