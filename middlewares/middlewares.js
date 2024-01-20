import { corsMiddleware } from './cors.js'
import { validateToken, adminRoleValidation } from './auth.js'

const auth = { validateToken, adminRoleValidation }

export {
  corsMiddleware, auth
}
