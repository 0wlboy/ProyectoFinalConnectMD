import express from "express";
import {
  createReview,
  getAllReviewsByClientId,
  getAllReviewsByProfId,
  updateReview,
  deleteReview,
  getReviewMetrics,
} from "../controllers/review.controller.js";
import { isAuth, authRole } from "../middleware/auth.middleware.js"; // Asegúrate que la ruta es correcta

const reviewRouter = express.Router();

/**
 * @module reviewRouter
 * @description Defines routes for managing users.
 */

/**
 * @route POST /reviews
 * @description Creates a new review
 * @access Public
 * @returns {string} Success message.
 * @example POST http://localhost:3001/reviews
 */
reviewRouter.post("/reviews", createReview);

/**
 * @route GET /reviews/clienteId/:id
 * @description Retrieves all reviews asocieted with a client.
 * @access Public
 * @returns {Array} List of reviews.
 * @example GET http://localhost:3001/clientId/6160171b1494489759d31572
 */
reviewRouter.get(
  "/reviews/clienteId/:id",
  isAuth,
  authRole("prof", "admin"),
  getAllReviewsByClientId
);

/**
 * @route GET /reviews/profId/:id
 * @description Retrieves all reviews asocieted with a client.
 * @returns {array} list of reviews.
 * @access Public
 * @example GET http://localhost:3001/profId/6160171b1494489759d31572
 */
reviewRouter.get(
  "/reviews/profId/:id",
  isAuth,
  authRole("prof", "admin"),
  getAllReviewsByProfId
);

/**
 * @route GET /reviews/profId/:profId/metrics
 * @description Retrieves review metrics for a specific professional.
 * @access Private (prof, admin) - Requires authentication and role 'prof' or 'admin'.
 * @returns {Object} Metrics including total reviews, reviews by stars, and average rating.
 * @example GET http://localhost:3001/api/reviews/profId/6160171b1494489759d31572/metrics
 */
reviewRouter.get(
  "/reviews/profId/:profId/metrics",
  isAuth,
  authRole("prof", "admin"),
  getReviewMetrics
);

/**
 * @route PATCH /reviews/:id
 * @description Updates a review by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/reviews/update/6160171b1494489759d31572
 */
reviewRouter.patch(
  "/reviews/update/:id",
  isAuth,
  authRole("client", "admin"),
  updateReview
);

/**
 * @route PATCH /reviews/:id
 * @description Lodically deletes a review by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/reviews/delete/6160171b1494489759d31572
 */
reviewRouter.patch(
  "/reviews/delete/:id",
  isAuth,
  authRole("admin"),
  deleteReview
);

export default reviewRouter;
