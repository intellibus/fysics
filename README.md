# fysics

<div align="center">
  <a href="#">
    <img src="assets/fysics.gif" alt="fast blue glowing lines in a grid network" height="160" />
  </a>
  <br>
  <br>
  <p>
    <b>fysics</b>
  </p>
  <p>
     <i>Minimal State Management for TypeScript & JavaScript Applications.</i>
  </p>
  <p>

[![NPM version](https://img.shields.io/npm/v/fysics?style=flat-square)](https://img.shields.io/npm/v/fysics?style=flat-square)
[![HEAD Build Status](https://github.com/intellibus/fysics/actions/workflows/CI.yml/badge.svg?style=flat-square)](https://github.com/intellibus/fysics/actions/workflows/CI.yml)
[![Release Build Status](https://github.com/intellibus/fysics/actions/workflows/CD.yml/badge.svg?style=flat-square)](https://github.com/intellibus/fysics/actions/workflows/CD.yml)
[![semantic-release: conventionalcommits](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Test Coverage](https://api.codeclimate.com/v1/badges/64436d03e7566e8e9bee/test_coverage)](https://codeclimate.com/github/intellibus/fysics/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/64436d03e7566e8e9bee/maintainability)](https://codeclimate.com/github/intellibus/fysics/maintainability)
[![Contributors](https://img.shields.io/github/contributors-anon/intellibus/fysics?style=flat-square)](https:/github.com/intellibus/fysics/graphs/contributors)
[![Package size](https://img.shields.io/bundlephobia/min/fysics?style=flat-square)](https://bundlephobia.com/package/fysics)
[![Version Support](https://img.shields.io/node/v/fysics?style=flat-square)](https://npmjs.com/package/fysics)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

  </p>
</div>

---

## Contents

- [fysics](#fysics)
  - [Contents](#contents)
  - [Features ✨](#features-)
  - [Install 🐙](#install-)
  - [Usage 💡](#usage-)
  - [Documentation 📄](#documentation-)
  - [Contributing 🍰](#contributing-)
  - [Maintainers 👷](#maintainers-)
  - [License ⚖️](#license-️)

## Features ✨

- Define Store

## Install 🐙

If using `npm`:

```sh
npm install fysics
```

If using `yarn`:

```sh
yarn install fysics
```

If using `pnpm`:

```sh
pnpm install fysics
```

## Usage 💡

Fysics is a powerful state management tool. It seeks to work as a more minimalist version of [Redux](https://redux.js.org/) with undo/redo history and side effects following the [redux-saga](https://github.com/redux-saga/redux-saga) pattern, powered by [RxJS](https://rxjs.dev/) and [Immer](https://immerjs.github.io/immer/). Decide upon your types for State, Payload, and SagaResponse, write the logic for initial state and actions, initialize the store, and go!

### User-defined Types

### State

This is the type describing the contents of the store.

Example:

```typescript
type StateType = {
  count: number;
};
```

While it is possible to add additional properties to the `State` after the store is initialized, it's recommended that the type used here contains all the properties you ever expect to have in your store. This better follows the intended state management design pattern, and will give the full benefits of using Typescript.

### Payload

This is the type describing the parameter that is passed to the saga and/or reducer.

Example:

```typescript
type PayloadType = {
  amount: number | undefined;
};
```

Each action may have its own payload shape and corresponding type - the `Payload` type should be a union of all of these, and within the code for the reducer and/or saga, the payload should be typecast to the type of the expected payload.

### SagaResponse

This is the type describing the return value from the saga, which is optionally passed to the reducer.

Example:

```typescript
type SagaResponseType = number;
```

As with the payload, each action that has a saga may have its own sagaResponse type. The `SagaResponse` type should be a union of all of these, and within the code for the reducer, the sagaResponse should be typecast to the type of the expected sagaResponse.

---

### Logic

The `Logic` is where the actions and initial state of your store are defined. The type is below:

```typescript
type Logic<State, Payload, SagaResponse> = {
  initialState: State;
  actions: {
    [ACTION_NAME: string]: Action<State, Payload, SagaResponse>;
  };
};
```

### initialState

The `initialState` property should contain initial values for every property you plan on having in the store. Even if the value is undefined, the property should still be listed explicitly.

### Actions

Each property is a name of an action, with the corresponding value describing that action using the `Action` type:

```typescript
type Action<State, Payload, SagaResponse> = {
  skipUndo?: boolean;
  scope?: string | Array<string>;
  reducer: Reducer<State, Payload, SagaResponse>;
  saga?: Saga<State, Payload, SagaResponse>;
};
```

The only required property for an `Action` is the `Reducer`, which is a function modifying a [draft](https://immerjs.github.io/immer/#how-immer-works) version of the current state following some logic, potentially using the payload and sagaResponse passed in.

```typescript
type Reducer<State, Payload, SagaResponse> = (
  state: Draft<State>,
  payload: Payload,
  sagaResponse?: SagaResponse,
) => void;
```

If the action has some side effect, the side effect is handled using a `Saga`:

```typescript
type Saga<State, Payload, SagaResponse> = (
  state: State,
  payload: Payload,
) => Promise<SagaResponse>;
```

The saga runs before the reducer to perform some (usually asynchronous) action outside the scope of the store, for example writing to local storage or querying a database. The return value of the saga is then passed to the reducer of this action in the case it has an impact on the state.

If the action should not be considered as an individual action to be undone or redone, set `skipUndo` to true. For example, if this action happens in the background without the user's knowledge after the most recent action the user has performed, initiating an undo should undo both the background action and the last action the user actually initiated.

The `scope` property is used for abstracting parts of the logic away from individual actions - it is not used by the store itself, but may be useful inside reducers or sagas to avoid code duplication.

---

The store implements the [Svelte store contract](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract) so the `$` syntactic sugar is available.

## Documentation 📄

Documentation is yet to be finalized as fysics is still _Under Development_

## Contributing 🍰

Please make sure to read the [Contributing Guide](CONTRIBUTING.md) before making a pull request.

Thank you to all the people who already contributed to this project!

## Maintainers 👷

<table>
  <tr>
    <td align="center"><a href="https://anubis.me/"><img src="https://avatars3.githubusercontent.com/u/15962062?s=460&v=4" width="100px;" alt="Anubis"/><br /><sub><b>Anubis</b></sub></a><br /><a href="#" title="Code">💻</a></td>
    <td align="center"><a href=""><img src="https://avatars3.githubusercontent.com/u/93603340?s=460&v=4" width="100px;" alt="jkeegan2"/><br /><sub><b>jkeegan2</b></sub></a><br /><a href="#" title="Code">💻</a></td>
  </tr>
</table>

## License ⚖️

MIT
