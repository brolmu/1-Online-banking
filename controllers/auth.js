import { UserModel, AuthModel } from '../models/models.js'

export class AuthController {
  static async generateToken (req, res) {
    const { email, password } = req.body
    const user = await UserModel.getByEmail({ email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid data' })
    }

    const isPasswordValid = await AuthModel.comparePassword({ password, hash: user.password })
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid data' })
    }

    const token = await AuthModel.generateToken({ user })
    res.json({ token })
  }

  static async validateToken (req, res) {
    try {
      const { authorization } = req.headers
      if (!authorization) return res.status(401).send({ message: 'Unauthorized' })

      const callback = (err, decoded) => {
        if (err) {
          res.status(401).send({ message: 'Unauthorized' })
        }
        res.json({ message: 'Authorized' })
      }

      await AuthModel.validateToken({ authorization }, callback)
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: 'Internal server error' })
    }
  }
}
