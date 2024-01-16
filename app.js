import express, { json } from 'express'
import { corsMiddleware } from './middlewares/middlewares.js'

import { userRoutes } from './routes/routes.js'

const PORT = process.env.PORT || 1234
const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS

const app = express()
app.disable('x-powered-by')

app.use(json())
app.use(corsMiddleware({ acceptedOrigins: ACCEPTED_ORIGINS }))

app.use('/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
