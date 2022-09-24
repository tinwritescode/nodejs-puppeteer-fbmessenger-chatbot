import { Page } from 'puppeteer'

enum InboxType {
  GROUP,
  PERSONAL,
}
const getUrl = ({ type }: { type: InboxType }): string => {
  const FACEBOOK_MESSAGE_URL = process.env.FACEBOOK_MESSAGE_URL as string
  const ID_SEND_MESSAGE = process.env.ID_SEND_MESSAGE as string
  const FACEBOOK_GROUP_MESSAGE_URL = process.env
    .FACEBOOK_GROUP_MESSAGE_URL as string
  const ID_GROUP_SEND_MESSAGE = process.env.ID_GROUP_SEND_MESSAGE as string

  // replace {{FACEBOOK_ACCOUNT_ID}} with {{ID_SEND_MESSAGE}}
  switch (type) {
    case InboxType.GROUP:
      return FACEBOOK_GROUP_MESSAGE_URL.replace(
        '{{FACEBOOK_GROUP_ID}}',
        ID_GROUP_SEND_MESSAGE,
      )
    case InboxType.PERSONAL:
      return FACEBOOK_MESSAGE_URL.replace(
        '{{FACEBOOK_ACCOUNT_ID}}',
        ID_SEND_MESSAGE,
      )
  }
}

const getSelector = () => {
  return {
    messageSelector: '#messageGroup>div>div:last-child>div>div>span',
    nameSelector: '#messageGroup>div>div:last-child>div>a',
  }
}
const messageController = async (page: Page) => {
  const url = getUrl({ type: InboxType.GROUP })
  const { messageSelector, nameSelector } = getSelector()

  await page.goto(url)

  const message = await page.evaluate((messageSelector) => {
    const element: any = document.querySelector(messageSelector)
    if (element) {
      return element.innerText
    }
    return ''
  }, messageSelector)

  const name = await page.evaluate((nameSelector) => {
    const element = document.querySelector(nameSelector)
    if (element) {
      return element.textContent
    }
    return ''
  }, nameSelector)

  console.log(`name: ${name}`)
  console.log(`message: ${message}`)
  console.log(`====================`)

  if (message?.match('time')) {
    // format day in vietnamese
    sendMessage(
      page,
      `Em chào anh ${name}, bây giờ là ${new Date().toLocaleString('vi-VN')}`,
    )
  }
}

const sendMessage = async (page: Page, message: string) => {
  await page.type('#composerInput', message)
  await page.click('[name="send"]')
}

export default messageController
