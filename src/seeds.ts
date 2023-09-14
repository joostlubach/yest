export function testSeed(type?: string) {
  let seed = jest.getSeed()
  if (seed < 0) {
    seed += 0xFFFFFFFF + 1
  }

  // Jest uses multiple worker processes. Differentiate that here.
  const pid = process.pid
  return `${seed.toString(16)}-${pid.toString(16)}-${UID++}`
}

export function testPrefix(type?: string) {
  if (type != null) {
    return `_TEST:${type}.${testSeed()}`
  } else {
    return `_TEST.${testSeed()}`
  }
}

let UID: number = 0