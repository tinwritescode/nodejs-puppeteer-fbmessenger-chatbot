import fs from 'fs'

const getNewestFileInFolder = (folderPath: string) => {
  const files = fs.readdirSync(folderPath)
  const newestFile = files[files.length - 1]

  return newestFile
}

export { getNewestFileInFolder }
