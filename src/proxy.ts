import { afterEach, beforeEach } from 'bun:test'
import { isObject } from 'ytil'

/**
 * Creates a proxy that is backed by a function to retrieve the target. The function may return
 * `undefined` in which case the proxy simply returns `false` for [[Has]] and throws an error for
 * [[Get]]. The target is cached, but reset after each test.
 * 
 * The value is retrieved in a `beforeEach()` handler, and reset in a `afterEach()` handler. Async
 * is supported.
 * 
 * This is useful for utilities in test suites, as you only have to initialize them once:
 * 
 * Instead of:
 * 
 * ```
 * describe("my suite", () => {
 * 
 *   let myUtil: MyUtil
 * 
 *   beforeEach(() => {
 *     myUtil = new MyUtil()
 *   })
 * 
 *   test("my test", () => {
 *     const bar = myUtil.foo()
 *   })
 * 
 * })
 * ```
 * 
 * You can now write:
 * 
 * ```
 * describe("my suite", () => {
 *   const myUtil = dynamicProxy(() => new MyUtil())
 *
 *   test("my test", () => {
 *     const bar = myUtil.foo()
 *   })
 * })
 * ```
 * 
 * @param getTarget 
 * @returns 
 */
export function dynamicProxy<T extends object>(getTarget: () => T | undefined | Promise<T | undefined>): T {
  let target: T | undefined

  beforeEach(async () => {
    target = await getTarget()
  })
  afterEach(() => {
    target = undefined
  })

  return new Proxy<T>({} as T, {
    has(_, prop) {
      if (prop === ACTUAL) {
        return true
      } else if (target != null) {
        return Reflect.has(target, prop)
      } else {
        return false
      }
    },

    get(_, prop) {
      if (prop === ACTUAL) {
        return target
      } if (target != null) {
        return Reflect.get(target, prop)
      } else {
        throw new Error("Service proxy not loaded")
      }
    },

    set(_, prop, value) {
      if (prop === ACTUAL) {
        target = value
      } if (target != null) {
        return Reflect.set(target, prop, value)
      } else {
        throw new Error("Service proxy not loaded")
      }
    },
  })
}

export namespace dynamicProxy {

  export function actual<T>(proxy: T): T {
    if (!isObject(proxy) || !(ACTUAL in proxy as any)) {
      throw new Error("Value is not a dynamic proxy")
    }

    return (proxy as any)[ACTUAL]
  }

  export function setActual<T>(proxy: T, value: T) {
    if (!isObject(proxy) || !(ACTUAL in proxy as any)) {
      throw new Error("Value is not a dynamic proxy")
    }
    (proxy as any)[ACTUAL] = value
  }

}

const ACTUAL = Symbol("ACTUAL")