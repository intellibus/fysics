# fysics

![fysics — Future of State Management](assets/fysics.png)

> An [Open Source Universe](https://github.com/intellibus/approach) Project

---

## Contents

- [fysics](#fysics)
  - [Contents](#contents)
  - [Features ✨](#features-)
  - [Install 🛠](#install-)
  - [Usage 🔭](#usage-)
  - [Documentation 🛰](#documentation-)
    - [subject](#subject)
    - [subjectAll](#subjectall)
    - [subscribe](#subscribe)
    - [subscribeAll](#subscribeall)
    - [get](#get)
    - [getAll](#getall)
    - [dispatch](#dispatch)
    - [undo](#undo)
    - [redo](#redo)
    - [rebase](#rebase)
  - [Contributing 🌎](#contributing-)
  - [License ⚖️](#license-️)

## Features ✨

- Define a State Store
- Add Reducers & Actions to your State Store
- Define Async Side Effects via Saga Functions
- Create Bulk Actions by calling other Actions
- Subscribe to the State Object
- Subscribe to Deltas of the State Object
- Typescript Support

## Install 🛠

```sh
npm install fysics
```

## Usage 🔭

Read more about the [Design](https://github.com/intellibus/fysics/blob/main/DESIGN.md) behind `fysics` here.

```typescript
import { createStore } from 'fysics';
// Create the store
const STORE = createStore({
 initialState: { count: 0 },
 actions: {
  INCREMENT: {
    reducer(state, { amount }) {
      state.count += amount ?? 1;
    }
  },
  DECREMENT: {
    reducer(state, { amount }) {
      state.count -= amount ?? 1;
    }
  },
  INCREMENT_SAGA: {
    async saga(state, { url }) {
      const response = await fetch(url);
      const { amount } = await response.data.json()
      return amount;
    },
    reducer(state, payload, { amount }) {
      state.count += amount ?? 1;
    }
  },
  DECREMENT_BULK: {
    reducer(state, { listOfAmounts }) {
      for (let amount of listOfAmounts) {
        this.DECREMENT.reducer(state, amount);
      }
    }
  }
 }
});
// And Use It :)
STORE.dispatch({ name: 'INCREMENT', payload: { amount: 5 } });
// { count: 5 }
STORE.dispatch({ name: 'DECREMENT_BULK', payload: { listOfAmounts: [2, 3] } });
// { count: 0 }
STORE.undo();
// { count: 5 }
const unsubscribe = STORE.subscribe((stateObject) => {
  console.log(stateObject);
});
```

## Documentation 🛰

The `Store` returned by the `createStore` function is contains methods to interface with two internal components: the store's present state (of type `State`), and the store's full state, which is defined as

```typescript
FullState<State, Payload>;
```

where

```typescript
type FullState<State, Payload> = {
  past: Array<TimelineEvent<PayloadType>>;
  present: State;
  future: Array<TimelineEvent<PayloadType>>;
};

type TimelineEvent<Payload> = {
  action: DispatchAction<Payload>;
  patches: Array<Patch>;
  inversePatches: Array<Patch>;
};

type DispatchAction<Payload> = {
  name: string;
  payload?: Payload;
};
```

are the relevant type definitions. [See here](https://immerjs.github.io/immer/patches/) to understand the `Patch` type imported from immer.

### subject

```typescript
subject: () => Subject<State>;
```

Gets the [subject](https://rxjs.dev/guide/subject) for the store's present state.

### subjectAll

```typescript
subject: () => Subject<FullState<State, Payload>>;
```

Gets the [subject](https://rxjs.dev/guide/subject) for the store's full state.

### subscribe

```typescript
subscribe: (observer?: Partial<Observer<State>> | ((value: State) => void)) =>
  Subscription;
```

Creates a [subscription](https://rxjs.dev/guide/subscription) to the store's present state with the specified [observer](https://rxjs.dev/guide/observer) or function to run when the store's present state [subject](https://rxjs.dev/guide/subject) pushes a new value (i.e. when the store's present state changes).

### subscribeAll

```typescript
subscribe: (observer?: Partial<Observer<State>> | ((value: State) => void)) =>
  Subscription;
```

Creates a [subscription](https://rxjs.dev/guide/subscription) to the store's full state with the specified [observer](https://rxjs.dev/guide/observer) or function to run when the store's full state [subject](https://rxjs.dev/guide/subject) pushes a new value (i.e. when the store's full state changes).

### get

```typescript
get: () => State;
```

Returns a deep copy of the store's present state.

### getAll

```typescript
getAll: () => FullState<State, Payload>;
```

Returns a deep copy of the store's full state.

### dispatch

```typescript
dispatch: (action: DispatchAction<Payload>) => void
```

Dispatches an `Action` (see the Usage section) by name, with the provided payload.

### undo

```typescript
undo: () => void
```

Undoes actions in the store's past until an action with `skipUndo: false` is undone, or does nothing if all the actions in the store's past have `skipUndo: true`.

### redo

```typescript
redo: () => void
```

Redoes actions in the store's future until the second most recent action with `skipUndo: false` is on top of the stack, or redoes everything if there is no such action.

### rebase

```typescript
rebase: () => void
```

Clears the past and future of the store's full state.

## Contributing 🌎

We would love for you to contribute your ideas, code, & fixes to `fysics`.

We encourage everyone to read our [Design Document](https://github.com/intellibus/fysics/blob/main/DESIGN.md) to learn more about the thought process behind fysics.

Also check out the [rewards](https://github.com/intellibus/approach/blob/main/REWARDS.md) offered for contributing to the [Open Source Universe](https://github.com/intellibus/approach).

## License ⚖️

MIT
