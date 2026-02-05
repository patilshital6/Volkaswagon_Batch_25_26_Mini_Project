let user = JSON.parse(localStorage.getItem("currentUser"));
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let today = new Date().toISOString().split("T")[0];

myTasks.innerHTML = "";

tasks.filter(t => t.assignedTo === user.email).forEach(t => {
  let overdue = t.taskDeadline < today && t.status !== "Completed" ? "text-danger fw-bold" : "";
  myTasks.innerHTML += `
    <li class="list-group-item">
      <b>${t.project}</b><br>
      ${t.task}<br>
      Deadline: <span class="${overdue}">${t.taskDeadline}</span>
      <select class="form-select mt-2" onchange="updateStatus(${t.id},this.value)">
        <option ${t.status==="Pending"?"selected":""}>Pending</option>
        <option ${t.status==="In Progress"?"selected":""}>In Progress</option>
        <option ${t.status==="Completed"?"selected":""}>Completed</option>
      </select>
    </li>`;
});

function updateStatus(id, status) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.find(t => t.id === id).status = status;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
