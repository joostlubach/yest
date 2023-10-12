import Bluebird from 'bluebird'

export default class CancelablePromise<T> implements PromiseLike<T> {

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    this.promise = new Bluebird(executor)

    if (!ALL_CANCELED) {
      ALL.add(this)
      this.promise.finally(() => {
        ALL.delete(this)
      })
    }
  }

  private promise: Bluebird<T>

  public static wrap<T>(promise: PromiseLike<T>) {
    return new CancelablePromise<T>((resolve, reject) => {
      promise.then(resolve, reject)
    })
  }

  public static install() {
    global.Promise = CancelablePromise as any
  }

  public static cancelAll() {
    ALL_CANCELED = true
    ALL.forEach(it => it.cancel())
  }

  public cancel() {
    this.promise.cancel()
  }

  public static all  = Bluebird.all.bind(Promise)
  public static race = Bluebird.race.bind(Promise)

  public static reject(reason?: any) {
    return CancelablePromise.wrap(Bluebird.reject(reason))
  }

  public static resolve<T>(value: T) {
    return CancelablePromise.wrap(Bluebird.resolve(value))
  }

  public async then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

}

const ALL = new Set<CancelablePromise<any>>()
let ALL_CANCELED = false