import express from "express";
import {
  createContact,
  getAllContacts,
  getAllDeletedContacts,
  getContactById,
  updateContact,
  deleteContact,
  getReportMetrics,
} from "../controllers/contact.controller.js"; // Asegúrate de que la ruta al controlador sea correcta
import { isAuth, authRole } from "../middleware/auth.middleware.js"; // Importar middlewares de autenticación

const contactRouter = express.Router();

/**
 * @module ContactRoutes
 * @description Defines routes for managing contacts.
 */

/**
 * @route POST /contacts
 * @description Creates a new contact.
 * @access Public
 * @returns {Object} The created contact.
 * @example POST http://localhost:3001/contacts
 */
contactRouter.post("/contacts", createContact);

/**
 * @route GET /contacts
 * @description Retrieves all not deleted contacts.
 * @access Public
 * @returns {Array} List of not deleted contacts.
 * @example GET http://localhost:3001/contacts
 */
contactRouter.get("/contacts", isAuth, authRole("admin"), getAllContacts);

/**
 * @route GET /contacts/deleted
 * @description Retrieves all deleted contacts.
 * @access Public
 * @returns {Array} List of deleted contacts.
 * @example GET http://localhost:3001/contacts/deleted
 */
contactRouter.get(
  "/contacts/deleted",
  isAuth,
  authRole("admin"),
  getAllDeletedContacts
);

/**
 * @route GET /contacts/:id
 * @description Retrieves a contact by their ID.
 * @returns {Object} The found contact.
 * @access Public
 * @example GET http://localhost:3001/contacts/6160171b1494489759d31572
 */
contactRouter.get("/contacts/:id", isAuth, authRole("admin"), getContactById);

/**
 * @route PATCH /contacts/:id
 * @description Partially updates a contact by their ID.
 * @returns {Object} The updated contact.
 * @access Private
 * @example PATCH http://localhost:3001/contacts/update/6160171b1494489759d31572
 */
contactRouter.patch(
  "/contacts/update/:id",
  isAuth,
  authRole("admin"),
  updateContact
);

/**
 * @route PATCH /contacts/:id
 * @description Logicaly deletes a contact by their ID.
 * @returns {string} Success message.
 * @access Private
 * @example PATCH http://localhost:3001/contacts/delete/6160171b1494489759d31572
 */
contactRouter.patch(
  "/contacts/delete/:id",
  isAuth,
  authRole("admin"),
  deleteContact
);

/**
 * @route GET /contacts/reports/metrics
 * @description Retrieves metrics for reports (contacts with affair 'reporte').
 * @access Private (admin) - Requires authentication and 'admin' role.
 * @returns {Object} Metrics including reports by day, total report count, reports by cause, and reported users.
 * @example GET http://localhost:3001/api/contacts/reports/metrics?startDate=2023-01-01&endDate=2023-12-31&cause=conductaInapropiada
 */
contactRouter.get(
  "/contacts/reports/metrics",
  isAuth,
  authRole("admin"),
  getReportMetrics
);

export default contactRouter;
