import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js";


/**
 * @typedef {object} DeletedInfo
 * @property {boolean} isDeleted - Flag indicating if the entity is logically deleted. Indexed.
 * @property {mongoose.Schema.Types.ObjectId} isDeletedBy - ID of the user who performed the deletion. References 'User'.
 * @property {Date} deletedAt - Timestamp of the deletion.
 */
const DeletedSchema = new Schema({
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  isDeletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  deletedAt: {
    type: Date,
  },
},{
  _id: false
})

/**
 * @typedef {object} Feedback
 * @property {mongoose.Schema.Types.ObjectId} _id - Unique ID of the feedback (ObjectId).
 * @property {mongoose.Schema.Types.ObjectId} senderId - ID of the user who sent the feedback (reference to User).
 * @property {string} affair Reason for the feedback ( 'bug', 'sugerencia', 'otro')
 * @property {string} message - The feedback message.
 * @property {boolean} isDeleted - Indicates if the feedback has been logically deleted (default: false, indexed).
 * @property {mongoose.Schema.Types.ObjectId} modifiedBy - ID of the user who last modified the feedback (reference to User).
 */
const FeedbackSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  affair: {
    type: String,
    enum: ['bug', 'sugerencia', 'otro'],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim:true
  },
  deleted: DeletedSchema,
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
},
{
  timestamps: true
});

FeedbackSchema.plugin(moongoosePaginate)// add pagination

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);

export default FeedbackModel;