import { AuthModel } from '../models/auth.js'

export async function validateToken (req, res, next) {
  try {
    const { authorization } = req.headers
    if (!authorization) return res.status(401).send({ message: 'Unauthorized' })

    const callback = (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Unauthorized' })
      }
      req.user = decoded
      next()
    }

    await AuthModel.validateToken({ authorization }, callback)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
  }
}

export function adminRoleValidation (req, res, next) {
  console.log(req.user)
  const { role } = req.user
  if (role !== 'admin') {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  next()
}
