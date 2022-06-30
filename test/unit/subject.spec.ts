import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('View Present State Subject', async () => {
  const STORE = createStore(LOGIC);
  const subject = STORE.subject();
  let curCount = 0;
  subject.subscribe((state) => {
    curCount = state.count;
  });
  subject.next({ count: 1, count2: 0 });
  assert.equal(curCount, 1);
});

test.run();
