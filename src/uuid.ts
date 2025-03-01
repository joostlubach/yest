import { padStart } from 'lodash'

let nextOrdinal = 1

export function resetMockUUID() {
  nextOrdinal = 1
}

export function mockUUID() {
  const ordinal = nextOrdinal++

  return [
    padStart(ordinal.toString(), 8, '0'),
    '0000',
    '0000',
    '0000',
    '000000000000',
  ].join('-')
}
