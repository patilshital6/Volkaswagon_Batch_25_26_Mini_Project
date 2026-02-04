import {
  fetchAllUsers,
  removeUser,
  canGiveFeedback,
} from "../services/user.service.js";
import { fetchFeedbackForUser } from "../services/feedback.service.js";
import { handleFeedback } from "./feedback.ui.js";
import { getSessionUser } from "../session.js";

const userList = document.getElementById("userList") as HTMLElement;

export function renderUsers(): void {
  userList.innerHTML = "";

  const users = fetchAllUsers();

  users.forEach((user) => {
    //Get session user once per card
    const sessionUser = getSessionUser();
    const isAdmin = sessionUser?.role === "ADMIN";

    //Fetch feedback for user
    const feedbacks = fetchFeedbackForUser(user.id);

    let feedbackHtml = "";

    if (feedbacks.length > 0) {
      feedbackHtml = `
        <hr />
        <h6>Feedback</h6>
        <ul class="list-group list-group-flush">
          ${feedbacks
            .map((fb) => {
              const isOwnReview = fb.submittedBy === sessionUser?.name;

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
    const deleteBtn = card.querySelector(".delete-btn") as HTMLButtonElement;

    if (!isAdmin) {
      deleteBtn.style.display = "none";
    }

    //Status rule disable feedback if not approved
    const feedbackBtn = card.querySelector(
      ".feedback-btn",
    ) as HTMLButtonElement;
    if (!canGiveFeedback(user.status)) {
      feedbackBtn.disabled = true;
    }

    //Delete listener
    card.querySelector(".delete-btn")?.addEventListener("click", () => {
      removeUser(user.id);
      renderUsers();
    });

    //Feedback listener
    card.querySelector(".feedback-btn")?.addEventListener("click", () => {
      handleFeedback(user.id);
      renderUsers();
    });

    userList.appendChild(card);
  });
}
