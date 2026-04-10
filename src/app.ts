import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import RoutesChat from './Module/Chat/ChatRoutes'
import 'dotenv/config'

const app = express()

app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
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
