import Appointment from "../models/appointment.model.js";
import User from  "../models/user.model.js"
import mongoose from 'mongoose';

// Controller function to get all appointments
/**
 * @async
 * @function getAllAppointments
 * @description Retrieves all appointments from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 * @returns {Array<Appointments>} - Array of appointments objects.
 */
export const getAllAppointments = async (req, res) => {
  const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'} = req.query;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
  };

    try {
        const result = await Appointment.paginate(options);
        const appointment = result.docs;
        const totalAppointment = result.total;

        res.status(200).json({
        appointment,
        page,
        limit,
        total: totalAppointment,
        totalPages: result.totalPages,
        }); // 200 OK

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas' });
        console.error("Error al obtener las citas:", error);
    }
};

// Controller function to get appointments by client ID
/**
 * @async
 * @function getAllAppointmentsByClientId
 * @description Retrieves appointments for a specific client from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.clienteId - The ID of the client.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 */
export const getAllAppointmentsByClientId = async (req, res) => {
  const { clientId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    try {
      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ message: 'ID del cliente invalido' });
      }

      const clientExists = await User.findById(clientId).select('_id').lean();
      if (!clientExists) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        lean: true,
      };

      const query = { clientId: clientId };
      const result = await Appointment.paginate(query, options);
      const appointment = result.docs;
      const totalAppointment = result.totalDocs;

      res.status(200).json({
        appointment,
        page,
        limit,
        total: totalAppointment,
        totalPages: result.totalPages,
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(`Error al obtener las citas por el ID del cliente ${clientId}:`, error);
    }
};

// Controller function to get appointments by profesional ID
/**
 * @async
 * @function getAllAppointmentsByProftId
 * @description Retrieves appointments for a specific profesional from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.profId - The ID of the profesional.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 */
export const getAllAppointmentsByProfId = async (req, res) => {
  const { profId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    try {
      if (!mongoose.Types.ObjectId.isValid(profId)) {
        return res.status(400).json({ message: 'ID del profesional invalido' });
      }

      const profExists = await User.findById(profId).select('_id').lean();
      if (!profExists) {
          return res.status(404).json({ message: 'Profesional no encontrado' });
      }

      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        lean: true,
      };

      const query = { profId: profId };
      const result = await Appointment.paginate(query, options);
      const appointment = result.docs;
      const totalAppointment = result.totalDocs;

      res.status(200).json({
        appointment,
        page,
        limit,
        total: totalAppointment,
        totalPages: result.totalPages,
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(`Error al obtener las citas por el ID del profesional ${profId}:`, error);
    }
};

// Controller function to create a appointment
/**
 * @async
 * @function createAppointment
 * @description Creates a new appointment record in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object. 
 * @param {string} req.body.clientId - The ID of the client requesting the appointment.
 * @param {string} req.body.profId - The ID of the professional with whom the appointment is scheduled.
 * @param {string} req.body.status - The status of the appointment.
 * @param {string} req.body.office - The office where the appointment will take place.
 * @param {Date} req.body.appointmentDateTime - The date and time of the appointment.
 * @returns {string} message - A success or error message.
 */
export const createAppointment = async (req, res) => {
  const { clientId, profId, status, office, appointmentDateTime } = req.body; 
    try {

      if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'ID del cliente invalida' }); // 400 Bad Request
      }

      if (!mongoose.Types.ObjectId.isValid(profId)) {
        return res.status(400).json({ message: 'ID del profesional invalida' }); // 400 Bad Request
      }

      if (clientId === profId) {
        return res.status(400).json({ message: 'El cliente y el profesional no pueden ser iguales' });
      }

      const clientExists = await User.findById(clientId).select('_id').lean();
      if (!clientExists) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const profExists = await User.findById(profId).select('_id').lean();
      if (!profExists) {
          return res.status(404).json({ message: 'Profesional no encontrado' });
      }

      const appointment = new Appointment({clientId, profId, status, office, appointmentDateTime});
      await appointment.save();

      res.status(201).json({ message: 'Cita creada con exito' }); // 201 Created
    } catch (error) {
      // Handle specific Mongoose errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Error de validacion', errors: error.errors }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Error de servidor interno', error }); // 500 Internal Server Error
      console.error("Error al crear cita:", error);
    }
}

/**
 * @async
 * @function updateAppointment
 * @description Updates an existing appointment in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the appointment to update.
 * @param {string} [req.body.status] - The new status of the appointment.
 * @param {string} [req.body.office] - The new office for the appointment.
 * @param {Date} [req.body.appointmentDateTime] - The new date and time for the appointment.
 * @returns {string} message - A success or error message.
 */
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {modifydBy, status, office, appointmentDateTime } = req.body;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Id de cita invalido' });
        }

     const user = await User.findById(modifydBy);
        if(!user){
          return res.status(404).json({ message: 'Usuario modificador no encontrado' });
        }

   const updateAppointment = await Appointment.findByIdAndUpdate(
    id, 
    {status, office, appointmentDateTime, $push:{modificationHistory: {userId: modifydBy, modifiedDate: new Date()}}},
    { runValidators: true}
   );
   
   if(!updateAppointment){
    return res.status(404).json({ message: 'Cita no encontrada' });
   }
   res.status(200).json({ message: 'Cita actualizada con exito' });
   }catch(error){
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar cita', error });
   }
  }

  
// Controller function to delete a appointment
/**
 * @async
 * @function deleteAppointment
 * @description Logically deletes a appointment by setting the 'deleted' flag.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the appointment to delete.
 * @param {string} req.body.deletedBy - The ID of the user performing the deletion. 
 * @returns {string} message
 */
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const { deletedBy } = req.body; 

  try {
    // Validate the ID of the appointment to be deleted
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cita inválido' }); 
    }
    // Validate the ID of the user performing the deletion
    if (!mongoose.Types.ObjectId.isValid(deletedBy)) {
      return res.status(400).json({ message: 'ID de usuario eliminador inválido' });
    }

    const userId = await User.findById(deletedBy);
    
    if(!userId){
      return res.status(404).json({ message: 'Usuario eliminador no encontrado' });
    }
    
    // Find the appointment by ID
    const appointment = await Appointment.findById(id);

    // Handle case where appointment is not found
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Check if already deleted to avoid redundant saves (optional but good practice)
    if (appointment.deleted?.isDeleted) {
         return res.status(200).json({ message: 'La cita ya ha sido eliminada previamente' });
    }

    appointment.deleted = { isDeleted: true, isDeletedBy: deletedBy, deletedAt: new Date() }; 

    appointment.modificationHistory.push({ userId: deletedBy, modifiedDate: new Date() });

    await appointment.save();

    // Send success response
    res.status(200).json({ message: 'Cita eliminada con éxito' });

    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la cita', error });
    }
    }

const AppointmentController = {
    getAllAppointments,
    getAllAppointmentsByClientId,
    getAllAppointmentsByProfId,
    createAppointment,
    updateAppointment,
    deleteAppointment
};

export default AppointmentController;
