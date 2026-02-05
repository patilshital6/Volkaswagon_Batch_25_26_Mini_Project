function signup() {
  // Get input values correctly
  let userName = document.getElementById("name").value;
  let userEmail = document.getElementById("email").value;
  let userPassword = document.getElementById("password").value;
  let userRole = document.getElementById("role").value;

  if (!userName || !userEmail || !userPassword) {
    return alert("Please fill all fields");
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Optional: Check for duplicate email
  if (users.some(u => u.email === userEmail)) {
    return alert("User with this email already exists");
  }

  users.push({
    name: userName,
    email: userEmail,
    password: userPassword,
    role: userRole
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
  location.href = "index.html";
}

function login() {
  let userEmail = document.getElementById("email").value;
  let userPassword = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === userEmail && u.password === userPassword);

  if (!user) {
    return alert("Invalid email or password");
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  location.href = user.role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
}
