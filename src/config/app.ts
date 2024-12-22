import './env'

const ENV = process.env.APP_ENV || 'development'
const HOST = process.env.APP_HOST || 'localhost'
const PORT = process.env.APP_PORT || 3000
const URL = process.env.APP_URL || `http://${HOST}:${PORT}`
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const app = {
  env: ENV,
  host: HOST,
  port: PORT,
  url: URL,
  jwtSecret: JWT_SECRET,
}
