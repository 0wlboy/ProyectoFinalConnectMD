import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js"


/**
 * @typedef {object} DeletedSchema
 * @property {boolean} isDeleted  - Flag that indicate if the user is logicaly deleted
 * @property {objectId} isDeletedBy - ID of the user how deleted the element
 * @property {date} deletedAt - date of deletion
 */
const DeletedSchema = new Schema({
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  isDeletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedAt: {
    type: Date,
  },
},{
  _id: false
})

/**
 * @typedef {object} ProfileVisit
 * @property {mongoose.Schema.Types.ObjectId} visitorId - ID of the visitor.
 * @property {mongoose.Schema.Types.ObjectId} hostId - ID of the host.
 * @property {DeletedSchema} deleted - Object for the information of deletion
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
    },
    delete:DeletedSchema
},{
  timestamps: true
});

profileVisitSchema.plugin(moongoosePaginate); //implementar paginacion

const ProfileVisit = mongoose.model('ProfileVisit', profileVisitSchema);

export default ProfileVisit;
