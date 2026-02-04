import { createFeedback, fetchFeedbackForUser, } from "../services/feedback.service.js";
import { getSessionUser } from "../session.js";
export function handleFeedback(userId) {
    const sessionUser = getSessionUser();
    const message = window.prompt("Enter feedback");
    const ratingInput = window.prompt("Enter rating (1-5)");
    if (!sessionUser || !message || !ratingInput)
        return;
    const rating = Number(ratingInput);
    createFeedback(userId, message, rating, sessionUser.name);
    const feedbacks = fetchFeedbackForUser(userId);
    console.log(`Feedback for user ${userId}:`, feedbacks);
}
