import jswebtoken from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for the given user.
 *
 * @param {Object} user - The user object.
 * @param {string} user._id - The user's unique identifier.
 * @param {string} user.name - The user's name.
 * @param {string} user.email - The user's email address.
 * @param {string} user.role - The user's role.
 * @returns {string} - The generated JWT.
 */
export const generateToken = (user) => {
  return jswebtoken.sign(
    {
      _id: user._id,
      name: user.firstName,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

/**
 * Middleware to check if the user is authenticated.
 *
 * @param {Object} req - The request object.
 * @param {string} req.headers.authorization - The user's authorization token.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    console.log(token, process.env.ACCESS_TOKEN_SECRET);
    jswebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

/**
 * Middleware to check if the user is an admin.
 *
 * @param {string} role - The role needed
 * @param {Object} req - The request object.
 * @param {string} req.headers.authorization - The user's authorization token.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const authRole = (role) => (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jswebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        if (decode.role === role) {
          next();
        } else {
          res.status(401).send({ message: `Invalid User, this is not ${role}` });
        }
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
