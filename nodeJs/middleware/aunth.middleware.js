// middlewares/auth.middleware.js (Ejemplo)

// Asume que tienes un middleware de autenticación que añade req.user
// import { verifyTokenAndGetUser } from './authentication'; // Ejemplo

export const isAdmin = (req, res, next) => {
  // Primero, asegúrate de que el usuario esté autenticado (esto debería hacerlo un middleware previo)
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' }); // 401 Unauthorized
  }

  // Verifica si el rol del usuario es 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' }); // 403 Forbidden
  }

  // Si es admin, permite continuar a la siguiente función (el controlador)
  next();
};

// Podrías necesitar también un middleware de autenticación general
export const isAuthenticated = (req, res, next) => {
    // Aquí iría tu lógica para verificar el token/sesión y añadir req.user
    // Ejemplo: const user = await verifyTokenAndGetUser(req.headers.authorization);
    // if (!user) return res.status(401).json({ message: 'No autenticado' });
    // req.user = user;
    // next();

    // --- Placeholder ---
    // Simulación: Añadir un usuario simulado para probar isAdmin
    // ¡REEMPLAZA ESTO CON TU LÓGICA REAL DE AUTENTICACIÓN!
    // req.user = { _id: 'someAdminId', role: 'admin' }; // Simula un admin
    // req.user = { _id: 'someClientId', role: 'cliente' }; // Simula un cliente
    if (!req.user) { // Si no hay usuario simulado o real
         console.warn("Advertencia: Middleware 'isAuthenticated' no implementado o usuario no adjunto.");
         // Decide si bloquear o permitir continuar en desarrollo
         // return res.status(401).json({ message: 'Autenticación requerida (middleware no implementado)' });
    }
    next();
    // --- Fin Placeholder ---
}
