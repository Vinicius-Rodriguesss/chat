import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import RoutesChat from './Module/Chat/ChatRoutes'
import 'dotenv/config'

const app = express()
const normalizeOrigin = (value: string) => value.replace(/\/+$/, '')
const allowedOrigins = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(helmet())

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*')) {
      return callback(null, true)
    }

    const normalizedOrigin = normalizeOrigin(origin)
    const isAllowed = allowedOrigins.some(
      (allowedOrigin) => normalizeOrigin(allowedOrigin) === normalizedOrigin
    )

    if (isAllowed) {
      return callback(null, true)
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`))
  }
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== process.env.CLIENT_API_KEY) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
})

app.use(RoutesChat())

export default app
