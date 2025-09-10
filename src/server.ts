import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'

// Create Express app
const app = express()

app.get('/health', (req, res) => {
    res.json({ status: 'health check ok' })
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

// Doing both so I have the option to import as a named or default import.
export { app }
export default app