import Feedback from '../models/feedback.models.js'; 
import mongoose from 'mongoose';

/**
 * @module FeedbackController
 * @description Controller for managing feedback.
 */
const FeedbackController = {
  /**
   * @async
   * @function createFeedback
   * @description Creates a new feedback entry in the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example POST http://localhost:3001/feedback
   */
  async createFeedback(req, res) {
    const { senderId, affair, message } = req.body;
    try {
      const feedback = new Feedback({ senderId, affair, message });
      await feedback.save();
      res.status(201).json({ message: 'Feedback created successfully' }); // 201 Created
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
   * @function getAllFeedback
   * @description Retrieves all feedback entries from the database. Supports pagination.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/feedback
   * @example GET http://localhost:3001/feedback?page=2&limit=10
   */
  async getAllFeedback(req, res) {
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
      const feedback = await Feedback.find().skip(skip).limit(limit);
      const totalFeedback = await Feedback.countDocuments();
      res.status(200).json({ 
        feedback,
        page,
        limit,
        total: totalFeedback,
        totalPages: Math.ceil(totalFeedback/limit)
       }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving feedback', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function getFeedbackById
   * @description Retrieves a feedback entry by its ID from the database.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example GET http://localhost:3001/feedback/6160171b1494489759d31572
   */
  async getFeedbackById(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback ID' }); // 400 Bad Request
      }
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' }); // 404 Not Found
      }
      res.status(200).json(feedback); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving feedback', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function updateFeedback
   * @description Updates an existing feedback entry in the database by ID.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example PATCH http://localhost:3001/feedback/6160171b1494489759d31572
   */
  async updateFeedback(req, res) {
    const { id } = req.params;
    const { senderId, affair, message, modifiedBy } = req.body;
    try {
       if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback ID' }); // 400 Bad Request
      }
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        id,
        { senderId, affair, message, modifiedBy }, // Only update provided fields
        { new: true, runValidators: true }
      );
      if (!updatedFeedback) {
        return res.status(404).json({ message: 'Feedback not found' }); // 404 Not Found
      }
      res.status(200).json(updatedFeedback); // 200 OK
    } catch (error) {
       if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Error updating feedback', error }); // 500 Internal Server Error
    }
  },

  /**
   * @async
   * @function deleteFeedback
   * @description Deletes a feedback entry from the database by its ID.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @returns {Promise<void>}
   * @example DELETE http://localhost:3001/feedback/6160171b1494489759d31572
   */
  async deleteFeedback(req, res) {
    const { id } = req.params;
    try {
       if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback ID' }); // 400 Bad Request
      }
      const deletedFeedback = await Feedback.findByIdAndDelete(id);
      if (!deletedFeedback) {
        return res.status(404).json({ message: 'Feedback not found' }); // 404 Not Found
      }
      res.status(200).json({ message: 'Feedback deleted successfully' }); // 200 OK
    } catch (error) {
      res.status(500).json({ message: 'Error deleting feedback', error }); // 500 Internal Server Error
    }
  },
};

export default FeedbackController;
