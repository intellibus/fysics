import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('View Total State Subject', async () => {
  const STORE = createStore(LOGIC);
  const subject = STORE.subjectAll();
  let curCount = 0;
  subject.subscribe((state) => {
    curCount = state.present.count;
  });
  subject.next({ past: [], present: { count: 1, count2: 0 }, future: [] });
  assert.equal(curCount, 1);
});

test.run();
