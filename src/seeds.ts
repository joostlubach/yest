import { Buffer } from 'node:buffer'

export function testSeed(type?: string) {
  const seed = Buffer.from([jest.getSeed()]).toString('hex')
  return `${seed}-${UID++}`
}

export function testPrefix(type?: string) {
  if (type != null) {
    return `_TEST:${type}.${testSeed()}`
  } else {
    return `_TEST.${testSeed()}`
  }
}

let UID: number = 0