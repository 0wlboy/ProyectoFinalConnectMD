import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js";


/**
 * @typedef {object} Review
 * @property {mongoose.Schema.Types.ObjectId} clientId - ID of the related client.
 * @property {mongoose.Schema.Types.ObjectId} profId - ID of the related professional.
 * @property {ModificationRecord[]} modificationHistory - Record of modifications. 
 * @property {number} stars - number of stars that the client gives
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
}, { 
  timestamps: true 

});

reviewSchema.plugin(moongoosePaginate); // pagination plugin
const Review = mongoose.model('Review', reviewSchema);

export default Review;
