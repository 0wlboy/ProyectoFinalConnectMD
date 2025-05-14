import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import User from "./user.model.js";

/**
 * @typedef {object} DeletedSchema
 * @property {boolean} isDeleted  - Flag that indicate if the user is logicaly deleted
 * @property {objectId} isDeletedBy - ID of the user how deleted the element
 * @property {date} deletedAt - date of deletion
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
      ref: "User",
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
 * @typedef {object} Modification - Represents a modification made to an appointment.
 * @property {mongoose.Schema.Types.ObjectId} userId - ID of the user who made the modification. References 'User'. Required.
 * @property {Date} modifiedDate - Date and time of the modification. Defaults to the current date and time.
 */
const modifactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: [true, "El ID del usuario es obligatorio."],
    },
    modifiedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * @typedef {object} Appointment
 * @property {mongoose.Schema.Types.ObjectId} clientId - ID of the client requesting the appointment. References 'User'. Required.
 * @property {mongoose.Schema.Types.ObjectId} profId - ID of the professional with whom the appointment is scheduled. References 'User'. Required.
 * @property {string} status - Current status of the appointment. Values: 'tentativo', 'aceptado', 'rechazado', 'cancelado', 'reorganizado'. Required. Default: 'tentativo'.
 * @property {string} office - Address of the office where the appointment will take place. Required.
 * @property {Date} appointmentDateTime - Complete date and time of the appointment. Required.
 * @property {object} [oldData] - Stores the previous version of the appointment data before an update.
 * @property {DeletedSchema} deleted - schema that storage deletion information
 * @property {modificationSchema []} modificationHistory - An array storing the history of modifications.
 * @property {Date} createdAt - Date of document creation. Managed by Mongoose (timestamps).
 * @property {Date} updatedAt - Date of the last document update. Managed by Mongoose (timestamps).
 */
const appointmentSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "El ID del cliente es obligatorio."],
      index: true,
    },
    profId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "El ID del profesional es obligatorio."],
      index: true,
    },
    status: {
      type: String,
      required: [true, "El estado de la cita es obligatorio."],
      enum: {
        values: [
          "tentativo",
          "aceptado",
          "rechazado",
          "cancelado",
          "reorganizado",
        ],
      },
      default: "tentativo",
      index: true,
    },
    office: {
      type: String,
      required: [true, "La oficina de la cita es requerida"],
    },
    appointmentDateTime: {
      type: Date,
      required: [true, "La fecha y la hora de la cita son requeridas"],
    },
    oldData: {
      type: Object,
    },
    deleted: DeletedSchema,
    modificationHistory: [modifactionSchema],
  },
  {
    timestamps: true,
  }
);

// --- Plugins ---
appointmentSchema.plugin(mongoosePaginate); // Add if you need pagination

// --- Middleware for oldData ---
appointmentSchema.pre("save", async function (next) {
  if (!this.isNew) {
    try {
      const oldDoc = await this.constructor.findById(this._id).lean();
      if (oldDoc) {
        delete oldDoc.oldData;
        delete oldDoc._id;
        delete oldDoc.createdAt;
        delete oldDoc.updatedAt;

        this.oldData = oldDoc;
      } else {
        this.oldData = {};
      }
    } catch (error) {
      console.error("Error al capturar oldData en pre-save:", error);
      this.oldData = { error: "Fallo al capturar estado previo" };
    }
  }
  next();
});

// --- Indexes ---
// Compound index to search for a professional's appointments within a date range
appointmentSchema.index({ profId: 1, appointmentDateTime: 1 });
// Compound index to search for a client's appointments within a date range
appointmentSchema.index({ clientId: 1, appointmentDateTime: 1 });

// --- Model ---
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
