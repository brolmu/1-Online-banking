import { UserModel } from '../models/models.js'
import { validateUser, validatePartialUser, validateUserId, validateUserResponse } from '../schemas/user.js'

export class UserController {
  static async getAll (req, res) {
    const { name } = req.query
    const result = await UserModel.getAll({ name })

    res.json(formatResponseList(result))
  }

  static async getById (req, res) {
    const { id } = req.params
    const { error, userId } = validateUserId(id)
    if (error) {
      return res.status(400).json({ message: error })
    }

    const user = await UserModel.getById({ id: userId })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    res.json(formatResponse(user))
  }

  static async create (req, res) {
    const result = validateUser(req.body)
    if (!result.success) {
      return { error: JSON.parse(result.error.message) }
    }
    const newUser = await UserModel.create({ object: result.data })
    res.status(201).json(formatResponse(newUser))
  }

  static async update (req, res) {
    const { id } = req.params
    const { error, userId } = validateUserId(id)
    if (error) {
      return res.status(400).json({ message: error })
    }

    const result = validatePartialUser(req.body)
    if (!result.success) {
      return { error: JSON.parse(result.error.message) }
    }
    const user = await UserModel.update({ id: userId, object: result.data })

    if (user.error) {
      return res.status(400).json({ message: user.error })
    }

    res.status(201).json(formatResponse(user))
  }

  static async delete (req, res) {
    const { id } = req.params
    const { error, userId } = validateUserId(id)
    if (error) {
      return res.status(400).json({ message: error })
    }
    const result = await UserModel.delete({ id: userId })

    if (result.error) {
      return res.status(400).json({ message: result.error })
    }
    res.status(204).end()
  }
}

function formatResponseList (result) {
  const response = result.map(x => validateUserResponse(x).data)
  return response
}

function formatResponse (result) {
  const response = validateUserResponse(result)
  return response.data
}
