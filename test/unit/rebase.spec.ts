import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('Check Rebase Removing Undo/Redo History', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.undo();
  STORE.rebase();
  STORE.undo();
  assert.equal(STORE.get().count, 1);
  STORE.redo();
  assert.equal(STORE.get().count, 1);
});

test.run();
