import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('Get Deep Copy of Present State', async () => {
  const STORE = createStore(LOGIC);
  const present = STORE.get();
  assert.equal(present.count, 0);
  present.count = -1;
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(STORE.get().count, 1);
  assert.equal(present.count, -1);
});

test.run();
