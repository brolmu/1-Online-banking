import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSONFile = (path) => require(path)
