import Contact from '../models/contacts.models.js'; 
import mongoose from 'mongoose';

/**
 * @module ContactController
 * @description Controller for managing contacts.
 */
const ContactController = {
  /**
   * @async
   * @function createContact
   * @description Creates a new contact in the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example POST http://localhost:3001/contacts
   */
  async createContact(req, res) {
    const { senderId, receiverId, affair, cause, description, isSent } = req.body;
    try {
      const contact = new Contact({ senderId, receiverId, affair, cause, description, isSent });
      await contact.save();
      res.status(201).json({ message: 'Contact created successfully' }); // 201 Created
    } catch (error) {
      // Handle specific Mongoose errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Internal server error', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function getAllContacts
   * @description Retrieves all contacts from the database. Supports pagination.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/contacts
   * @example GET http://localhost:3001/contacts?page=2&limit=10
   */
  async getAllContacts(req, res) {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

     if (isNaN(page) || page <= 0) {
      page = 1;
    }
    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    try {
      const contacts = await Contact.find().skip(skip).limit(limit);
      const totalContacts = await Contact.countDocuments();
      res.status(200).json({
        contacts,
        page,
        limit,
        total: totalContacts,
        totalPages: Math.ceil(totalContacts / limit),
      }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving contacts', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function getContactById
   * @description Retrieves a contact by their ID from the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/contacts/6160171b1494489759d31572
   */
  async getContactById(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact ID' }); // 400 Bad Request
      }
      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' }); // 404 Not Found
      }
      res.status(200).json(contact); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving contact', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function updateContact
   * @description Updates an existing contact in the database by ID.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example PATCH http://localhost:3001/contacts/6160171b1494489759d31572
   */
  async updateContact(req, res) {
    const { id } = req.params;
    const { senderId, receiverId, affair, cause, description, isSent, modifiedBy } = req.body;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact ID' }); // 400 Bad Request
      }

      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { senderId, receiverId, affair, cause, description, isSent, modifiedBy }, // Only update provided fields
        { new: true, runValidators: true }
      );

      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' }); // 404 Not Found
      }
      res.status(200).json(updatedContact); // 200 OK
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Error updating contact', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function deleteContact
   * @description Deletes a contact from the database by their ID.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example DELETE http://localhost:3001/contacts/6160171b1494489759d31572
   */
  async deleteContact(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact ID' }); // 400 Bad Request
      }
      const deletedContact = await Contact.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).json({ message: 'Contact not found' }); // 404 Not Found
      }
      res.status(200).json({ message: 'Contact deleted successfully' }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contact', error }); // 500 Internal Server Error
    }
  },
};

export default ContactController;
