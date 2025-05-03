import express from 'express';
import ContactController from '../controllers/contact.controller.js'; // Asegúrate de que la ruta al controlador sea correcta

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
 * @description Retrieves all not deleted contacts.
 * @access Public
 * @returns {Array} List of not deleted contacts.
 * @example GET http://localhost:3001/contacts
 */
contactRouter.get('/contacts', ContactController.getAllContacts);

/**
 * @route GET /contacts/deleted
 * @description Retrieves all deleted contacts.
 * @access Public
 * @returns {Array} List of deleted contacts.
 * @example GET http://localhost:3001/contacts/deleted
 */
contactRouter.get('/contacts/deleted', ContactController.getAllDeletedContacts);

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
 * @example PATCH http://localhost:3001/contacts/update/6160171b1494489759d31572
 */
contactRouter.patch('/contacts/update/:id', ContactController.updateContact);

/**
 * @route PATCH /contacts/:id
 * @description Logicaly deletes a contact by their ID.
 * @returns {string} Success message.
 * @access Private
 * @example PATCH http://localhost:3001/contacts/delete/6160171b1494489759d31572
 */
contactRouter.patch('/contacts/delete/:id', ContactController.deleteContact);

export default contactRouter;
