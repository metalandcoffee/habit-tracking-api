import app from './server.ts'
import { env } from '../env.ts'

app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`)
})