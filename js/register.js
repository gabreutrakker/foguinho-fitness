document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Declare the registerUser function or import it
  function registerUser(name, email, password) {
    // Placeholder for registerUser logic
    return { success: true, user: { name, email } }
  }

  // Declare the setCurrentUser function or import it
  function setCurrentUser(user) {
    // Placeholder for setCurrentUser logic
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  const result = registerUser(name, email, password)

  if (result.success) {
    setCurrentUser(result.user)
    window.location.href = "home.html"
  } else {
    alert(result.message)
  }
})
