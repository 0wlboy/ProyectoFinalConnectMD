import express from 'express';
import {
  createProfileVisit, 
  getAllProfileVisits,
  getProfileVisitsByHostId,
  getProfileVisitsByVisitorId,
  getProfileVisitsMetrics,
  deleteProfileVisit,
} from '../controllers/profileVisits.controller.js'; 
import {
  isAuth,
  authRole
} from '../middleware/auth.middleware.js'


const visitRouter = express.Router();

/**
 * @module visitRouter
 * @description Defines routes for managing users.
 */

/**
 * @route POST /profileVisit
 * @description Creates a new profile visit.
 * @access Public
 * @returns {string} Success message.
 * @example POST http://localhost:3001/profileVisit
 */
visitRouter.post("/profileVisit", createProfileVisit);

/**
 * @route GET /profileVisit
 * @description Retrieves all profile visits.
 * @access Public
 * @returns {Array} List of profile visits.
 * @example GET http://localhost:3001/profileVisit
 */
visitRouter.get('/profileVisit', getAllProfileVisits);


/**
 * @route GET /profileVisit/visitorId/:id
 * @description Retrieves all visits that the visitor perform.
 * @returns {array} list of all visits of the visitor.
 * @access Public
 * @example GET http://localhost:3001/profileVisit/visitorId/6160171b1494489759d31572
 */
visitRouter.get('/profileVisit/visitorId/:id', getProfileVisitsByVisitorId);

/**
 * @route GET /profileVisit/hostId/:id
 * @description Retrieves all visits of a individual profile.
 * @returns {array} list of all visits of the profile.
 * @access Public
 * @example GET http://localhost:3001/profileVisit/hostId/6160171b1494489759d31572
 */
visitRouter.get('/profileVisit/hostId/:id', getProfileVisitsByHostId);


/**
 * @route GET /profileVisit/profile/:id/metrics
 * @function getProfileVisitsMetrics
 * @description Retrieves the number of profile visits for a specific host within an optional date range.
 * @returns {Object} JSON response containing the count of profile visits.
 * @example GET /api/profileVisit/profile/507f1f77bcf86cd799439011/metrics?startDate=2023-01-01&endDate=2023-12-31
*/
visitRouter.get('/profileVisit/profile/:id/metrics', isAuth, authRole('prof') , getProfileVisitsMetrics);

/**
 * @route PATCH /profileVisit/:id
 * @description Lodically deletes a profile visit by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/profileVisit/6160171b1494489759d31572
 */
visitRouter.patch('/profileVisit/delete/:id',deleteProfileVisit);


export default visitRouter;
