import { Logger } from './../../node_modules/pino/pino.d'
import pino from 'pino'

class ErrorHandler {
  static instance: ErrorHandler
  #logger: Logger | undefined

  constructor() {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = this
      this.#logger = pino({
        transport: {
          target: 'pino-pretty',
        },
      })
    }

    return ErrorHandler.instance
  }

  handleError(err: any) {
    this.#logger?.error(err)
  }

  isReady(): boolean {
    return this.#logger !== undefined
  }

  logInfo(message: string) {
    this.#logger?.info(message)
  }
}

const errorHandler = new ErrorHandler()
Object.freeze(errorHandler)

export default errorHandler
