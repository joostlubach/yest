import { sparse } from 'ytil'

export function testSeed(prefix: string = 'test') {
  // TODO: Replace with Bun-compatible seed logic
  let seed = 0 // placeholder for Bun
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
