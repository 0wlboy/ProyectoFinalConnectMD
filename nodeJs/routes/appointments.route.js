import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAllAppointmentsByClientId,
  getAllAppointmentsByProfId,
  updateAppointment,
  deleteAppointment,
  getAppointmentMetrics
} from '../controllers/appointment.controller.js'; 
import { isAuth, authRole } from '../middleware/auth.middleware.js';


const appointmentRouter = express.Router();



/**
 * @route POST /appointments
 * @description Creates a new appointment
 * @access Public
 * @returns {string} Success message.
 * @example POST http://localhost:3001/appointments
 */
appointmentRouter.post("/appointments", createAppointment);

/**
 * @route GET /appointments/clienteId/:id
 * @description Retrieves all appointments asocieted with a client.
 * @access Public
 * @returns {Array} List of appointments.
 * @example GET http://localhost:3001/appointments/clientId/6160171b1494489759d31572
 */
appointmentRouter.get('/appointments/clienteId/:id', getAllAppointmentsByClientId);


/**
 * @route GET /appointments/profId/:id
 * @description Retrieves all appointments asocieted with a professional.
 * @returns {array} list of appointments.
 * @access Public
 * @example GET http://localhost:3001/appointments/profId/6160171b1494489759d31572
 */
appointmentRouter.get('/appointments/profId/:id', getAllAppointmentsByProfId);

/**
 * @route GET /appointments/profId/:profId/metrics
 * @description Retrieves appointment metrics for a specific professional.
 * @access Private (prof, admin) - Requires authentication and role 'prof' or 'admin'.
 * @returns {Object} Metrics including appointments by day, busiest day, appointments by office, and busiest office.
 * @example GET http://localhost:3001/api/appointments/profId/6160171b1494489759d31572/metrics
 */
appointmentRouter.get('/appointments/profId/:profId/metrics', isAuth, authRole('prof', 'admin'), getAppointmentMetrics);


/**
 * @route PATCH /appointments/:id
 * @description Updates a appointment by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/appointments/update/6160171b1494489759d31572
 */
appointmentRouter.patch('/appointments/update/:id', updateAppointment);

/**
 * @route PATCH /appointments/:id
 * @description Lodically deletes a appointment by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/appointments/delete/6160171b1494489759d31572
 */
appointmentRouter.patch('/appointments/delete/:id', deleteAppointment);

export default appointmentRouter;