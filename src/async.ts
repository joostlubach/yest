import DisposableTimer from 'disposable-timer'
import { Constructor, ms, MsInput } from 'ytil'

export async function expectAsyncError<E extends Error>(
  fn:         () => PromiseLike<any>,
  ErrorType?: Constructor<E>,
  matcher?:   (error: E) => void,
) {
  let error: any | null
  try { await fn() } catch (err) { error = err }

  if (error == null) {
    throw new Error("Expected error to be thrown (async), but no error was thrown")
  } else {
    if (ErrorType && !(error instanceof ErrorType || typeof error === 'string')) {
      throw error
    }
    matcher?.(error)
  }
}

export async function delay(duration: MsInput, timer?: DisposableTimer) {
  return new Promise<void>(resolve => {
    if (timer != null) {
      timer.setTimeout(resolve, ms(duration))
    } else {
      setTimeout(resolve, ms(duration))
    }
  })
}
