import Jwt from 'jsonwebtoken'

export class AuthModel {
  static async generateToken ({ id, user }) {
    return Jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1h' })
  }

  static async validateToken ({ authorization }, callback) {
    Jwt.verify(authorization, process.env.JWT_SECRET, callback)
  }

  static async comparePassword ({ password, hash }) {
    return password === hash
  }
}
