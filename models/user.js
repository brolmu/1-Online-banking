import { readJSONFile } from '../utils.js'

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
}

function checkEmail (email) {
  return users.some((user) => user.email === email)
}
