import mongoose, { Schema } from "mongoose";
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import User from "./user.model.js";

/**
 * @typedef {object} DeletedInfo
 * @property {boolean} isDeleted - Flag indicating if the entity is logically deleted. Indexed.
 * @property {mongoose.Schema.Types.ObjectId} isDeletedBy - ID of the user who performed the deletion. References 'User'.
 * @property {Date} deletedAt - Timestamp of the deletion.
 */
const DeletedSchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

/**
 * @typedef {object} Contact
 * @property {mongoose.Schema.Types.ObjectId} _id - Unique ID of the contact (ObjectId).
 * @property {mongoose.Schema.Types.ObjectId} senderId - ID of the user who initiated the contact (reference to Users).
 * @property {mongoose.Schema.Types.ObjectId} receiverId - ID of the professional who received the contact (reference to Users, assuming 'prof' is a role in the User model).
 * @property {string} affair - Type of contact ('cita', 'calificacion', 'rechazo', 'cancelacion', 'reporte').
 * @property {string} cause - Reason for the report (only if affair is 'reporte': 'conducta inapropiada', 'conducta sospechosa', 'estafa', 'negligencia', 'otro').
 * @property {string} description - Description of the report (only if affair is 'reporte').
 * @property {boolean} isDeleted - Indicates if the contact has been logically deleted (default: false, indexed).
 * @property {boolean} isSent - Indicates if the contact has been sent (default: false, indexed).
 * @property {mongoose.Schema.Types.ObjectId} modifiedBy - ID of the admin who last modified the contact (reference to Admin model).
 * @property {Date} creationDate - Date the contact was created (automatically filled, not null).
 * @property {Date} sendDate - Date the contact was sent (automatically filled, not null).
 * @property {Date} modifiedAt - Date the contact was last modified (automatically filled and updated).
 */
const ContactSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User, // Assuming 'prof' is a role within the User model
      required: true,
    },
    affair: {
      type: String,
      enum: [
        "agendarCita",
        "calificacion",
        "rechazo",
        "cancelacion",
        "reporte",
      ],
      required: true,
    },
    cause: {
      type: String,
      enum: [
        "conductaInapropiada",
        "conductaSospechosa",
        "estafa",
        "negligencia",
        "otro",
      ],
      required: function () {
        return this.affair === "reporte";
      },
    },
    description: {
      type: String,
      required: function () {
        return this.affair === "reporte";
      },
    },
    deleted: DeletedSchema,
    isSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sendDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.plugin(moongoosePaginate); //add pagination

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
