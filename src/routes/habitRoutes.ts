import { Router } from 'express'
import { validateBody } from '../middleware/validation.ts'
import { z } from 'zod'

// remove.
const createHabitSchema = z.object({
  name: z.string(),
})
const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'All Habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: 'Habit created' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id} deleted` })
})

router.post('/:id/complete', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id} marked as complete` })
})

export default router
