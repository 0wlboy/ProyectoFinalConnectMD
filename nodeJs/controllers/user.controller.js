import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * @module UserController
 * @description Controller for managing users.
 */

/**
 * @async
 * @function createUser
 * @description Creates a new user in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.body.firstName - firstName
 * @param {string} req.body.lastName - lastName
 * @param {string} req.body.email - email
 * @param {string} req.body.password - password
 * @param {string} req.body.role - role
 * @param {string} req.body.profilePicture - profilePicture
 * @param {string} req.body.locations - locations
 * @param {string} req.body.profession - profession
 * @param {string} req.body.officePictures - officePictures
 * @returns {string} message 
 * @example POST http://localhost:3001/users
 */
export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures } = req.body;
  try {
    const user = new User({ firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures });
    await user.save();
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    } else if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya existen' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

/**
 * @async
 * @function getAllUsers
 * @description Retrieves all users from the database. Supports optional name filtering and pagination.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {Array} users
 * @example GET http://localhost:3001/users
 * @example GET http://localhost:3001/users?firstName=John&role=Admin&profession=Cirujano&sortBy=firstName
 * @example GET http://localhost:3001/users?page=2&limit=10
 */
export const getAllUsers = async (req, res) => {
  let { firstName, lastName, role, profession, page = 1, limit = 10, sortBy='createdAt', sortOrder = 'desc'} = req.query;
  const query = {};


  if (firstName) {
    query.firstName = new RegExp(firstName, 'i');

  }
  if (lastName) {
    query.lastName = new RegExp(lastName, 'i');
  }
  if (role) {
    query.role = role;
  }
  if (profession) {
    query.profession = profession;
  }

  query['deleted.isDeleted'] = false;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
   
  };
  try {
    const result = await User.paginate(query, options);
    const users = result.docs;
    const totalUsers = result.total;

    res.status(200).json({
      users,
      page,
      limit,
      total: totalUsers,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

/**
 * @async
 * @function getAllDeletedUsers
 * @description Retrieves all users from the database. Supports optional name filtering and pagination.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {Array} users
 * @example GET http://localhost:3001/users
 * @example GET http://localhost:3001/users?firstName=John&role=Admin&profession=Cirujano&sortBy=firstName
 * @example GET http://localhost:3001/users?page=2&limit=10
 */
export const getAllDeletedUsers = async (req, res) => {
  let { firstName, lastName, role, profession, page = 1, limit = 10, sortBy ='createdAt', sortOrder = 'desc'} = req.query;
  const query = {};
  

  if (firstName) {
    query.firstName = new RegExp(firstName, 'i');

  }
  if (lastName) {
    query.lastName = new RegExp(lastName, 'i');
  }
  if (role) {
    query.role = role;
  }
  if (profession) {
    query.profession = profession;
  }

  query['deleted.isDeleted'] = true;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
   
  };
  try {
    const result = await User.paginate(query, options);
    const users = result.docs;
    const totalUsers = result.total;

    res.status(200).json({
      users,
      page,
      limit,
      total: totalUsers,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

/**
 * @async
 * @function getUserById
 * @description Retrieves a user by their ID from the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {object} user
 * @example GET http://localhost:3001/users/6160171b1494489759d31572
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

/**
 * @async
 * @function updateUser
 * @description Updates an existing user in the database by ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {string} message 
 * @example PATCH http://localhost:3001/users/6160171b1494489759d31572
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures },
      {  runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating user', error });
  }
};

/**
 * @async
 * @function deleteUser
 * @description Logically deletes a user by setting the 'deleted' flag.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {string} req.body.deletedBy - The ID of the user performing the deletion. 
 * @returns {string} message
 * @example PATCH http://localhost:3001/users/6160171b1494489759d31572 
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { deletedBy } = req.body; 

  try {
    // Validate the ID of the user to be deleted
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' }); 
    }
    // Validate the ID of the user performing the deletion
    if (!mongoose.Types.ObjectId.isValid(deletedBy)) {
      return res.status(400).json({ message: 'ID de usuario eliminador inválido' }); // Mensaje en español
    }

    // Find the user by ID
    const user = await User.findById(id);

    // Handle case where user is not found
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Mensaje en español
    }

    // Check if already deleted to avoid redundant saves (optional but good practice)
    if (user.deleted?.isDeleted) {
        return res.status(200).json({ message: 'El usuario ya ha sido eliminado previamente' });
    }


    // Update the deleted field for soft delete
    user.deleted = { isDeleted: true, isDeletedBy: deletedBy, deletedAt: new Date() };

    // Save the changes
    await user.save();

    // Send success response
    res.status(200).json({ message: 'Usuario eliminado con éxito' }); // Mensaje en español

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};


const UserController = {
  createUser,
  getAllUsers,
  getAllDeletedUsers,
  getUserById,
  updateUser,
  deleteUser
};

export default UserController;
