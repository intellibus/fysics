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

Fysics seeks to work as a more minimalist version of [Redux](https://redux.js.org/) with undo/redo history and side effects following the [redux-saga](https://github.com/redux-saga/redux-saga) pattern, powered by [RxJS](https://rxjs.dev/) and [Immer](https://immerjs.github.io/immer/). Decide upon your types for State, Payload, and SagaResponse, write the logic for initial state and actions, initialize the store, and go!

State: This is the type describing the present contents of the store.
Payload: This is the type describing the parameter that is passed to the saga and/or reducer.
SagaResponse: This is the type describing the return value from the saga, which is optionally passed to the reducer.

The logic passed to createStore() has the following shape:

initialState: The present State of the store upon initialization
actions: A dict whose keys are action names and whose values are Actions.

Actions are objects containing information on what to perform when that object's key in the logic's action dict is dispatched. An action has the following properties:

(optional - default false) skipUndo: (boolean) This should be set to true only if the action should not be considered as an individual operation to be undone. For example, if this action happens in the background without the user's knowledge after the most recent action the user has performed, it should be undone alongside the last action the user performs.
(optional - default undefined) scope: (string | string[]) This is an organizational property which does not affect execution of anything inside the store.
(required) reducer: (function) The reducer takes a [draft](https://immerjs.github.io/immer/#how-immer-works) version of the current state and modifies it directly to reflect the desired state after having run the action; this is used with Immer's produceWithPatches function to write to the store with the new state and patches + inverse patches for undo/redo history.
(optional - default undefined) saga: (function) The saga runs before the reducer to perform some (usually asynchronous) action outside the scope of the store, for example writing to local storage or querying a database. The return value of the saga is then passed to the reducer of this action in the case it has an impact on the state.

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
