import ProfileVisit from "../models/profileVisits.model.js";
import User from  "../models/user.model.js"
import mongoose from 'mongoose';

// Controller function to get all profile visits
/**
 * @async
 * @function getAllProfileVisits
 * @description Retrieves all profile visits from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 * @returns {Array<ProfileVisit>} - Array of profile visit objects.
 */
export const getAllProfileVisits = async (req, res) => {
  const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'} = req.query;

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    lean: true 
  };

    try {
        const result = await ProfileVisit.paginate(options);
        const profileVisits = result.docs;
        const totalProfileVisits = result.total;

        res.status(200).json({
        profileVisits,
        page,
        limit,
        total: totalProfileVisits,
        totalPages: result.totalPages,
        }); // 200 OK

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener visitas' });
        console.error("Error al obtener las visitas de perfil:", error);
    }
};

// Controller function to get profile visits by host ID
/**
 * @async
 * @function getProfileVisitsByHostId
 * @description Retrieves profile visits for a specific host from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.hostId - The ID of the host.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 */
export const getProfileVisitsByHostId = async (req, res) => {
  const { hostId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    try {
      if (!mongoose.Types.ObjectId.isValid(hostId)) {
        return res.status(400).json({ message: 'ID de anfitrion invalido' });
      }

      const hostExists = await User.findById(hostId).select('_id').lean();
      if (!hostExists) {
          return res.status(404).json({ message: 'Anfitrion no encontrado' });
      }

      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        lean: true,
      };

      const query = { hostId: hostId };
      const result = await ProfileVisit.paginate(query, options);
      const profileVisits = result.docs;
      const totalProfileVisits = result.total;

      res.status(200).json({
        profileVisits,
        page,
        limit,
        total: totalProfileVisits,
        totalPages: result.totalPages,
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(`Error al obtener las visitas de perfil por el ID de anfitrion ${hostId}:`, error);
    }
};

// Controller function to get profile visits by visitor ID
/**
 * @async
 * @function getProfileVisitsByVisitorId
 * @description Retrieves profile visits for a specific visitor from the database. Supports pagination, sorting, and filtering.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.visitorId - The ID of the visitor.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum number of items per page.
 */
export const getProfileVisitsByVisitorId = async (req, res) => {
  const { visitorId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    try {
      if (!mongoose.Types.ObjectId.isValid(visitorId)) {
        return res.status(400).json({ message: 'ID de visitante invalida' });
      }

      const visitorExists = await User.findById(visitorId).select('_id').lean();
      if (!visitorExists) {
          return res.status(404).json({ message: 'Visitante no encontrado' });
      }

      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        lean: true,
      };

      const query = { visitorId: visitorId };
      const result = await ProfileVisit.paginate(query, options);
      const profileVisits = result.docs;
      const totalProfileVisits = result.total;

      res.status(200).json({
        profileVisits,
        page,
        limit,
        total: totalProfileVisits,
        totalPages: result.totalPages,
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(`Error al obtener las visitas de perfil por el ID de visitante ${visitorId}:`, error);
    }
};


/**
 * @async
 * @function getProfileVisitsMetrics
 * @description Retrieves metrics for profile visits for a specific host, including visits grouped by day and total visit count.
 *              Supports filtering by a date range.
 * @param {Object} req - HTTP request object.
 * @param {string} req.params.id - The ID of the host user (professional) whose profile metrics are being requested.
 * @param {string} [req.query.startDate] - Optional start date for filtering visits (YYYY-MM-DD).
 * @param {string} [req.query.endDate] - Optional end date for filtering visits (YYYY-MM-DD).
 * @param {Object} res - HTTP response object.
 * @returns {Object} JSON response with `visitsByDay` (array of objects with date and count) and `totalVisitCount` (number).
 * @example GET /api/profileVisit/profile/60d5ecb8d7f8f8001f8e8c1a/metrics?startDate=2023-01-01&endDate=2023-12-31
 */
export const getProfileVisitsMetrics = async (req, res) => {
  try {
    const { id: hostIdString } = req.params;
    const { startDate, endDate } = req.query;

    if (!mongoose.Types.ObjectId.isValid(hostIdString)) {
      return res.status(400).json({ message: 'ID de anfitrión inválido.' });
    }

    const hostObjectId = mongoose.Types.ObjectId(hostIdString);

    const hostExists = await User.findById(hostObjectId).select('_id').lean();
    if (!hostExists) {
      return res.status(404).json({ message: 'Anfitrión no encontrado.' });
    }

    const filter = { hostId: hostObjectId };

    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        return res.status(400).json({ message: 'Fechas de inicio o fin inválidas.' });
      }
      if (sDate > eDate) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
      }
      // Adjust endDate to include the whole day
      eDate.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: sDate,
        $lte: eDate,
      };
    } else if (startDate || endDate) {
      // If only one date is provided, it might be an indication of a partial/incorrect request
      return res.status(400).json({ message: 'Debe proporcionar tanto startDate como endDate para filtrar por fecha, o ninguna.' });
    }

    const visitsByDay = await ProfileVisit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sorts by date string ascending
    ]);

    const totalVisitCount = visitsByDay.reduce((sum, item) => sum + item.count, 0);

    res.status(200).json({
      visitsByDay,
      totalVisitCount,
      filtersApplied: {
        hostId: hostIdString,
        ...(startDate && endDate && { startDate, endDate })
      }
    });
  } catch (error) {
    console.error(`Error al obtener las métricas de visitas para el anfitrión ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener las métricas de visitas.', error: error.message });
  }
};


// Controller function to create a profile visit
/**
 * @async
 * @function createProfileVisit
 * @description Creates a new profile visit record in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.body.visitorId - The ID of the user visiting the profile.
 * @param {string} req.body.hostId - The ID of the user whose profile is being visited.
 * @returns {string} message
 */
export const createProfileVisit = async (req, res) => {
  const { visitorId, hostId } = req.body;
    try {

      if (!mongoose.Types.ObjectId.isValid(visitorId)) {
            return res.status(400).json({ message: 'ID de visitante invalida' }); // 400 Bad Request
      }

      if (!mongoose.Types.ObjectId.isValid(hostId)) {
        return res.status(400).json({ message: 'ID de anfitrion invalida' }); // 400 Bad Request
      }

      if (visitorId === hostId) {
        return res.status(400).json({ message: 'El visitante y el anfitrion no pueden ser iguales' });
      }

      const visitorExists = await User.findById(visitorId).select('_id').lean();
      if (!visitorExists) {
          return res.status(404).json({ message: 'Visitante no encontrado' });
      }

      const hostExists = await User.findById(hostId).select('_id').lean();
      if (!hostExists) {
          return res.status(404).json({ message: 'Anfitrion no encontrado' });
      }

      const visit = new ProfileVisit({ visitorId, hostId });
      await visit.save();

      res.status(201).json({ message: 'Visita creada con exito' }); // 201 Created
    } catch (error) {
      // Handle specific Mongoose errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Error de validacion', errors: error.errors }); // 400 Bad Request
      }
      res.status(500).json({ message: 'Error de servidor interno', error }); // 500 Internal Server Error
      console.error("Error al crear visita:", error);
    }
}


// Controller function to delete a profile visit
/**
 * @async
 * @function deleteProfileVisit
 * @description Logically deletes a profile visit by setting the 'deleted' flag.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the profile visit to delete.
 * @param {string} req.body.deletedBy - The ID of the user performing the deletion. 
 * @returns {string} message
 */
export const deleteProfileVisit = async (req, res) => {
  const { id } = req.params;
  const { deletedBy } = req.body; 

  try {
    // Validate the ID of the profile visit to be deleted
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de visita de perfil inválido' }); 
    }
    // Validate the ID of the user performing the deletion
    if (!mongoose.Types.ObjectId.isValid(deletedBy)) {
      return res.status(400).json({ message: 'ID de usuario eliminador inválido' });
    }

    const userId = await User.findById(deletedBy);
    
    if(!userId){
      return res.status(404).json({ message: 'Usuario eliminador no encontrado' });
    }
    
    // Find the profile visit by ID
    const profileVisit = await ProfileVisit.findById(id);

    // Handle case where profile visit is not found
    if (!profileVisit) {
      return res.status(404).json({ message: 'Visita de perfil no encontrada' });
    }

    // Check if already deleted to avoid redundant saves (optional but good practice)
    if (profileVisit.deleted?.isDeleted) {
         return res.status(200).json({ message: 'La visita de perfil ya ha sido eliminada previamente' });
    }

    // Since ProfileVisit doesn't have a 'deleted' field, we'll remove it completely
    // The model has 'delete' field, not 'deleted'. And no 'modificationHistory'
    profileVisit.delete = { isDeleted: true, isDeletedBy: mongoose.Types.ObjectId(deletedBy), deletedAt: new Date()};

    // profileVisit.modificationHistory.push({ userId: deletedBy, modifiedDate: new Date() }); // This field does not exist on ProfileVisit model

    await profileVisit.save(); // Save the changes
    // Send success response
    res.status(200).json({ message: 'Visita de perfil eliminada con éxito' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la visita de perfil', error });
  }
}
