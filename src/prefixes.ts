import md5 from 'md5'
import { Buffer } from 'node:buffer'

export function testPrefix(type?: string) {
  const seed = Buffer.from(md5([jest.getSeed()])).toString('base64')

  if (type != null) {
    return `_TEST:${type}.${seed}.${UID++}`
  } else {
    return `_TEST.${seed}.${UID++}`
  }
}

let UID: number = 0