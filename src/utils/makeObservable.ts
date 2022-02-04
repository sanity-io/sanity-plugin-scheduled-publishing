type Subscriber<T> = (value: T) => void

export default function makeObservable<T>(target: T): {
  get: () => T
  set: (newValue: T) => void
  subscribe: (fn: Subscriber<T>) => () => void
} {
  let listeners: Subscriber<T>[] = []
  let value = target

  function get(): T {
    return value
  }

  function set(newValue: T): void {
    if (value === newValue) {
      return
    }
    value = newValue
    listeners.forEach((listener) => listener(value))
  }

  function subscribe(fn: Subscriber<T>) {
    listeners.push(fn)
    return () => unsubscribe(fn)
  }

  function unsubscribe(fn: Subscriber<T>) {
    listeners = listeners.filter((listener) => listener !== fn)
  }

  return {
    get,
    set,
    subscribe,
  }
}
