import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js";



/**
 * @typedef {object} DeletedSchema
 * @property {boolean} [isDeleted=false] - Flag indicating if the entity is logically deleted. Indexed.
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
 * @typedef {object} Review
 * @property {mongoose.Schema.Types.ObjectId} clientId - ID of the client giving the review. References 'User'. Required.
 * @property {mongoose.Schema.Types.ObjectId} profId - ID of the professional being reviewed. References 'User'. Required.
 * @property {number} stars - The star rating given (1-5). Required. Min: 1, Max: 5.
 * @property {ModificationRecord[]} modificationHistory - Array tracking modification history.
 * @property {DeletedSchema} [deleted] - Object containing logical deletion information.
 */
const reviewSchema = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true, 
    },
    profId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    }, 
    modificationHistory : [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        modifiedDate: {
            type: Date,
            default: Date.now,
        }
    }],
    deleted: DeletedSchema,
}, { 
  timestamps: true 

});

reviewSchema.plugin(moongoosePaginate); // pagination plugin
const Review = mongoose.model('Review', reviewSchema);

export default Review;
