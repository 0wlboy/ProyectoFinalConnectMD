import mongoose, { Schema } from 'mongoose';
import mongooseBcrypt from "mongoose-bcrypt";
import mongoosePaginate from "mongoose-paginate-v2"; //importar modulo paginacion

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex =  /^[a-zA-ZáéíóúüñÑ\s'`-]+$/;
// Minimum 8 characters, at least one lowercase, one uppercase, one number, and one special character: @$!%*?&
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_()'¡¿])[A-Za-z\d@$!%*?&]{8,}$/;


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
 * @typedef {object} HistoricalLogin
 * @property {Date} loginDate - The date and time of the login attempt.
 * @property {string} device - The device information from which the login occurred. Required.
 * @property {string} ip - The IP address from which the login occurred. Required.
 */
const HistoricalLogin = new Schema({
  loginDate: {
    type: Date,
    default: Date.now,
  },
  device:{
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  }
},{_id: false}); 

/**
 * @typedef {object} HistoricalPassword
 * @property {string} password - The hashed password string.
 * @property {Date} [changedAt=Date.now] - The date and time when this password was set.
 */
const HistoricalPassword = new Schema({
  password: {
    type: String,
    required: true,
  }, // Expected to be already hashed
  changedAt:{
    type: Date,
    default: Date.now, // Or set explicitly in pre-save middleware
  }
},{_id: false}); // No separate _id for subdocuments

/**
 * @typedef {object} User
 * @property {mongoose.Schema.Types.ObjectId} _id - Unique identifier for the user document (automatically generated).
 * @property {string} email - The user's email address. Must be unique, required, and match email format. Trimmed and lowercased.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} profilePicture - URL or path to the user's profile picture.
 * @property {Array<Object>} locations - An array of user's locations (e.g., office addresses).
 * @property {string} password - The user's hashed password. Required and must meet complexity requirements (handled by mongoose-bcrypt).
 * @property {string} role - The user's role within the system. Required. Must be one of 'cliente', 'prof', or 'admin'.
 * @property {string|null} profession - The user's profession. Required only if `role` is 'prof'. Must be one of the specified enum values or null. Defaults to null.
 * @property {string[]} officePictures - An array of URLs or paths to office pictures. Required only if `role` is 'prof'.
 * @property {HistoricalLogin[]} historicalLogins - An array storing the history of user logins (limited to the last 5 by middleware).
 * @property {HistoricalPassword[]} passwordHistory - An array storing the history of the user's last 3 passwords (managed by middleware).
 * @property {number} totalLoginCount - A counter for the total number of successful logins. Incremented by middleware.
 * @property {Date|null} lastLogin - The timestamp of the user's last successful login. Updated by middleware. Defaults to null.
 * @property {boolean} isVerified - Flag indicating if the user's account has been verified. Defaults to false.
 * @property {boolean} isSuspended - Flag indication if the user is suspended. Defaults to false.
 * @property {DeletedSchema} deleted - Object for the information of deletion
 * @property {number} strikes - A counter for warnings or strikes against the user account. Defaults to 0.
 * @property {Object} oldData - A field potentially used to store a snapshot of user data before modification (consider alternatives for large objects).
* @property {ModificationRecord[]} modificationHistory - Array tracking modification history.
 * @property {Date} createdAt - Timestamp indicating when the user document was created.
 * @property {Date} updatedAt - Timestamp indicating when the user document was last updated.
 */
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true, 
    required: [true, 'El email es requerido.'],
    match: [emailRegex, 'Por favor introduce un email válido.'],
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido.'],
    match: [nameRegex, 'El nombre solo puede contener letras y espacios.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido.'],
    match: [nameRegex, 'El apellido solo puede contener letras y espacios.'],
    trim: true,
  },
  profilePicture: {
    type: String,
    required: [true, 'La foto de perfil es requerida.'],
  },
  locations: [{
    address: {
      type: String,
      required: true,
    }
  }],
  password: {
    type: String,
    bcrypt: true, // Handled by mongoose-bcrypt plugin
    required: [true, 'La contraseña es requerida.'],
    //match: [passwordRegex, 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y un carácter especial (@$!%*?&).'],
  },
  role: {
    type: String,
    enum: ['cliente', 'prof', 'admin'],
    required: [true, 'El rol es requerido.'],
  },
  profession: {
    type: String,
    enum: ['odontologo', 'medico general', 'cardiologo', 'pediatra', 'psicologo','fisioterapeuta','enfermero','ginecologo', null],
    required: function () {
      return this.role === 'prof';
    },
    default: null,
  },
  officePictures:[{
    type: String,
    required: function (){
      return this.role === 'prof'
    },
  }],
  historicalLogins: [HistoricalLogin],
  passwordHistory: [HistoricalPassword],
  totalLoginCount: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: null, // Explicitly null if user hasn't logged in yet
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  strikes: {
    type: Number,
    default: 3,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
 deleted : DeletedSchema,
  oldData: { 
    type: Object,
  },
  modificationHistory : [{
          userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
          },
          modifiedDate: {
              type: Date,
              default: Date.now,
          }
      }],
},
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// --- Plugins ---
UserSchema.plugin(mongoosePaginate); // Adds pagination capabilities
UserSchema.plugin(mongooseBcrypt); // Handles password hashing automatically

// --- Middleware for Password History ---
UserSchema.pre('save', async function (next) {
  // Only run if password was modified and it's not a new document
  if (this.isModified('password') && !this.isNew) {
    try {
      // Fetch the document *before* the save to get the old password hash
      const userBeforeSave = await this.constructor.findById(this._id).select('password').lean();

      if (userBeforeSave && userBeforeSave.password) {
        // Add the PREVIOUS password to the beginning of the history array
        this.passwordHistory.unshift({
          password: userBeforeSave.password,
          changedAt: new Date() // Record the time of change
        });

        // Keep only the latest 3 passwords in history
        this.passwordHistory = this.passwordHistory.slice(0, 3);
      }
    } catch (error) {
      console.error('Error updating password history:', error);
      // Decide if the save operation should be stopped:
      // next(error);
    }
  }
  next(); // Continue the save operation
});

// --- Middleware to Increment Login Count ---
UserSchema.pre('save', async function (next) {
  if (this.isModified('lastLogin') && this.lastLogin !== null) {
    this.totalLoginCount = (this.totalLoginCount || 0) + 1;
  }
  next(); // Continue the save operation
});

// --- Middleware to Limit Login History ---
UserSchema.pre('save', function (next) {
  // Check if historicalLogins exists and exceeds the limit
  if (this.historicalLogins && this.historicalLogins.length > 5) {
    // Keep only the last 5 login records (most recent)
    this.historicalLogins = this.historicalLogins.slice(-5);
  }
  next(); // Continue the save operation
});

// --- Middleware for oldData ---
UserSchema.pre('save', async function(next) {
  if (!this.isNew) {
    try {
      const oldDoc = await this.constructor.findById(this._id).lean();
      if (oldDoc) {
        delete oldDoc.oldData; 
        delete oldDoc.passwordHistory; 
        delete oldDoc.historicalLogins; 
        delete oldDoc._id; 
        delete oldDoc.createdAt; 
        delete oldDoc.updatedAt;
        delete oldDoc.password; 

        this.oldData = oldDoc;
      } else {
        this.oldData = {};
      }
    } catch (error) {
      console.error('Error al capturar oldData en pre-save:', error);
      this.oldData = { error: 'Fallo al capturar estado previo' };
    }
  }
  next(); 
});

// --- Model Export ---
const User = mongoose.model('User', UserSchema);

export default User;
