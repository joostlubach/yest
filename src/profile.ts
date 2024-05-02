export async function profile<T>(label: string, cb: () => T | Promise<T>): Promise<T> {
  const start = Date.now()
  const result = await cb()

  const duration = Date.now() - start
  console.log(`${label}: ${(duration / 1000).toFixed(2)}s`)
  return result
}