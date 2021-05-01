const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')

module.exports = (context) => {
      const authHeader = context.req.headers["authorization"] || '';
      const token = authHeader.split("Bearer ")[1]
      if (token) {
            try {
                  const user = jwt.verify(token, process.env.JWT_SECRET)
                  return user
            }
            catch(err) {
                  throw new AuthenticationError("Invalid or expired token")
            }
      }
      throw new AuthenticationError('Auth header must be provided')
}