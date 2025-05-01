import Contact from '../models/contact.model.js';
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
  let { senderId, receiverId,affair, cause, page = 1, limit = 10, sortBy ='createdAt', sortOrder = 'desc' } = req.query;
  const query = {};


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

  query['deleted.isDeleted'] = false;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
  };


  try {
    const result = await Contact.paginate(query, options);
    const contacts = result.docs;
    const totalContacts = result.total;

    res.status(200).json({
      contacts,
      page,
      limit,
      total: totalContacts,
      totalPages: result.totalPages,
    }); // 200 OK
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contacts', error }); // 500 Internal Server Error
  }
};


/**
 * @async
 * @function getAllDeletedContacts
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
export const getAllDeletedContacts = async (req, res) => {
  let { senderId, receiverId,affair, cause, page = 1, limit = 10, sortBy ='createdAt', sortOrder = 'desc' } = req.query;
  const query = {};


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

  query['deleted.isDeleted'] = true;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
  };


  try {
    const result = await Contact.paginate(query, options);
    const contacts = result.docs;
    const totalContacts = result.total;

    res.status(200).json({
      contacts,
      page,
      limit,
      total: totalContacts,
      totalPages: result.totalPages,
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
 * @description Logically deletes a contact by setting the 'deleted' flag.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the contact to delete.
 * @param {string} req.body.deletedBy - The ID of the user performing the deletion. 
 * @returns {string} message
 * @example PATCH http://localhost:3001/contacts/6160171b1494489759d31572 
 */
export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { deletedBy } = req.body; 

  try {
    // Validate the ID of the contact to be deleted
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de contacto inválido' }); 
    }
    // Validate the ID of the user performing the deletion
    if (!mongoose.Types.ObjectId.isValid(deletedBy)) {
      return res.status(400).json({ message: 'ID de usuario eliminador inválido' }); // Mensaje en español
    }

    // Find the contact by ID
    const contact = await Contact.findById(id);

    // Handle case where contact is not found
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' }); // Mensaje en español
    }

    // Check if already deleted to avoid redundant saves (optional but good practice)
    if (contact.deleted?.isDeleted) {
        return res.status(200).json({ message: 'El contacto ya ha sido eliminado previamente' });
    }


    // Update the deleted field for soft delete
    contact.deleted = { isDeleted: true, isDeletedBy: deletedBy, deletedAt: new Date() };

    // Save the changes
    await contact.save();

    // Send success response
    res.status(200).json({ message: 'Contacto eliminado con éxito' }); // Mensaje en español

  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error }); // 500 Internal Server Error
  }
};

const ContactController = {
  createContact,
  getAllContacts,
  getAllDeletedContacts,
  getContactById,
  updateContact,
  deleteContact,
};

export default ContactController;
