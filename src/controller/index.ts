import { Page } from 'puppeteer'
import { loginController } from './core'

const mainController = (page: Page) => {
  loginController(page)
}

export default mainController
