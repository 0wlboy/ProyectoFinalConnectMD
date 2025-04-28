import User from '../models/users.models.js'; 
import mongoose from 'mongoose';

/**
 * @module UserController
 * @description Controller for managing users.
 */
const UserController = {
  /**
   * @async
   * @function createUser
   * @description Creates a new user in the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example POST http://localhost:3001/users
   */
  async createUser(req, res) {
    const { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures } = req.body;
    console.log(req.body);
    try {
      const user = new User({ firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures });
      await user.save();
      res.status(201).json({ message: 'Usuario creado con éxito' }); // 201 Created
    } catch (error) {
      // Handling of specific errors from mongoose 
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Error de validación', errors: error.errors }); // 400 Bad Request
      } else if (error.code === 11000) {
        return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya existen' }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Error interno del servidor', error }); // 500 Internal Server Error
    }
  },


  /**
   * @async
   * @function getAllUsers
   * @description Retrieves all users from the database.  Supports optional name filtering and pagination.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/users
   * @example GET http://localhost:3001/users?firstName=John
   * @example GET http://localhost:3001/users?page=2&limit=10
   */
  async getAllUsers(req, res) {
    let { firstName, page = 1, limit = 10 } = req.query;
    const query = {};

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page <= 0) {
      page = 1; // Ensure page is a valid positive integer
    }
    if (isNaN(limit) || limit <= 0) {
      limit = 10; // Ensure limit is a valid positive integer
    }
    const skip = (page - 1) * limit;


    if (firstName) {
      query.firstName = new RegExp(firstName, 'i'); // Case-insensitive search
    }

    try {
      const users = await User.find(query).skip(skip).limit(limit);
      const totalUsers = await User.countDocuments(query); // Get total count for pagination info

      res.status(200).json({
        users,
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit), //calculate total pages
      }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function getUserById
   * @description Retrieves a user by their ID from the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/users/6160171b1494489759d31572
   */
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' }); // 400 Bad Request
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // 404 Not Found
      }
      res.status(200).json(user); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error }); // 500 Internal Server Error
    }
  },

    /**
   * @async
   * @function updateUser
   * @description Updates an existing user in the database by ID.
   * @param {Object} req - Objeto de la petición HTTP.
   * @param {Object} res - Objeto de la respuesta HTTP.
   * @returns {Promise<void>}
   * @example PATCH http://localhost:3001/users/6160171b1494489759d31572
   */
    async updateUser(req, res) {
      const { id } = req.params;
      const { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures } = req.body; // Extract fields from body
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'ID de usuario no válido' }); // 400 Bad Request
        }
  
        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          { firstName, lastName, email, password, role, profilePicture, locations, profession, officePictures }, // only update the give fields
          { new: true, runValidators: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ message: 'Usuario no encontrado' }); // 404 Not Found
        }
        res.status(200).json(updatedUser); // 200 OK
      } catch (error) {
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: 'Error de validación', errors: error.errors }); // 400 Bad Request
        }
        res.status(500).json({ message: 'Error al actualizar el usuario', error }); // 500 Internal Server Error
      }
    },

  /**
   * @async
   * @function deleteUser
   * @description Deletes a user from the database by their ID.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example DELETE http://localhost:3001/users/6160171b1494489759d31572
   */
  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' }); // 400 Bad Request
      }
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' }); // 404 Not Found
      }
      res.status(200).json({ message: 'User deleted successfully' }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error }); // 500 Internal Server Error
    }
  },
};

export default UserController;
