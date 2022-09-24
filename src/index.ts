import { loadEnv } from './config'
import mainController from './controller'
import browserHandler from './controller/browserHandler'
import errorHandler from './controller/errorHandler'
import { loginController, messageController } from './controller/core'

async function main() {
  loadEnv()

  // wait for browser to be ready
  while (!browserHandler.isReady() || !errorHandler.isReady()) {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const page = await browserHandler.newPage()

  try {
    // mainController(page)

    errorHandler.logInfo('Server running')

    const TIME_FOR_EACH_CHECK =
      parseInt(process.env.TIME_FOR_EACH_CHECK as string) || 1000

    setInterval(() => {
      // loginController(page)
      messageController(page).catch((err) => {
        errorHandler.handleError(err)
      })
    }, TIME_FOR_EACH_CHECK)
  } catch (error) {
    errorHandler.handleError(error)
  } finally {
    // wait for 100sec
    // await browserHandler.close()
  }

  // wait when ctrl+c is pressed
  await new Promise((resolve) => process.on('SIGINT', resolve))
}

main()
