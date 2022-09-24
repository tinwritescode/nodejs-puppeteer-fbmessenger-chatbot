import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import fs from 'fs'
import errorHandler from './errorHandler'
import { fileHelper } from '../helper'

export class BrowserHandler {
  static instance: BrowserHandler
  #browser: Browser = {} as Browser
  #cookiePath: string = ''

  constructor({ loadNewestCookies = false, headless = true } = {}) {
    if (!BrowserHandler.instance) {
      BrowserHandler.instance = this

      puppeteer
        .launch({
          headless: false,
        })
        .then((browser) => (this.#browser = browser))

      if (loadNewestCookies) {
        const cookiesFolder = (process.env.COOKIE_PATH as string) || 'cookies'
        const newestFiles = fileHelper.getNewestFileInFolder(cookiesFolder)
        this.#cookiePath = newestFiles
      }
    }

    return BrowserHandler.instance
  }

  async close() {
    await this.#browser.close()
  }

  isReady(): boolean {
    return this.#browser?.newPage !== undefined
  }

  get browser() {
    return this.#browser
  }

  static saveCookies(cookies: puppeteer.Protocol.Network.Cookie[]) {
    // save to /cookies/cookies_xx.json
    const fileName = `cookies/cookies_${new Date().getTime()}.json`

    fs.writeFile(fileName, JSON.stringify(cookies), (err) => {
      if (err) {
        console.error(err)
      }
    })

    errorHandler.logInfo(`Cookies saved to ${fileName}`)
  }

  async loadCookies(page: Page) {
    const cookiesString = fs.readFileSync(
      ('cookies/' + this.#cookiePath) as string,
      'utf8',
    )
    const cookies = JSON.parse(cookiesString)

    await page.setCookie(...cookies)
  }

  async setUserAgent(page: Page) {
    await page.setUserAgent(process.env.USER_AGENT as string)
  }

  async newPage() {
    const page = await this.#browser.newPage()

    this.#cookiePath && (await this.loadCookies(page))
    await this.setUserAgent(page)

    return page
  }
}

const browserHandler = new BrowserHandler({ loadNewestCookies: true })
Object.freeze(browserHandler)

export default browserHandler
