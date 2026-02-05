import { addFeedback, getFeedbackByUser, generateFeedbackId } from "../data/feedback.api.js";
export function fetchFeedbackForUser(userId) {
    return getFeedbackByUser(userId);
}
export function createFeedback(userId, message, rating, submittedBy) {
    const newFeedback = {
        id: generateFeedbackId(),
        userId,
        message,
        rating: Math.min(Math.max(rating, 1), 5),
        submittedBy
    };
    addFeedback(newFeedback);
    return newFeedback;
}
