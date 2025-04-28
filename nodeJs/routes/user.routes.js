import express from 'express';
import UserController from '../controllers/user.controller.js'; 


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
 * @description Retrieves all users.
 * @access Public
 * @returns {Array} List of users.
 * @example GET http://localhost:3001/users
 */
userRouter.get('/users', UserController.getAllUsers);

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
 * @example PATCH http://localhost:3001/users/6160171b1494489759d31572
 */
userRouter.patch('/users/:id', UserController.updateUser);

/**
 * @route DELETE /users/:id
 * @description Deletes a user by their ID.
 * @returns {string} Success message.
 * @access Private
 * @example DELETE http://localhost:3001/users/6160171b1494489759d31572
 */
userRouter.delete('/users/:id', UserController.deleteUser);

export default userRouter;
