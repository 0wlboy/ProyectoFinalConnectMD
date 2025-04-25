import express from 'express';
import FeedbackController from '../controllers/feedback.controller.js'; 

const feedbackRouter = express.Router();

/**
 * @module FeedbackRoutes
 * @description Defines routes for managing feedback.
 */

/**
 * @route POST /feedback
 * @description Creates a new feedback entry.
 * @access Public
 * @returns {Object} The created feedback.
 * @example POST http://localhost:3001/feedback
 */
feedbackRouter.post('/feedback', FeedbackController.createFeedback);

/**
 * @route GET /feedback
 * @description Retrieves all feedback entries.
 * @access Public
 * @returns {Array} List of feedback entries.
 * @example GET http://localhost:3001/feedback
 */
feedbackRouter.get('/feedback', FeedbackController.getAllFeedback);

/**
 * @route GET /feedback/:id
 * @description Retrieves a feedback entry by its ID.
 * @returns {Object} The found feedback.
 * @access Public
 * @example GET http://localhost:3001/feedback/6160171b1494489759d31572
 */
feedbackRouter.get('/feedback/:id', FeedbackController.getFeedbackById);

/**
 * @route PATCH /feedback/:id
 * @description Partially updates a feedback entry by its ID.
 * @returns {Object} The updated feedback.
 * @access Private
 * @example PATCH http://localhost:3001/feedback/6160171b1494489759d31572
 */
feedbackRouter.patch('/feedback/:id', FeedbackController.updateFeedback);

/**
 * @route DELETE /feedback/:id
 * @description Deletes a feedback entry by its ID.
 * @returns {string} Success message.
 * @access Private
 * @example DELETE http://localhost:3001/feedback/6160171b1494489759d31572
 */
feedbackRouter.delete('/feedback/:id', FeedbackController.deleteFeedback);

export default feedbackRouter;
