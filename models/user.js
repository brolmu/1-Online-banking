import { readJSONFile } from '../utils.js'
import Jwt from 'jsonwebtoken'

const users = readJSONFile('./data/users.json')

export class UserModel {
  static async getAll ({ name }) {
    let resUsers = users
    if (name) {
      resUsers = resUsers.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    return resUsers
  }

  static async getById ({ id }) {
    const user = users.find((user) => user.id === id)
    return user
  }

  static async create ({ object }) {
    if (checkEmail(object.email)) {
      return { error: 'Email already exists' }
    }

    const newUser = {
      id: users.length + 1,
      ...object
    }

    users.push(newUser)
    return newUser
  }

  static async update ({ id, object }) {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return { error: 'User not found' }
    }
    if (checkEmail(object.email)) {
      return { error: 'Email already exists' }
    }
    const user = users[userIndex]
    const updatedUser = {
      ...user,
      ...object
    }
    users[userIndex] = updatedUser
    return updatedUser
  }

  static async delete ({ id }) {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return false
    }
    users.splice(userIndex, 1)
    return true
  }

  static async getByEmail ({ email }) {
    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    return user
  }

  static async comparePassword ({ password, hash }) {
    return password === hash
  }

  static async generateToken ({ id }) {
    return Jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  }

  static async validateToken ({ token }) {
    const verified = Jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
      return true
    } else {
      // Access Denied
      return false
    }
  }
}

function checkEmail (email) {
  return users.some((user) => user.email === email)
}
