import z from 'zod'

const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50).optional().default('123qwe'),
  role: z.enum(['admin', 'user']).optional().default('user')
})

const userResponseSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

export function validateUserId (id) {
  const userId = Number(id)
  if (Number.isNaN(userId)) {
    return { error: 'Invalid ID supplied' }
  }

  return { success: true, error: null, userId }
}

export function validateUserResponse (object) {
  return userResponseSchema.safeParse(object)
}
