import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion

/**
 * @typedef ReportDetails
 * @property {string} cause - Causa del reporte.
 * @property {string} description - Descripción detallada del reporte.
 */
const reportDetailsSchema = new Schema({
  cause: { type: String, enum: ['condcta inapropiada', 'conducta sospechosa', 'estafa', 'negligencia', 'otro'] },
  description: { type: String },
});

/**
 * @typedef ContactSchema
 * @property {mongoose.Schema.Types.ObjectId} _id - ID único del contacto/interacción (generado automáticamente por MongoDB).
 * @property {mongoose.Schema.Types.ObjectId} senderId - ID del usuario que inicia el contacto (referencia a la colección 'User').
 * @property {mongoose.Schema.Types.ObjectId} reciverId - ID del profesional que recibe el contacto (referencia a la colección 'User' con rol 'prof').
 * @property {string} affair - Tipo de interacción o asunto del contacto.
 * @property {ReportDetails} [report] - Detalles específicos si el asunto es un 'reporte'.
 * @property {boolean} is_deleted - Indica si este contacto ha sido eliminado lógicamente (indexado, valor por defecto: false).
 * @property {boolean} is_sent - Indica si este contacto ha sido enviado (indexado, valor por defecto: false).
 * @property {mongoose.Schema.Types.ObjectId} modified_by - ID del administrador que modificó este contacto por última vez (referencia a la colección 'Admin').
 * @property {Date} creationDate - Fecha de creación del contacto (se llena automáticamente al crear el documento, no nulo).
 * @property {Date} sendDate - Fecha en que se envió el contacto (se llena automáticamente al crear el documento, no nulo).
 * @property {Date} modifiedAt - Fecha de última modificación del contacto (se llena y actualiza automáticamente).
 */
const contactSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reciverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  affair: { type: String, enum: ['cita', 'calificacion', 'rechazo', 'cancelacion', 'reporte'], required: true },
  report: { type: reportDetailsSchema, required: function() { return this.affair === 'reporte'; } },
  is_deleted: { type: Boolean, default: false, index: true },
  is_sent: { type: Boolean, default: false, index: true },
  modified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  creationDate: { type: Date, default: Date.now, required: true },
  sendDate: { type: Date, default: Date.now, required: true },
  modifiedAt: { type: Date, default: Date.now },
});

// Middleware para actualizar la fecha de modificación al guardar
contactSchema.pre('save', function (next) {
  this.modifiedAt = new Date();
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;