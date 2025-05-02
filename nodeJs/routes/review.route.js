import express from 'express';
import ReviewController from '../controllers/review.controller.js'; 



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
reviewRouter.post("/reviews", ReviewController.createReview);

/**
 * @route GET /reviews/clienteId/:id
 * @description Retrieves all reviews asocieted with a client.
 * @access Public
 * @returns {Array} List of reviews.
 * @example GET http://localhost:3001/clientId/6160171b1494489759d31572
 */
reviewRouter.get('/reviews/clienteId/:id', ReviewController.getAllReviewsByClientId);


/**
 * @route GET /reviews/profId/:id
 * @description Retrieves all reviews asocieted with a client.
 * @returns {array} list of reviews.
 * @access Public
 * @example GET http://localhost:3001/profId/6160171b1494489759d31572
 */
reviewRouter.get('/reviews/profId/:id', ReviewController.getAllReviewsByProfId);


/**
 * @route PATCH /reviews/:id
 * @description Updates a review by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/reviews/6160171b1494489759d31572
 */
reviewRouter.patch('/reviews/:id', ReviewController.updateReview);

/**
 * @route PATCH /reviews/:id
 * @description Lodically deletes a review by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/reviews/6160171b1494489759d31572
 */
reviewRouter.patch('/reviews/:id', ReviewController.deleteReview);

const visitRouter = reviewRouter;



export default visitRouter;
