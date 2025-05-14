import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * @module ReviewController
 * @description Controller for managing reviews.
 */

/**
 * @async
 * @function createReview
 * @description Creates a new review in the database.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.body.clientId - ID of the client giving the review.
 * @param {string} req.body.profId - ID of the professional being reviewed.
 * @param {number} req.body.stars - The star rating given (1-5).
 * @returns {string} message
 * @example POST http://localhost:3001/reviews
 */
export const createReview = async (req, res) => {
  const { clientId, profId, stars } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(clientId)) return res.status(400).json({ message: 'ID de cliente inválido' });

    if (!mongoose.Types.ObjectId.isValid(profId)) return res.status(400).json({ message: 'ID de profesional inválido' });

    const clientExists = await User.findById(clientId).select('_id').lean();
    if (!clientExists) return res.status(404).json({ message: 'Cliente no encontrado' });
    const profExists = await User.findById(profId).select('_id').lean();
    if (!profExists) return res.status(404).json({ message: 'Profesional no encontrado' });

    const review = new Review({ clientId, profId, stars, modificationHistory: [{ userId: clientId }] });
    await review.save();
    res.status(201).json({ message: 'Reseña creada exitosamente' });
  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de Validación', errors: error.errors }); 
    }

    console.error("Error al crear la reseña:", error); 
    res.status(500).json({ message: 'Error Interno del Servidor al crear la reseña' }); 
  }  
};



  /**
 * @async
 * @function getAllReviewsByClientId
 * @description Retrieves all reviews associated with a specific client ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.clientId - The ID of the client.
 * @returns {array} array of reviews
 * @example GET http://localhost:3001/clientId/:id
 */
export const getAllReviewsByClientId = async (req, res) => {
  const { clientId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
          return res.status(400).json({ message: 'ID de cliente invalida' });
        }
  
        const visitorExists = await User.findById(clientId).select('_id').lean();
        if (!visitorExists) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
  
        const options = {
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 10,
          sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
          lean: true,
        };
  
        const query = { clientId: clientId };
        const result = await Review.paginate(query, options);
        const review = result.docs;
        const totalReviews = result.total;
  
        res.status(200).json({
          review,
          page,
          limit,
          total: totalReviews,
          totalPages: result.totalPages,
        });
      } catch (error) {
          res.status(500).json({ message: 'Error al obtener las reseñas para el cliente especificado' });
          console.error(`Error al obtener las reseñas por el ID de cliente ${clientId}:`, error);
      }
};

/**
 * @async
 * @function getAllReviewsByProfId
 * @description Retrieves all reviews associated with a specific professional ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.profId - The ID of the professional.
 * @returns {string} array of reviews
 * @example GET http://localhost:3001/profId/:id
*/
  export const getAllReviewsByProfId = async (req, res) => {
    const { profId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
      try {
        if (!mongoose.Types.ObjectId.isValid(profId)) {
          return res.status(400).json({ message: 'ID de profesional invalida' });
        }
  
        const profExists  = await User.findById(profId).select('_id').lean();
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
        const result = await Review.paginate(query, options);
        const review = result.docs;
        const totalReviews = result.total;
  
        res.status(200).json({
          review,
          page,
          limit,
          total: totalReviews,
          totalPages: result.totalPages,
        });
      } catch (error) {
        console.error(`Error al obtener las reseñas por ID de profesional ${profId}:`, error); 
        res.status(500).json({ message: 'Error al obtener las reseñas para el profesional especificado' }); 
      }
  };


/**
 * @async
 * @function getReviewMetrics
 * @description Retrieves review metrics for a specific professional, including total reviews, distribution by stars, and average rating.
 * @param {Object} req - HTTP request object.
 * @param {string} req.params.profId - The ID of the professional whose review metrics are being requested.
 * @param {Object} res - HTTP response object.
 * @returns {Object} JSON response with `totalReviews`, `reviewsByStars` (object with counts for each star rating), and `averageRating`.
 * @example GET /api/reviews/profId/60d5ecb8d7f8f8001f8e8c1a/metrics
 */
export const getReviewMetrics = async (req, res) => {
  try {
    const { profId } = req.params;

    // Validar que profId sea proporcionado
    if (!profId) {
      return res.status(400).json({ message: 'El ID del profesional es requerido.' });
    }

    // Validar que profId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(profId)) {
      return res.status(400).json({ message: 'ID de profesional inválido.' });
    }
    const profObjectId = mongoose.Types.ObjectId(profId);

    const profExists = await User.findById(profObjectId).select('_id').lean();
    if (!profExists) {
        return res.status(404).json({ message: 'Profesional no encontrado.' });
    }

    const aggregationPipeline = [
      {
        $match: {
          profId: profObjectId,
          'deleted.isDeleted': { $ne: true } // Considerar solo reseñas no eliminadas
        }
      },
      {
        $facet: {
          overallMetrics: [
            {
              $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$stars" }
              }
            }
          ],
          starsDistribution: [
            {
              $group: {
                _id: "$stars",
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } } // Ordenar por número de estrellas
          ]
        }
      }
    ];

    const results = await Review.aggregate(aggregationPipeline);

    let totalReviews = 0;
    let averageRating = 0;
    const reviewsByStars = {
      oneStar: 0,
      twoStars: 0,
      threeStars: 0,
      fourStars: 0,
      fiveStars: 0
    };

    if (results.length > 0 && results[0].overallMetrics.length > 0) {
      const overall = results[0].overallMetrics[0];
      totalReviews = overall.totalReviews || 0;
      averageRating = overall.averageRating !== null && overall.averageRating !== undefined ? parseFloat(overall.averageRating.toFixed(2)) : 0;

      results[0].starsDistribution.forEach(item => {
        if (item._id === 1) reviewsByStars.oneStar = item.count;
        else if (item._id === 2) reviewsByStars.twoStars = item.count;
        else if (item._id === 3) reviewsByStars.threeStars = item.count;
        else if (item._id === 4) reviewsByStars.fourStars = item.count;
        else if (item._id === 5) reviewsByStars.fiveStars = item.count;
      });
    }

    res.status(200).json({
      totalReviews,
      reviewsByStars,
      averageRating
    });
  } catch (error) {
    console.error(`Error al obtener las métricas de reseñas para el profesional ${req.params.profId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener las métricas de reseñas.', error: error.message });
  }
};



  /**
 * @async
 * @function updateReview
 * @description Updates an existing review in the database by ID.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {string} message
 * @example PATCH http://localhost:3001/reviews/6160171b1494489759d31572
 */
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { stars } = req.body;
  const userIdPerformingAction = req.user?.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de reseña inválido' }); 
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (stars !== undefined) {
      review.stars = stars;
    }

    if (userIdPerformingAction) {
     if (!mongoose.Types.ObjectId.isValid(userIdPerformingAction)) {
         return res.status(400).json({ message: 'ID de usuario modificador inválido' });
      }
      review.modificationHistory.push({ userId: userIdPerformingAction, modifiedDate: new Date() });
     } else {
       console.warn(`No se pudo identificar al usuario para actualizar el historial de la reseña ${id}`);
       }

    await review.save({ validateModifiedOnly: true }); 

    res.status(200).json({ message: 'Reseña actualizada exitosamente' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar review', error });
  }  
};
/**
 * @async
 * @function deleteReview
 * @description Logically deletes a review by setting the 'deleted' flag.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.id - The ID of the review to delete.
 * @param {string} req.body.deletedBy - The ID of the user performing the deletion. 
 * @returns {string} message
 * @example PATCH http://localhost:3001/reviews/6160171b1494489759d31572 
 */
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { deletedBy } = req.body; 

  try {
    // Validate the ID of the review to be deleted
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de review inválido' }); 
    }
    // Validate the ID of the user performing the deletion
    if (!mongoose.Types.ObjectId.isValid(deletedBy)) {
      return res.status(400).json({ message: 'ID de usuario eliminador inválido' }); // Mensaje en español
    }

    const user = await User.findById(deletedBy)

    if(!user){
      return res.status(404).json({ message: 'Usuario eliminador no encontrado' });
    }

    // Find the review by ID
    const review = await Review.findById(id);

    // Handle case where review is not found
    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado' }); // Mensaje en español
    }

    // Check if already deleted to avoid redundant saves (optional but good practice)
    if (review.deleted?.isDeleted) {
        return res.status(200).json({ message: 'El review ya ha sido eliminado previamente' });
    }


    // Update the deleted field for soft delete
    review.deleted = { isDeleted: true, isDeletedBy: deletedBy, deletedAt: new Date() };

    review.modificationHistory.push({ userId: deletedBy, modifiedDate: new Date() });

    // Save the changes
    await review.save();

    // Send success response
    res.status(200).json({ message: 'Review eliminado con éxito' }); 
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la review', error: error.message });
  }
}
