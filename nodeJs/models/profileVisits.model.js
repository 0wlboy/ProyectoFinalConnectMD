import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js"

/**
 * @typedef {object} ProfileVisit
 * @property {mongoose.Schema.Types.ObjectId} visitorId - ID of the visitor.
 * @property {mongoose.Schema.Types.ObjectId} hostId - ID of the host.
 */

const profileVisitSchema = new Schema({
    visitorId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    hostId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }
},{
  timestamps: true
});

profileVisitSchema.plugin(moongoosePaginate); //implementar paginacion

const ProfileVisit = mongoose.model('ProfileVisit', profileVisitSchema);

export default ProfileVisit;
