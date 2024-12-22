import './env'

const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`

export const redis = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  url: REDIS_URL,
}
