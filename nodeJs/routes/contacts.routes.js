import express from 'express';
import ContactController from '../controllers/contacts.controller.js'; // Asegúrate de que la ruta al controlador sea correcta

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
contactRouter.post('/contacts', ContactController.createContact);

/**
 * @route GET /contacts
 * @description Retrieves all contacts.
 * @access Public
 * @returns {Array} List of contacts.
 * @example GET http://localhost:3001/contacts
 */
contactRouter.get('/contacts', ContactController.getAllContacts);

/**
 * @route GET /contacts/:id
 * @description Retrieves a contact by their ID.
 * @returns {Object} The found contact.
 * @access Public
 * @example GET http://localhost:3001/contacts/6160171b1494489759d31572
 */
contactRouter.get('/contacts/:id', ContactController.getContactById);

/**
 * @route PATCH /contacts/:id
 * @description Partially updates a contact by their ID.
 * @returns {Object} The updated contact.
 * @access Private
 * @example PATCH http://localhost:3001/contacts/6160171b1494489759d31572
 */
contactRouter.patch('/contacts/:id', ContactController.updateContact);

/**
 * @route DELETE /contacts/:id
 * @description Deletes a contact by their ID.
 * @returns {string} Success message.
 * @access Private
 * @example DELETE http://localhost:3001/contacts/6160171b1494489759d31572
 */
contactRouter.delete('/contacts/:id', ContactController.deleteContact);

export default contactRouter;
