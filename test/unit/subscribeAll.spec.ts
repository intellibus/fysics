import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('Subscribe to Total State', async () => {
  const STORE = createStore(LOGIC);
  let curCount = 0;
  STORE.subscribeAll((state) => {
    curCount = state.present.count;
  });
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(curCount, 1);
});

test('Subscribe to Total State (no observer)', async () => {
  const STORE = createStore(LOGIC);
  const subscription = STORE.subscribeAll();
  subscription.unsubscribe();
});

test.run();
