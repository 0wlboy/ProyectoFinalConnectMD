import express from 'express';
import UserController from '../controllers/user.controller.js'; 
//import { isAuthenticated } from '../middleware/auth.middleware.js'; // Asegúrate que la ruta es correcta



const userRouter = express.Router();

/**
 * @module UserRoutes
 * @description Defines routes for managing users.
 */

/**
 * @route POST /users
 * @description Creates a new user.
 * @access Public
 * @returns {Object} The created user.
 * @example POST http://localhost:3001/users
 */
userRouter.post("/users", UserController.createUser);

/**
 * @route GET /users
 * @description Retrieves all not deleted users.
 * @access Public
 * @returns {Array} List of not deleted users.
 * @example GET http://localhost:3001/users
 */
userRouter.get('/users', UserController.getAllUsers);

/**
 * @route GET /users/deleted
 * @description Retrieves all deleted users.
 * @access Public
 * @returns {Array} List of deleted users.
 * @example GET http://localhost:3001/users/deleted
 */
userRouter.get('/users/deleted', UserController.getAllDeletedUsers);

/**
 * @route GET /users/:id
 * @description Retrieves a user by their ID.
 * @returns {Object} The found user.
 * @access Public
 * @example GET http://localhost:3001/users/6160171b1494489759d31572
 */
userRouter.get('/users/:id', UserController.getUserById);

/**
 * @route PATCH /users/:id
 * @description Partially updates a user by their ID.
 * @returns {Object} The updated user.
 * @access Private
 * @example PATCH http://localhost:3001/users/update/6160171b1494489759d31572
 */
userRouter.patch('/users/update/:id', UserController.updateUser);

/**
 * @route PATCH /users/:id
 * @description Logicaly deletes a user by their ID.
 * @returns {string} Success message.
 * @access Private
 * @example PATCH http://localhost:3001/users/delete/6160171b1494489759d31572
 */
userRouter.patch('/users/delete/:id', UserController.deleteUser);

export default userRouter;
