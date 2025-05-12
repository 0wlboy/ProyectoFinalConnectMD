import jwt from 'jsonwebtoken'; // Import jsonwebtoken


export const aunthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({message:'Acceso denegado.'})
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      if (err.name === 'TokenExpiredError'){
      return res.status(403).json({
        message:'Acceso denegado. Token expirado.'
      })
     }
     return res.status(403).json({
      message:'Acceso denegado.'
    })
    }
    
    req.user = user
    next()
  })
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Acceso denegado. Rol de usuario no identificado." });
        }

       const rolesArray = allowedRoles;
        if (!rolesArray.includes(req.user.role)) { // Verifica si el rol del usuario está en los roles permitidos
            return res.status(403).json({ message: "Acceso denegado. No tienes los permisos necesarios para acceder a este recurso." });
        }
        next();
    };
  }

  export const generatedAccessToken = (user) =>{
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        if (!secretKey) {
          console.error("Error: ACCESS_TOKEN_SECRET no está definido en las variables de entorno.");
          throw new Error('La clave secreta para el token de acceso no está configurada.');
        }

        return jwt.sign({ id: user._id, role: user.role }, secretKey, {
          expiresIn: '1h' // Token expiration time
        });
  }

export const refressToken = (user) =>{
  const refress = process.env.REFRESH_TOKEN_SECRET;

    if (!refress) {
      console.error("Error: REFRESS_TOKEN_SECRET no está definido en las variables de entorno.");
      throw new Error('La clave secreta para el token de refresco no está configurada.');
    }

  return jwt.sign({ id: user._id, role: user.role }, refress)

}
