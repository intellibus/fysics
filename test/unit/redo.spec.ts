import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { delay, LOGIC } from './common';

test('Redo Normal Action (no skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 2);
});

test('Redo Normal Action (with skipUndo) 1', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 2);
  assert.equal(STORE.get().count2, 1);
});

test('Redo Normal Action (with skipUndo) 2', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 1);
  assert.equal(STORE.get().count2, 1);
});

test('Redo Saga Action (no skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(110);
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 2);
});

test('Redo Saga Action (with skipUndo)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT2_ASYNC' });
  await delay(160);
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 2);
  assert.equal(STORE.get().count2, 1);
});

test.run();
