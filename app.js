import express, { json } from 'express'
import dotenv from 'dotenv'
import { corsMiddleware } from './middlewares/middlewares.js'

import { userRoutes, authRoutes } from './routes/routes.js'

dotenv.config()

const PORT = process.env.PORT || 1234
const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS

const app = express()
app.disable('x-powered-by')

app.use(json())
app.use(corsMiddleware({ acceptedOrigins: ACCEPTED_ORIGINS }))
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  return res.status(500).send({ message: 'internal server Error' })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
