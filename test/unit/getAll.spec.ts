import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('Get Deep Copy of Total State', async () => {
  const STORE = createStore(LOGIC);
  const state = STORE.getAll();
  assert.equal(state.present.count, 0);
  state.present.count = -1;
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(STORE.get().count, 1);
  assert.equal(state.present.count, -1);
});

test.run();
