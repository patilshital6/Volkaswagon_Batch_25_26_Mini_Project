var _a, _b;
import { renderUsers } from "./ui/user.ui.js";
import { createUser } from "./services/user.service.js";
import { login, logout, getSessionUser } from "./session.js";
import { registerUser, loginUser } from "./services/auth.Service.js";
// -------------------- UI REFERENCES --------------------
const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const toggleAuth = document.getElementById("toggleAuth");
const usernameInput = document.getElementById("loginUsername");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
let isRegisterMode = false;
// -------------------- INIT --------------------
showLogin();
// -------------------- TOGGLE LOGIN / REGISTER --------------------
toggleAuth.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Register to continue";
        emailInput.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "block";
        toggleAuth.innerHTML = `Already have an account? <b>Login</b>`;
    }
    else {
        authTitle.innerText = "Welcome Back";
        authSubtitle.innerText = "Login to continue";
        emailInput.style.display = "none";
        loginBtn.style.display = "block";
        registerBtn.style.display = "none";
        toggleAuth.innerHTML = `Don’t have an account? <b>Register</b>`;
    }
    loginError.style.display = "none";
});
// -------------------- LOGIN --------------------
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) {
        showError("Please enter username and password");
        return;
    }
    // Head admin
    if (username === "admin" && password === "admin123") {
        login(username, "ADMIN");
        showApp(getSessionUser());
        return;
    }
    const user = loginUser(username, password);
    if (!user) {
        showError("User not registered");
        return;
    }
    login(username, "EMPLOYEE");
    showApp(getSessionUser());
});
// -------------------- REGISTER --------------------
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
    // ✅ SUCCESS MESSAGE
    showError("Registration successful. Please login.", false);
    // Reset fields
    usernameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    // Switch back to login after 1.2s
    setTimeout(() => {
        isRegisterMode = false;
        toggleAuth.click();
    }, 1200);
});
// -------------------- LOGOUT --------------------
(_a = document.getElementById("logoutBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    logout();
    showLogin();
});
// -------------------- ADD USER --------------------
(_b = document.getElementById("addUserBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const roleSelect = document.getElementById("roleSelect");
    const statusSelect = document.getElementById("statusSelect");
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleSelect.value;
    const status = statusSelect.value;
    const msg = document.getElementById("userFormMsg");
    if (!name || !email) {
        msg.innerText = "Please enter name and email";
        msg.className = "text-danger small";
        msg.style.display = "block";
        return;
    }
    const user = createUser(name, email, role, status);
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
// -------------------- UI HELPERS --------------------
function showLogin() {
    loginContainer.style.display = "flex";
    appContainer.style.display = "none";
    loginError.style.display = "none";
}
function showApp(session) {
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    if (session.role === "EMPLOYEE") {
        document.getElementById("userForm").style.display = "none";
    }
    else {
        document.getElementById("userForm").style.display = "block";
    }
    renderUsers();
}
function showError(message, isError = true) {
    loginError.innerText = message;
    loginError.className = isError
        ? "text-danger small mt-2"
        : "text-success small mt-2";
    loginError.style.display = "block";
}
