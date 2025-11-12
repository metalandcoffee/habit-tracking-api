import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors' // Define our policy on who can access our API.
import morgan from 'morgan' // is a Request logger.
import helmet from 'helmet' // Security middleware (i.e. setting appropriate headers).
import { isTest } from '../env.ts'

// Create Express app
const app = express()

// Register middleware.
app.use(helmet())
app.use(cors())
app.use(express.json()) // Set Express to automatically parse incoming JSON request bodies.
app.use(express.urlencoded({ extended: true })) // Set Express to automatically parse incoming urlencoded bodies.
app.use(
  morgan('dev', {
    skip: () => isTest(),
  }),
)

app.get('/health', (req, res) => {
  res.json({ status: 'health check ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

// Doing both so I have the option to import as a named or default import.
export { app }
export default app
