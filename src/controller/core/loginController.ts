import { Page } from 'puppeteer'
import { BrowserHandler } from '../browserHandler'

const loginController = async (page: Page) => {
  const FACEBOOK_LOGIN_URL = process.env.FACEBOOK_LOGIN_URL as string
  await page.goto(FACEBOOK_LOGIN_URL)
  // await page.type('#m_login_email', process.env.FACEBOOK_EMAIL as string)
  // await page.type('[name="pass"]', process.env.FACEBOOK_PASSWORD as string)
  // await page.click('[name="login"]')
  // await page.pdf({ path: 'google.pdf' })

  // save all cookies to file
  const cookies = await page.cookies()
  BrowserHandler.saveCookies(cookies)
}

export default loginController
