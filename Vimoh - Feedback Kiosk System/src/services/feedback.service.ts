import { Feedback } from "../models/feedback.js";
import {
  addFeedback,
  getFeedbackByUser,
  generateFeedbackId
} from "../data/feedback.api.js";
export function fetchFeedbackForUser(userId: number): Feedback[] {
  return getFeedbackByUser(userId);
}
export function createFeedback(
  userId: number,
  message: string,
  rating: number,
  submittedBy: string
): Feedback {
  const newFeedback: Feedback = {
    id: generateFeedbackId(),
    userId,
    message,
    rating: Math.min(Math.max(rating, 1), 5),
    submittedBy
  };

  addFeedback(newFeedback);
  return newFeedback;
}

