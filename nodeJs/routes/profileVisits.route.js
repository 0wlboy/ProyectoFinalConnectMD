import express from 'express';
import VisitController from '../controllers/profileVisits.controller.js'; 



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
visitRouter.post("/profileVisit", VisitController.createProfileVisit);

/**
 * @route GET /profileVisit
 * @description Retrieves all profile visits.
 * @access Public
 * @returns {Array} List of profile visits.
 * @example GET http://localhost:3001/profileVisit
 */
visitRouter.get('/profileVisit', VisitController.getAllProfileVisits);


/**
 * @route GET /profileVisit/visitorId/:id
 * @description Retrieves all visits that the visitor perform.
 * @returns {array} list of all visits of the visitor.
 * @access Public
 * @example GET http://localhost:3001/profileVisit/visitorId/6160171b1494489759d31572
 */
visitRouter.get('/profileVisit/visitorId/:id', VisitController.getProfileVisitsByVisitorId);

/**
 * @route GET /profileVisit/hostId/:id
 * @description Retrieves all visits of a individual profile.
 * @returns {array} list of all visits of the profile.
 * @access Public
 * @example GET http://localhost:3001/profileVisit/hostId/6160171b1494489759d31572
 */
visitRouter.get('/profileVisit/hostId/:id', VisitController.getProfileVisitsByHostId);

/**
 * @route PATCH /profileVisit/:id
 * @description Lodically deletes a profile visit by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/profileVisit/6160171b1494489759d31572
 */
visitRouter.patch('/profileVisit/delete/:id', VisitController.deleteProfileVisit);

const profileVisitRouter = visitRouter;


export default visitRouter;
