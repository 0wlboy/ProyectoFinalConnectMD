import Contact from '../models/contacts.models.js';
import mongoose from 'mongoose';

/**
 * @module ContactController
 * @description Controller for managing contacts.
 */

/**
 * @async
 * @function createContact
 * @description Creates a new contact in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {objectId} senderId - sender ID
 * @param {objectId} receiverId - receiver ID
 * @param {string} affair - affair of the contact
 * @param {string} cause - cause of the contact
 * @param {string} description - description of the contact
 * @param {boolean} isSent - sent confirmation
 * @returns {string} message
 * @example POST http://localhost:3001/contacts
 */
export const createContact = async (req, res) => {
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
};

/**
 * @async
 * @function getAllContacts
 * @description Retrieves all contacts from the database. Supports pagination.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {objectId} senderId - sender Id
 * @param {objectId} receiverId - receiver Id
 * @param {string} affair - affair
 * @param {string} cause - cause
 * @returns {array} contacts
 * @example GET http://localhost:3001/contacts
 * @example GET http://localhost:3001/contacts?page=2&limit=10
 */
export const getAllContacts = async (req, res) => {
  let { senderId, receiverId,affair, cause, page = 1, limit = 10, sortBy, sortOrder = 'asc' } = req.query;
  const query = {};
  const sort = {};

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }
  const skip = (page - 1) * limit;

  if (senderId) {
    query.senderId = senderId;
  }
  if (receiverId) {
    query.receiverId = receiverId;
  }
  if (affair) {
    query.affair = affair;
  }
  if (cause) {
    query.cause = cause;
  }

  if (sortBy) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort['createdAt'] = -1; //default order: from most recent to most old
  }


  try {
    const contacts = await Contact.find(query).skip(skip).limit(limit).sort(sort);
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
};

/**
 * @async
 * @function getContactById
 * @description Retrieves a contact by their ID from the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {object} contact
 * @example GET http://localhost:3001/contacts/6160171b1494489759d31572
 */
export const getContactById = async (req, res) => {
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
};

/**
 * @async
 * @function updateContact
 * @description Updates an existing contact in the database by ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {objectId} senderId - sender ID
 * @param {objectId} receiverId - receiver ID
 * @param {string} affair - affair of the contact
 * @param {string} cause - cause of the contact
 * @param {string} description - description of the contact
 * @param {boolean} isSent - sent confirmation
 * @param {objectId} modifiedBy - user who modified
 * @returns {Promise<void>}
 * @example PATCH http://localhost:3001/contacts/6160171b1494489759d31572
 */
export const updateContact = async (req, res) => {
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
    res.status(200).json({ message: 'Contact updated successfully' }); // 200 OK
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors }); // 400 Bad Request
    }
    res.status(500).json({ message: 'Error updating contact', error }); // 500 Internal Server Error
  }
};

/**
 * @async
 * @function deleteContact
 * @description Deletes a contact from the database by their ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {string} message
 * @example DELETE http://localhost:3001/contacts/6160171b1494489759d31572
 */
export const deleteContact = async (req, res) => {
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
};

const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};

export default ContactController;
