import { Constructor } from 'ytil'

export async function expectAsyncError<E extends Error>(
  fn:         () => PromiseLike<any>,
  ErrorType?: Constructor<E>,
  matcher?:   (error: E) => void
) {
  let error: any | null
  try { await fn() }
  catch (err) { error = err }

  if (error == null) {
    throw new Error("Expected error to be thrown (async), but no error was thrown")
  } else {
    if (ErrorType && !(error instanceof ErrorType)) {
      throw new Error(`Expected error to be of type ${ErrorType.name}, but was of type ${error.constructor.name}`)
    }
    matcher?.(error)
  }
}