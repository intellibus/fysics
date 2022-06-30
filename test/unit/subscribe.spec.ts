import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { delay, LOGIC } from './common';

test('Subscribe to Present State', async () => {
  const STORE = createStore(LOGIC);
  let curCount = 0;
  STORE.subscribe((state) => {
    curCount = state.count;
  });
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(curCount, 1);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(60);
  assert.equal(curCount, 2);
});

test.run();
