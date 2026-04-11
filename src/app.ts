import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import chatRoutes from './Module/Chat/ChatRoutes'
import 'dotenv/config'

const app = express()
const normalizeOrigin = (value: string) => value.replace(/\/+$/, '')
const allowedOrigins = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean)
const allowAnyOrigin = allowedOrigins.includes('*')

const isAllowedOrigin = (origin?: string) => {
  if (!origin || allowAnyOrigin) {
    return true
  }

  return allowedOrigins.includes(normalizeOrigin(origin))
}

const requireApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.headers['x-api-key'] === process.env.CLIENT_API_KEY) {
    return next()
  }

  return res.status(401).json({ error: 'unauthorized' })
}

app.use(helmet())

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
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

app.use(requireApiKey)

app.use(chatRoutes)

export default app
