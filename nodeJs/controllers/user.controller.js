import User from '../models/users.models.js';
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
  let { firstName, lastName, role, profession, page = 1, limit = 10, sortBy, sortOrder = 'asc'} = req.query;
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

  if (firstName) {
    query.firstName = new RegExp(firstName, 'i');
  }
  if (lastName) {
    query.lastName = new RegExp(firstName, 'i');
  }
  if (role) {
    query.role = role;
  }
  if (profession) {
    query.profession = profession;
  }

  if (sortBy) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort['createdAt'] = -1; //default order: from most recent to most old
  }

  try {
    const users = await User.find(query).skip(skip).limit(limit).sort(sort);
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
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
 * @description Deletes a user from the database by their ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {string} message 
 * @example DELETE http://localhost:3001/users/6160171b1494489759d31572
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

export default UserController;
