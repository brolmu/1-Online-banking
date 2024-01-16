import cors from 'cors'

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost:1234']

export function corsMiddleware ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) {
  return cors({
    origin: function (origin, callback) {
      if (!origin || acceptedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  })
}
