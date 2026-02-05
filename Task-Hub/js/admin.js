// ===============================
// LOAD USERS & TASKS ON PAGE LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadTasks();
});

// ===============================
// LOAD USERS INTO DROPDOWN
// ===============================
function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const dropdown = document.getElementById("assignedTo");

  dropdown.innerHTML = '<option value="">Select User</option>';

  // ✅ FILTER ONLY NORMAL USERS
  const onlyUsers = users.filter(user => user.role === "user");

  onlyUsers.forEach(user => {
    const option = document.createElement("option");
    option.value = user.email || user.username;
    option.textContent = user.username || user.email;
    dropdown.appendChild(option);
  });
}


// ===============================
// ADD TASK
// ===============================
function addTask() {
  const projectName = document.getElementById("projectName").value;
  const projectDeadline = document.getElementById("projectDeadline").value;
  const taskName = document.getElementById("taskName").value;
  const taskDeadline = document.getElementById("taskDeadline").value;
  const assignedTo = document.getElementById("assignedTo").value;

  if (!projectName || !taskName || !taskDeadline || !assignedTo) {
    alert("Please fill all fields");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    id: Date.now(),
    project: projectName,
    projectDeadline,
    task: taskName,
    taskDeadline,
    assignedTo,
    status: "Pending"
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// ===============================
// LOAD TASKS
// ===============================
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(t => {
    const overdue =
      t.taskDeadline < today && t.status !== "Completed"
        ? "text-danger fw-bold"
        : "";

    taskList.innerHTML += `
      <li class="list-group-item">
        <b>${t.project}</b> (Project Deadline: ${t.projectDeadline || "N/A"})<br>
        Task: ${t.task} (<span class="${overdue}">${t.taskDeadline}</span>)<br>
        Assigned To: ${t.assignedTo}<br>
        Status: ${t.status}<br>
        <button class="btn btn-sm btn-warning mt-1" onclick="editTask(${t.id})">Edit</button>
        <button class="btn btn-sm btn-danger mt-1" onclick="deleteTask(${t.id})">Delete</button>
      </li>
    `;
  });
}

// ===============================
// EDIT TASK
// ===============================
function editTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(t => t.id === id);

  if (!task) return;

  const projectName = prompt("Project Name:", task.project);
  const taskName = prompt("Task Name:", task.task);
  const projectDeadline = prompt("Project Deadline:", task.projectDeadline);
  const taskDeadline = prompt("Task Deadline:", task.taskDeadline);
  const assignedTo = prompt("Assigned User:", task.assignedTo);

  if (projectName) task.project = projectName;
  if (taskName) task.task = taskName;
  if (projectDeadline) task.projectDeadline = projectDeadline;
  if (taskDeadline) task.taskDeadline = taskDeadline;
  if (assignedTo) task.assignedTo = assignedTo;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// ===============================
// DELETE TASK
// ===============================
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}
