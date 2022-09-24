import * as dotenv from 'dotenv'

const loadEnv = () => {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development',
  })
}

export default loadEnv
