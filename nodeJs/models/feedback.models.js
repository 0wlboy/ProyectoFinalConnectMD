import mongoose, { Schema } from 'mongoose';

/**
 * @typedef {object} Feedback
 * @property {mongoose.Schema.Types.ObjectId} _id - Unique ID of the feedback (ObjectId).
 * @property {mongoose.Schema.Types.ObjectId} senderId - ID of the user who sent the feedback (reference to User).
 * @property {string} affair Reason for the feedback ( 'bug', 'sugerencia', 'otro')
 * @property {string} message - The feedback message.
 * @property {boolean} isDeleted - Indicates if the feedback has been logically deleted (default: false, indexed).
 * @property {mongoose.Schema.Types.ObjectId} modifiedBy - ID of the user who last modified the feedback (reference to User).
 * @property {Date} creationDate - Date the feedback was created (automatically filled, not null).
 * @property {Date} modificationDate - Date the feedback was last modified (automatically filled and updated).
 */
const FeedbackSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  affair: {
    type: String,
    enum: ['bug', 'sugerencia', 'otro'],
    required: true,
  },
  message: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: true
});


const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);

export default FeedbackModel;