document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const loginUser = (email, password) => {
    // Placeholder for loginUser function implementation
    return { success: true, message: "" } // Example return value
  }

  const result = loginUser(email, password)

  if (result.success) {
    window.location.href = "home.html"
  } else {
    alert(result.message)
  }
})
