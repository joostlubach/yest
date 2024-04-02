/**
 * Creates a proxy that is backed by a function to retrieve the target. The function may return
 * `null` or `undefined` in which case the proxy simply returns `false` for [[Has]] and throws
 * an error for [[Get]]. The target is cached, but reset after each test.
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
export function dynamicProxy<T extends object>(getTarget: () => T | null | undefined): T {
  let cache: T | null | undefined
  let cached: boolean = false

  function getTargetOrCached() {
    if (cached) {
      return cache
    }

    cache = getTarget()
    cached = true
    return cache
  }
  
  afterEach(() => {
    cached = false
  })

  return new Proxy<T>({} as T, {
    has(_, prop) {
      const target = getTargetOrCached()
      if (target != null) {
        return Reflect.has(target, prop)
      } else {
        return false
      }
    },

    get(_, prop) {
      const target = getTargetOrCached()
      if (target != null) {
        return Reflect.get(target, prop)
      } else {
        throw new Error("Service proxy not loaded")
      }
    },

    set(_, prop, value, receiver) {
      const target = getTargetOrCached()
      if (target != null) {
        return Reflect.set(target, prop, value, receiver)
      } else {
        throw new Error("Service proxy not loaded")
      }
    },
  })
}
