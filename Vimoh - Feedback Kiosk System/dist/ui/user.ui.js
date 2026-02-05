import { fetchAllUsers, removeUser, canGiveFeedback, } from "../services/user.service.js";
import { fetchFeedbackForUser } from "../services/feedback.service.js";
import { handleFeedback } from "./feedback.ui.js";
import { getSessionUser } from "../session.js";
const userList = document.getElementById("userList");
export function renderUsers() {
    userList.innerHTML = "";
    const users = fetchAllUsers();
    users.forEach((user) => {
        var _a, _b;
        // 🔹 Get session user once per card
        const sessionUser = getSessionUser();
        const isAdmin = (sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.role) === "ADMIN";
        // 🔹 Fetch feedback for this user
        const feedbacks = fetchFeedbackForUser(user.id);
        let feedbackHtml = "";
        if (feedbacks.length > 0) {
            feedbackHtml = `
        <hr />
        <h6>Feedback</h6>
        <ul class="list-group list-group-flush">
          ${feedbacks
                .map((fb) => {
                const isOwnReview = fb.submittedBy === (sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.name);
                return `
    <li class="list-group-item ${isOwnReview ? "own-review" : ""}">
      ⭐ ${fb.rating}/5 – ${fb.message}
      <br />
      <small class="text-muted">
        by ${isAdmin ? fb.submittedBy : "Anonymous"}
      </small>
    </li>
  `;
            })
                .join("")}
        </ul>
      `;
        }
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>${user.name}</h5>
          <p>${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
          <p><strong>Status:</strong> ${user.status}</p>

          <div class="d-flex gap-2">
            <button class="btn btn-danger btn-sm delete-btn">
              Delete
            </button>

            <button class="btn btn-secondary btn-sm feedback-btn">
              Give Feedback
            </button>
          </div>

          ${feedbackHtml}
        </div>
      </div>
    `;
        const deleteBtn = card.querySelector(".delete-btn");
        if (!isAdmin) {
            deleteBtn.style.display = "none";
        }
        // 🔹 Status rule — disable feedback if not approved
        const feedbackBtn = card.querySelector(".feedback-btn");
        if (!canGiveFeedback(user.status)) {
            feedbackBtn.disabled = true;
        }
        // 🔹 Delete listener
        (_a = card.querySelector(".delete-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            removeUser(user.id);
            renderUsers();
        });
        // 🔹 Feedback listener
        (_b = card.querySelector(".feedback-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            handleFeedback(user.id);
            renderUsers();
        });
        userList.appendChild(card);
    });
}
