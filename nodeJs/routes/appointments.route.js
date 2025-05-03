import express from 'express';
import AppointmentController from '../controllers/appointment.controller.js'; 



const appointmentRouter = express.Router();



/**
 * @route POST /appointments
 * @description Creates a new appointment
 * @access Public
 * @returns {string} Success message.
 * @example POST http://localhost:3001/appointments
 */
appointmentRouter.post("/appointments", AppointmentController.createAppointment);

/**
 * @route GET /appointments/clienteId/:id
 * @description Retrieves all appointments asocieted with a client.
 * @access Public
 * @returns {Array} List of appointments.
 * @example GET http://localhost:3001/appointments/clientId/6160171b1494489759d31572
 */
appointmentRouter.get('/appointments/clienteId/:id', AppointmentController.getAllAppointmentsByClientId);


/**
 * @route GET /appointments/profId/:id
 * @description Retrieves all appointments asocieted with a professional.
 * @returns {array} list of appointments.
 * @access Public
 * @example GET http://localhost:3001/appointments/profId/6160171b1494489759d31572
 */
appointmentRouter.get('/appointments/profId/:id', AppointmentController.getAllAppointmentsByProfId);


/**
 * @route PATCH /appointments/:id
 * @description Updates a appointment by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/appointments/update/6160171b1494489759d31572
 */
appointmentRouter.patch('/appointments/update/:id', AppointmentController.updateAppointment);

/**
 * @route PATCH /appointments/:id
 * @description Lodically deletes a appointment by its ID.
 * @access Public
 * @returns {string} Success message.
 * @example PATCH http://localhost:3001/appointments/delete/6160171b1494489759d31572
 */
appointmentRouter.patch('/appointments/delete/:id', AppointmentController.deleteAppointment);

export default appointmentRouter;