import { sparse } from 'ytil'

export function testSeed(prefix: string = 'test') {
  let seed = jest.getSeed()
  if (seed < 0) {
    seed += 0xFFFFFFFF + 1
  }

  const parts = sparse([
    prefix,
    seed.toString(16),
    // Jest uses multiple worker processes. Differentiate that here.
    process.pid.toString(16),
    UID++,
  ])

  return parts.join(':')
}

let UID: number = 0
