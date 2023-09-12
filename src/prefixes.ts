export function testPrefix(type?: string) {
  if (type != null) {
    return `test:${type}.${jest.getSeed()}.${UID++}`
  } else {
    return `test.${jest.getSeed()}.${UID++}`
  }
}

let UID: number = 0