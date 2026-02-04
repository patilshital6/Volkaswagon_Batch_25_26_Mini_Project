const STORAGE_KEY = "feedbacks";
function loadFeedbacks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
function saveFeedbacks(feedbacks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}
let feedbacks = loadFeedbacks();
export function getFeedbackByUser(userId) {
    return feedbacks.filter(fb => fb.userId === userId);
}
export function addFeedback(feedback) {
    feedbacks.push(feedback);
    saveFeedbacks(feedbacks);
}
export function generateFeedbackId() {
    return feedbacks.length > 0
        ? feedbacks[feedbacks.length - 1].id + 1
        : 1;
}
