import { Feedback } from "../models/feedback.js";

const STORAGE_KEY = "feedbacks";

function loadFeedbacks(): Feedback[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFeedbacks(feedbacks: Feedback[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

let feedbacks: Feedback[] = loadFeedbacks();

export function getFeedbackByUser(userId: number): Feedback[] {
  return feedbacks.filter(fb => fb.userId === userId);
}

export function addFeedback(feedback: Feedback): void {
  feedbacks.push(feedback);
  saveFeedbacks(feedbacks);
}

export function generateFeedbackId(): number {
  return feedbacks.length > 0
    ? feedbacks[feedbacks.length - 1].id + 1
    : 1;
}

