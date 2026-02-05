function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("chefUser", JSON.stringify({ name, email, password }));
  alert("Signup successful!");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem("chefUser"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("chefLoggedIn", "true");
  window.location.href = "index.html";
}
