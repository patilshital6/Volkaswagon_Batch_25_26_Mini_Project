
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function getComplaints() {
    return JSON.parse(localStorage.getItem("complaints")) || [];
}

function saveComplaints(data) {
    localStorage.setItem("complaints", JSON.stringify(data));
}


function register() {
    const user = {
        name: regName.value,
        email: regEmail.value,
        password: regPassword.value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration successful");
    window.location.href = "login.html";
}

function login() {
    const user = getUser();

    if (
        user &&
        loginEmail.value === user.email &&
        loginPassword.value === user.password
    ) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}


function adminLogin() {
    if (
        adminEmail.value === "admin@ithelpdesk.com" &&
        adminPassword.value === "admin123"
    ) {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid admin credentials");
    }
}


function adminLogout() {
    localStorage.removeItem("adminLoggedIn"); // remove admin session
    alert("Admin logged out successfully");
    window.location.href = "admin-login.html"; // redirect to admin login page
}



function addComplaint() {
    const issueInput = document.getElementById("issue");
    const priorityInput = document.getElementById("priority");

    if (!issueInput || !priorityInput) return;

    if (issueInput.value.trim() === "") {
        alert("Please describe the issue");
        return;
    }

    const complaints = getComplaints();

    complaints.push({
        issue: issueInput.value,
        priority: priorityInput.value,
        status: "Pending"
    });

    saveComplaints(complaints);

    issueInput.value = "";
    alert("Complaint submitted successfully");

    loadComplaints();
    updateDashboard();
}


function loadComplaints() {
    const table = document.getElementById("complaintTable");
    if (!table) return;

    table.innerHTML = "";

    const complaints = getComplaints();

    complaints.forEach(c => {
        table.innerHTML += `
            <tr>
                <td>${c.issue}</td>
                <td>${c.priority}</td>
                <td>${c.status}</td>
            </tr>
        `;
    });
}


function updateDashboard() {
    const total = document.getElementById("totalCount");
    if (!total) return;

    const complaints = getComplaints();

    document.getElementById("totalCount").innerText = complaints.length;
    document.getElementById("pendingCount").innerText =
        complaints.filter(c => c.status === "Pending").length;
    document.getElementById("resolvedCount").innerText =
        complaints.filter(c => c.status === "Resolved").length;
}


function loadAdminComplaints() {
    const table = document.getElementById("adminComplaintTable");
    if (!table) return;

    table.innerHTML = "";
    const complaints = getComplaints();

    complaints.forEach((c, index) => {
        table.innerHTML += `
            <tr>
                <td>${c.issue}</td>
                <td>${c.priority}</td>
                <td>${c.status}</td>
                <td>
                    ${
                        c.status === "Pending"
                            ? `<button class="btn btn-success btn-sm" onclick="resolveComplaint(${index})">
                                Resolve
                               </button>`
                            : `<span class="text-success">Resolved</span>`
                    }
                </td>
            </tr>
        `;
    });
}


function resolveComplaint(index) {
    const complaints = getComplaints();
    complaints[index].status = "Resolved";
    saveComplaints(complaints);
    loadAdminComplaints();
}


document.addEventListener("DOMContentLoaded", () => {

    const user = getUser();
    if (user && document.getElementById("profileName")) {
        document.getElementById("profileName").innerText = user.name;
        document.getElementById("profileEmail").innerText = user.email;
    }

 
    loadComplaints();
    loadAdminComplaints();
    updateDashboard();
});
