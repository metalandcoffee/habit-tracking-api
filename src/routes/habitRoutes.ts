import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'All Habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id}` })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Habit created' }).status(201)
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id} deleted` })
})

router.post('/:id/complete', (req, res) => {
  res.json({ message: `Habit ID ${req.params.id} marked as complete` })
})

export default router
