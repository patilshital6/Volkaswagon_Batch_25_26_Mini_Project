import { renderUsers } from "./ui/user.ui.js";
import { createUser } from "./services/user.service.js";
import { login, logout, getSessionUser } from "./session.js";
import { registerUser, loginUser } from "./services/auth.Service.js";

// -------------------- UI REFERENCES -------------------- //
const loginContainer = document.getElementById("loginContainer") as HTMLElement;
const appContainer = document.getElementById("appContainer") as HTMLElement;

const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const registerBtn = document.getElementById("registerBtn") as HTMLButtonElement;
const toggleAuth = document.getElementById("toggleAuth") as HTMLElement;

const usernameInput = document.getElementById("loginUsername") as HTMLInputElement;
const emailInput = document.getElementById("loginEmail") as HTMLInputElement;
const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
const loginError = document.getElementById("loginError") as HTMLElement;

const authTitle = document.getElementById("authTitle") as HTMLElement;
const authSubtitle = document.getElementById("authSubtitle") as HTMLElement;

let isRegisterMode = false;

// -------------------- INIT -------------------- //
showLogin();

// -------------------- LOGIN / REGISTER -------------------- //
toggleAuth.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;

  if (isRegisterMode) {
    authTitle.innerText = "Create Account";
    authSubtitle.innerText = "Register to continue";
    emailInput.style.display = "block";
    loginBtn.style.display = "none";
    registerBtn.style.display = "block";
    toggleAuth.innerHTML = `Already have an account? <b>Login</b>`;
  } else {
    authTitle.innerText = "Welcome Back";
    authSubtitle.innerText = "Login to continue";
    emailInput.style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "none";
    toggleAuth.innerHTML = `Don’t have an account? <b>Register</b>`;
  }

  loginError.style.display = "none";
});

// -------------------- LOGIN -------------------- //
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  //Head admin (privileges)
  if (username === "admin" && password === "admin123") {
    login(username, "ADMIN");
    showApp(getSessionUser()!);
    return;
  }

  const user = loginUser(username, password);
  if (!user) {
    showError("User not registered");
    return;
  }

  login(username, "EMPLOYEE");
  showApp(getSessionUser()!);
});

// -------------------- REGISTER -------------------- //
registerBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !email || !password) {
    showError("Please fill all fields");
    return;
  }

  if (!email.includes("@")) {
    showError("Enter a valid email address");
    return;
  }

  if (username === "admin") {
    showError("Admin cannot be registered");
    return;
  }

  const success = registerUser(username, password, email);

  if (!success) {
    showError("User with this email or username already exists");
    return;
  }

  //Success Msg
  showError("Registration successful. Please login.", false);

  //Resetting fields
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";

  //Switch back to login after 1.2s(might)
  setTimeout(() => {
    isRegisterMode = false;
    toggleAuth.click();
  }, 1200);
});

// -------------------- LOGOUT -------------------- //
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  logout();
  showLogin();
});

// -------------------- ADD USER -------------------- //
document.getElementById("addUserBtn")?.addEventListener("click", () => {
  const nameInput = document.getElementById("nameInput") as HTMLInputElement;
  const emailInput = document.getElementById("emailInput") as HTMLInputElement;
  const roleSelect = document.getElementById("roleSelect") as HTMLSelectElement;
  const statusSelect = document.getElementById("statusSelect") as HTMLSelectElement;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleSelect.value;
  const status = statusSelect.value;

  const msg = document.getElementById("userFormMsg") as HTMLElement;

  if (!name || !email) {
    msg.innerText = "Please enter name and email";
    msg.className = "text-danger small";
    msg.style.display = "block";
    return;
  }

  const user = createUser(name, email, role as any, status as any);
  
  if (!user) {
  msg.innerText = "User with this email already exists";
  msg.className = "text-danger small";
  msg.style.display = "block";
  return;
}
  if (user) {
    msg.innerText = "User added successfully";
    msg.className = "text-success small";
    msg.style.display = "block";
    renderUsers();
    nameInput.value = "";
    emailInput.value = "";
  }
});

// -------------------- UI HELPERS -------------------- //
function showLogin() {
  loginContainer.style.display = "flex";
  appContainer.style.display = "none";
  loginError.style.display = "none";
}

function showApp(session: any) {
  loginContainer.style.display = "none";
  appContainer.style.display = "block";

  if (session.role === "EMPLOYEE") {
    document.getElementById("userForm")!.style.display = "none";
  } else {
    document.getElementById("userForm")!.style.display = "block";
  }

  renderUsers();
}

function showError(message: string, isError: boolean = true) {
  loginError.innerText = message;
  loginError.className = isError
    ? "text-danger small mt-2"
    : "text-success small mt-2";
  loginError.style.display = "block";
}
