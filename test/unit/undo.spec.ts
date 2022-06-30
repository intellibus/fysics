import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { delay, LOGIC } from './common';

test('Undo Normal Action (no skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.undo();
  assert.equal(STORE.get().count, 1);
});

test('Undo Normal Action (with skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.undo();
  assert.equal(STORE.get().count, 1);
  assert.equal(STORE.get().count2, 0);
});

test('Undo Saga Action (no skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT2_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(160);
  STORE.undo();
  assert.equal(STORE.get().count, 1);
});

test('Undo Saga Action (with skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT2_ASYNC' });
  await delay(160);
  STORE.undo();
  assert.equal(STORE.get().count, 1);
  assert.equal(STORE.get().count2, 0);
});

test('Undo With Only skipUndo Actions', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.undo();
  assert.equal(STORE.get().count2, 2);
});

test.run();
