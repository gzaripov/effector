// @flow

import * as React from 'react'
import {
  createStore,
  createEvent,
  createEffect,
  createStoreObject,
  createDomain,
  combine,
  sample,
  Effect,
  Store,
  Event,
  //ComputedStore,
  //ComputedEvent,
  /*::type*/ kind,
  forward,
} from 'effector'
import {createComponent} from 'effector-react'
import {createFormApi} from '@effector/forms'

describe('Unit', () => {
  describe('sample', () => {
    test('event by event', () => {
      const a = createEvent<number>()
      const b = createEvent<boolean>()
      const c = sample(a, b)

      const check1: Event<number> = c
      const check2: Event<string> = c
    })

    test('store by event', () => {
      const d = createStore(0)
      const b = createEvent<boolean>()
      const e = sample(d, b)

      const check3: Event<number> = e
      const check4: Event<string> = e
    })

    test('effect by event', () => {
      const f = createEffect<string, any, any>()
      const g = sample(f, b)

      const check5: Event<string> = g
      const check6: Event<number> = g
    })

    test('store by store', () => {
      const a = createStore(false)
      const b = createStore(0)
      const c = sample(a, b)

      const check1: Store<boolean> = c
      const check2: Store<string> = c
    })
  })
})

describe('Event', () => {
  test('createEvent', () => {
    const event1: Event<number> = createEvent()
  })
  test('#map', () => {
    const event: Event<number> = createEvent()
    const computed = event.map(() => 'foo')

    const check1: Event<string> = computed
    const check2: Event<number> = computed
    event(2)
    computed('')
  })
})

describe('Effect', () => {
  test('createEffect', () => {
    const effect1: Effect<number, string> = createEffect()
  })
})

describe('Store', () => {
  test('createStore', () => {
    const store1: Store<number> = createStore(0)
    const store2: Store<string> = createStore(0)
  })
  test('createStoreObject', () => {
    const ev = createEvent()
    const a = createStore('')
    const b = createStore(0)
    const c = createStoreObject({a, b})
    c.on(ev, (state, payload) => state)
    c.reset(ev)
    c.off(ev)
  })
  test('createApi', () => {})
  test('setStoreName', () => {})
  test('extract', () => {})
  test('combine', () => {
    const ev = createEvent()
    const a = createStore('')
    const b = createStore(0)
    const c = combine(a, b, (a, b) => a + b)
    c.on(ev, (state, payload) => state)
    c.reset(ev)
    c.off(ev)
  })
  test('restore', () => {})

  test('#(properties)', () => {
    const store = createStore(0)
    const kind: kind = store.kind
    const shortName: string = store.shortName
    const defaultState: number = store.defaultState

    const computed = store.map(() => 'hello')
    const kind1: kind = computed.kind
    const shortName1: string = computed.shortName
    const defaultState1: string = computed.defaultState
  })

  test('#getState', () => {
    const store = createStore(0)
    const state: number = store.getState()

    const computed = store.map(() => 'hello')
    const state1: string = computed.getState()
  })

  test('#map', () => {
    const store = createStore(0)
    const computed = store.map(() => 'hello')

    const check1: Store<string> = computed

    const check2: Store<number> = computed
  })

  test('#reset', () => {
    const event = createEvent()
    const store = createStore(0)
    store.reset(event)
    const computed = store.map(() => 'hello')

    computed.reset(event)
  })

  test('#on', () => {
    const event = createEvent()
    const store = createStore(0)
    store.on(event, (state, payload) => state)
    const computed = store.map(() => 'hello')

    computed.on(event, (state, payload) => state)
  })

  test('#off', () => {
    const event = createEvent()
    const store = createStore(0)
    store.off(event)
    const computed = store.map(() => 'hello')

    computed.off(event)
  })

  test('#subscribe', () => {
    const event = createEvent()
    const store = createStore(0)
    // @ts-ignore I don't know type
    store.subscribe(() => {})
    const computed = store.map(() => 'hello')
    // @ts-ignore I don't know type
    computed.subscribe(() => {})
  })

  test('#watch', () => {
    const event: Event<number> = createEvent()
    const store = createStore(0)
    store.watch((state, payload, type) => {
      const check1: number = state
      const check2: typeof undefined = payload
    })
    store.watch(event, (state, payload, type) => {
      const check1: number = state
      const check2: number = payload
    })
    const computed = store.map(() => 'hello')
    computed.watch((state, payload, type) => {
      const check1: string = state
      const check2: typeof undefined = payload
    })
    computed.watch(event, (state, payload, type) => {
      const check1: string = state
      const check2: number = payload
    })
  })

  test('#thru', () => {
    const event = createEvent()
    const store = createStore(0)
    const result = store.thru(store => {
      const check: Store<number> = store
      return check
    })

    const computed = store.map(() => 'hello')
    const result1 = computed.thru(store => {
      const check: Store<string> = store
      return check
    })
  })
})

describe('Domain', () => {
  test('createDomain', () => {
    const domain = createDomain()
    const domain2 = createDomain('hello')
    const domain3 = createDomain(234)
    const domain4 = createDomain({foo: true})
  })
})

describe('Graph', () => {
  test('forward', () => {
    const a = createEvent<number>()
    const b = createEvent<number>()
    forward({from: a, to: b})
    const c = createEffect<number, string, string>()
    const d = createEffect<number, string, string>()
    forward({from: c, to: d})
    const e = createStore(0)
    const f = createStore(0)
    forward({from: e, to: f})
  })
})

describe('effector-react', () => {
  test('createComponent', () => {
    const ImplicitObject = createComponent(
      {
        a: createStore<number>(0),
        b: createStore<number>(1),
      },
      (props, state) => {
        const check1: number = state.a
        const check2: number = state.b
        return null
      },
    )
    const Store = createComponent(createStore(0), (props, state) => {
      const check1: number = state
      return null
    })

    const list = createStore<{
      [key: number]: {
        text: string,
      },
    }>({})
    const InitialProps = createComponent(
      (initialProps: {id: number}) => {
        const check1: number = initialProps.id
        const check2: string = initialProps.id
        const check3: string = initialProps.unknownProp
        return list.map(list => list[initialProps.id] || {text: 'Loading...'})
      },
      (_, state) => {
        const check1: string = state.text
        const check2: number = state.text
        return null
      },
    )
  })
})

describe('effector-vue', () => {})

describe('@effector/forms', () => {
  describe('createFormApi', () => {
    const form = createFormApi({
      fields: {
        firstName: '',
        lastName: '',
      },
    })
  })
})
