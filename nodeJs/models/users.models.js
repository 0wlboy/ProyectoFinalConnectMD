import mongoose, { Schema } from 'mongoose';
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion
import mongooseBcrypt from "mongoose-bcrypt";

/**
 * @typedef Localizacion
 * @property {string} address - Dirección de la localización.
 */
const localizacionSchema = new Schema({
  address: { type: String, required: true },
  numTelf: { type: String },
});

/**
 * @typedef ContactHistory
 * @property {mongoose.Schema.Types.ObjectId} user_id - ID del usuario relacionado con el contacto (referencia a la colección 'Contacts').
 * @property {string} affair - Tipo de contacto realizado.
 * @property {Date} contactDate - Fecha en que se realizó el contacto (se llena automáticamente al crear el documento).
 */
const contactHistorySchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contacts' },
  affair: { type: String, enum: ['agendar cita', 'cancelacion', 'rechazo', 'calificacion', 'reporte'] },
  contactDate: { type: Date, default: Date.now },
});

/**
 * @typedef Review
 * @property {mongoose.Schema.Types.ObjectId} reviewID - ID único de la revisión.
 * @property {mongoose.Schema.Types.ObjectId} userId - ID del usuario que realizó la revisión (referencia a la colección 'User').
 * @property {number} stars - Calificación otorgada (un número entero).
 * @property {mongoose.Schema.Types.ObjectId} modifyBy - ID del usuario o administrador que modificó la revisión por última vez (referencia a la colección 'User' o 'Admin').
 * @property {boolean} is_deleted - Indica si la revisión ha sido eliminada lógicamente (indexado, valor por defecto: false).
 * @property {Date} creationDate - Fecha de creación de la revisión (se llena automáticamente al crear el documento).
 * @property {Date} updateDate - Fecha de última actualización de la revisión (se llena automáticamente al actualizar el documento).
 */
const reviewSchema = new Schema({
  reviewID: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stars: { type: Number },
  modifyBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModelModifyBy' },
  onModelModifyBy: { type: String, enum: ['User', 'Admin'] },
  is_deleted: { type: Boolean, default: false, index: true },
  creationDate: { type: Date, default: Date.now, required: true },
  updateDate: { type: Date, default: Date.now },
});

/**
 * @typedef ProfileVisits
 * @property {mongoose.Schema.Types.ObjectId} userId - ID del usuario que visitó el perfil (referencia a la colección 'User').
 * @property {Date} visitDate - Fecha de la visita (se llena automáticamente al crear el documento).
 */
const profileVisitsSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visitDate: { type: Date, default: Date.now },
});

/**
 * @typedef HistoricalLogin
 * @property {string} device - Dispositivo desde el que se inició sesión.
 * @property {string} location - Ubicación desde donde se inició sesión.
 * @property {string} ip_address - Dirección IP desde donde se inició sesión.
 */
const historicalLoginSchema = new Schema({
  device: { type: String },
  location: { type: String },
  ip_address: { type: String },
});

/**
 * @typedef AccessHistory
 * @property {HistoricalLogin} historicalLogins - Detalles del inicio de sesión histórico.
 * @property {Date} accessed_at - Fecha y hora del acceso.
 */
const accessHistorySchema = new Schema({
  historicalLogins: historicalLoginSchema,
  accessed_at: { type: Date },
});

/**
 * @typedef HistoricalPassword
 * @property {string} historicalPasswords - Contraseña hasheada antigua.
 * @property {Date} change_at - Fecha en que se cambió la contraseña.
 */
const historicalPasswordSchema = new Schema({
  historicalPasswords: { type: String },
  change_at: { type: Date },
});

/**
 * @typedef UserSchema
 * @property {mongoose.Schema.Types.ObjectId} _id - ID único del usuario (generado automáticamente por MongoDB).
 * @property {string} correo - Correo electrónico del usuario (único y no nulo).
 * @property {string} Nombre - Nombre del usuario (no nulo).
 * @property {string} Apellido - Apellido del usuario (no nulo).
 * @property {string} fotoPerfil - URL o ruta a la foto de perfil del usuario (no nulo).
 * @property {Localizacion[]} localizacion - Array de objetos con la dirección y número de teléfono del usuario.
 * @property {string} contraseña - Contraseña hasheada del usuario (única y no nula).
 * @property {string} rol - Rol del usuario (no nulo, valores permitidos: 'cliente', 'prof', 'admin').
 * @property {ContactHistory[]} contact_history - Historial de contactos del usuario (array de referencias a la colección 'Contact').
 * @property {string} [fotosOficinas] - URL o ruta a las fotos de las oficinas del profesional (solo para profesionales).
 * @property {string} [profesion] - Profesión del usuario (solo para profesionales).
 * @property {string} [especializacion] - Especialización del profesional (solo para profesionales).
 * @property {Review[]} review - Revisiones realizadas por o sobre el usuario.
 * @property {ProfileVisits[]} profileVisits - Historial de visitas al perfil del usuario.
 * @property {HistoricalLogin[]} historicalLogins - Historial de inicios de sesión del usuario.
 * @property {AccessHistory[]} access_history - Historial de accesos del usuario.
 * @property {HistoricalPassword[]} historialContraseña - Historial de contraseñas antiguas del usuario.
 * @property {number} TotalLoginCount - Contador total de inicios de sesión (se llena e incrementa automáticamente, no nulo).
 * @property {Date} LastLogin - Fecha del último inicio de sesión (se llena y actualiza automáticamente, no nulo).
 * @property {boolean} IsVerified - Indica si la cuenta del usuario está verificada (valor por defecto: false).
 * @property {number} strikes - Número de strikes o penalizaciones del usuario (valor por defecto: 0).
 * @property {boolean} isSuspended - Indica si la cuenta del usuario está suspendida (valor por defecto: false).
 * @property {boolean} is_deleted - Indica si el usuario ha sido eliminado lógicamente (indexado, valor por defecto: false).
 * @property {object} old_data - Snapshot de los datos del usuario antes de la última modificación.
 * @property {mongoose.Schema.Types.ObjectId} modified_by - ID del administrador o usuario que modificó el perfil por última vez (referencia a la colección 'Admin' o 'User').
 * @property {Date} fechaCreacion - Fecha de creación del usuario (se llena automáticamente al crear el documento, no nulo).
 * @property {Date} fechaModificacion - Fecha de última modificación del usuario (se llena y actualiza automáticamente).
 */
const userSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  correo: { type: String, unique: true, required: true },
  Nombre: { type: String, required: true },
  Apellido: { type: String, required: true },
  fotoPerfil: { type: String, required: true },
  localizacion: [localizacionSchema],
  password: { type: String, bcrypt: true , unique: true, required: true },
  rol: { type: String, enum: ['cliente', 'prof', 'admin'], required: true },
  contact_history: [contactHistorySchema],
  fotosOficinas: { type: String },
  profesion: { type: String },
  especializacion: { type: String },
  review: [reviewSchema],
  profileVisits: [profileVisitsSchema],
  historicalLogins: [historicalLoginSchema],
  access_history: [accessHistorySchema],
  historialPassword: [historicalPasswordSchema],
  TotalLoginCount: { type: Number, default: 0, required: true },
  LastLogin: { type: Date, default: Date.now, required: true },
  IsVerified: { type: Boolean, default: false },
  strikes: { type: Number, default: 0 },
  isSuspended: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false, index: true },
  old_data: { type: Object },
  modified_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModelModifiedBy' },
  onModelModifiedBy: { type: String, enum: ['Admin', 'User'] },
  fechaCreacion: { type: Date, default: Date.now, required: true },
  fechaModificacion: { type: Date, default: Date.now },
});


userSchema.plugin(moongoosePaginate);//agregar paginacion al esquema
userSchema.plugin(mongooseBcrypt);//agregar encriptacion

// Middleware para actualizar la fecha de modificación al guardar
userSchema.pre('save', function (next) {
  this.fechaModificacion = new Date();
  next();
});

// Middleware para actualizar la fecha del último login
userSchema.pre('save', function (next) {
  if (this.isModified('TotalLoginCount') && this.TotalLoginCount > 0) {
    this.LastLogin = new Date();
  }
  next();
});

const User = mongoose.model('User', userSchema);

//exportar modelo
export default User;
