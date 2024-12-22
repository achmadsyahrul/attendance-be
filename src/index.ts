import express, { Application, NextFunction, Request, Response } from 'express'
import { config } from './config'
import routes from './routes'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', routes.userRoutes)
app.use('/api/auth', routes.authRoutes)

// Default route for unknown endpoints
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error' })
})

app.listen(config.app.port, () => {
  console.log(`Server is running on http://localhost:${config.app.port}`)
})

export default app
