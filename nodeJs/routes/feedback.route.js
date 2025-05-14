import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getAllDeletedFeedback,
  getFeedbackById,
  deleteFeedback,
  updateFeedback,
} from "../controllers/feedback.controller.js";
import { isAuth, authRole } from "../middleware/auth.middleware.js";

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
feedbackRouter.post("/feedback", createFeedback);

/**
 * @route GET /feedback
 * @description Retrieves all not deleted feedback entries.
 * @access Public
 * @returns {Array} List of not deleted feedback entries.
 * @example GET http://localhost:3001/feedback
 */
feedbackRouter.get("/feedback", isAuth, authRole("admin"), getAllFeedback);

/**
 * @route GET /feedback/deleted
 * @description Retrieves all deleted feedback entries.
 * @access Public
 * @returns {Array} List of deleted feedback entries.
 * @example GET http://localhost:3001/feedback/deleted
 */
feedbackRouter.get(
  "/feedback/deleted",
  isAuth,
  authRole("admin"),
  getAllDeletedFeedback
);

/**
 * @route GET /feedback/:id
 * @description Retrieves a feedback entry by its ID.
 * @returns {Object} The found feedback.
 * @access Public
 * @example GET http://localhost:3001/feedback/6160171b1494489759d31572
 */
feedbackRouter.get("/feedback/:id", isAuth, authRole("admin"), getFeedbackById);

/**
 * @route PATCH /feedback/:id
 * @description Partially updates a feedback entry by its ID.
 * @returns {Object} The updated feedback.
 * @access Private
 * @example PATCH http://localhost:3001/feedback/update/6160171b1494489759d31572
 */
feedbackRouter.patch(
  "/feedback/update/:id",
  isAuth,
  authRole("admin"),
  updateFeedback
);

/**
 * @route PATCH /feedback/:id
 * @description Logicaly deletes a feedback entry by its ID.
 * @returns {string} Success message.
 * @access Private
 * @example PATCH http://localhost:3001/feedback/delete/6160171b1494489759d31572
 */
feedbackRouter.patch(
  "/feedback/delete/:id",
  isAuth,
  authRole("admin"),
  deleteFeedback
);

export default feedbackRouter;
