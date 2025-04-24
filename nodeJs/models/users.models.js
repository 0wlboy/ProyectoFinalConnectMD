import mongoose, { Schema } from 'mongoose';
import mongooseBcrypt from "mongoose-bcrypt";
import moongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion


// Expresiones regulares para validaciones
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; //Minimo 8 caracteres, almenos una minuscula, una mayuscula, un caracter especial: @$!%*?& 

/**
 * @typedef {object} ContactHistory
 * @property {mongoose.Schema.Types.ObjectId} userId - ID of the related user.
 * @property {string} affair - Type of contact (schedule appointment, cancellation, rejection, rating, report).
 * @property {Date} contactDate - Date of contact (automatically filled).
 */
const contactHistorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  },
  affair: {
    type: String,
    enum: ['agendarCita', 'cancelacion', 'rechazo', 'calificacion', 'reporte'],
  },
  contactDate: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef {object} Review
 * @property {mongoose.Schema.Types.ObjectId} reviewId - ID of the review.
 * @property {mongoose.Schema.Types.ObjectId} userId - ID of the user who created the review (reference to Users).
 * @property {number} stars - Star rating.
 * @property {mongoose.Schema.Types.ObjectId} modifiedBy - ID of the user or admin who modified the review (reference to Users or Admin).
 * @property {boolean} isDeleted - Indicates if the review has been logically deleted (default: false, indexed).
 * @property {Date} createdAt - Date the review was created (automatically filled, not null).
 * @default Date.now
 * @property {Date} updateAt - Date the review was last updated (automatically filled and updated).
 * @default Date.now
 */
const reviewSchema = new Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'modifiedByType',
  },
  modifiedByType: {
    type: String,
    enum: ['User', 'Admin'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
},
{
  timestamps: true,
});

/**
 * @typedef {object} ProfileVisit
 * @property {mongoose.Schema.Types.ObjectId} userId - ID of the user who visited the profile (reference to Users).
 * @property {Date} visitDate - Date of the visit (automatically filled).
 */
const profileVisitSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef {object} HistoricalLogin
 * @property {string} device - Device from which the login occurred.
 * @property {string} location - Location from which the login occurred.
 * @property {string} ipAddress - IP address from which the login occurred.
 * @property {Date} accessedAt - Date and time of login (only for accessHistory).
 */
const historicalLoginSchema = new Schema({
  device: String,
  location: String,
  ipAddress: String,
  accessedAt: Date, // Only for accessHistory
});

/**
 * @typedef {object} HistoricalPassword
 * @property {string} password - Hashed password.
 * @property {Date} changedAt - Date when the password was changed.
 */
const historicalPasswordSchema = new Schema({
  password: String, // Expected to be already hashed
  changedAt: Date,
});

/**
 * @typedef {object} Location
 * @property {string} address - Address of the location (not null).
 * @property {string} phone - Phone number of the location.
 */
const locationSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  phone: String,
});

/**
 * @typedef {object} User
 * @property {mongoose.Schema.Types.ObjectId} _id - Unique ID of the user (ObjectId).
 * @property {string} email - Unique and non-null email address, with format validation.
 * @property {string} firstName - First name of the user (not null, with format validation).
 * @property {string} lastName - Last name of the user (not null, with format validation).
 * @property {string} profilePicture - URL or path to the profile picture (not null).
 * @property {Location[]} locations - Array of location objects.
 * @property {string} password - Hashed, unique, and non-null password.
 * @property {string} role - User role ('cliente', 'prof', 'admin', not null).
 * @property {ContactHistory[]} contactHistory - History of contacts.
 * @property {string} officePictures - URL or path to the office pictures (only for professionals, not null).
 * @property {string} profession - Profession of the user (only for professionals, not null).
 * @property {Review[]} reviews - Reviews created by or about the user.
 * @property {ProfileVisit[]} profileVisits - History of profile visits.
 * @property {HistoricalLogin[]} historicalLogins - History of login attempts.
 * @property {HistoricalLogin[]} accessHistory - History of successful logins.
 * @property {HistoricalPassword[]} passwordHistory - History of passwords.
 * @property {number} totalLoginCount - Total number of logins (automatically filled and incremented, not null).
 * @property {Date} lastLogin - Date of the last login (automatically filled and updated, not null).
 * @property {boolean} isVerified - Indicates if the account is verified (default: false).
 * @property {number} strikes - Number of strikes or warnings (default: 0).
 * @property {boolean} isSuspended - Indicates if the account is suspended (default: false).
 * @property {boolean} isDeleted - Indicates if the user has been logically deleted (default: false, indexed).
 * @property {object} oldData - Snapshot of the data before the last modification.
 * @property {mongoose.Schema.Types.ObjectId} modifiedBy - ID of the admin or user who last modified the record (reference to Admin or Users).
 * @property {Date} createdAt - Date the user was created (automatically filled, not null).
 * @default Date.now
 * @property {Date} updateAt - Date the user was last modified (automatically filled and updated).
 * @default Date.now
 */
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo electrónico es obligatorio.'],
    match: [emailRegex, 'Por favor, introduce un correo electrónico válido.'],
  },
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    match: [nameRegex, 'El nombre solo puede contener letras y espacios.'],
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio.'],
    match: [nameRegex, 'El apellido solo puede contener letras y espacios.'],
  },
  profilePicture: {
    type: String,
    required: [true, 'La foto de perfil es obligatoria.'],
  },
  locations: [locationSchema],
  password: {
    type: String,
    unique: true,
    bcrypt: true,
    required: [true, 'La contraseña es obligatoria.'],
    match: [passwordRegex, 'La contraseña debe tener al menos 6 caracteres.'],
  },
  role: {
    type: String,
    enum: ['cliente', 'prof', 'admin'],
    required: [true, 'El rol es obligatorio.'],
  },
  contactHistory: [contactHistorySchema],
  officePictures: {
    type: String,
    required: function () {
      return this.role === 'prof';
    },
    default: null,
  },
  profession: {
    type: String,
    enum: ['odontologo', 'medico general', 'cardiologo', 'pediatra', 'psicologo','fisioterapeuta','enfermero','ginecologo'],
    required: function () {
      return this.role === 'prof';
    },
    default: null,
  },
  reviews: [reviewSchema],
  profileVisits: [profileVisitSchema],
  historicalLogins: [historicalLoginSchema],
  accessHistory: [historicalLoginSchema],
  passwordHistory: [historicalPasswordSchema],
  totalLoginCount: {
    type: Number,
    default: 0,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  strikes: {
    type: Number,
    default: 0,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  oldData: {
    type: Object,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'modifiedByType',
  },
  modifiedByType: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente',
  },
},
{
  timestamps: true,
});

UserSchema.plugin(moongoosePaginate);//add pagination
UserSchema.plugin(mongooseBcrypt);//add encryption


// Middleware to increment the login count on updating lastLogin
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.lastLogin) {
    await this.model.updateOne({ _id: this.getQuery()._id }, { $inc: { totalLoginCount: 1 } });
  }
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;