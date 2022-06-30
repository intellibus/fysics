import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { delay, LOGIC } from './common';

test('Check Dispatch Modifying Total Store (no saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(STORE.getAll(), {
    past: [
      {
        action: { name: 'INCREMENT' },
        patches: [{ op: 'replace', path: ['count'], value: 1 }],
        inversePatches: [{ op: 'replace', path: ['count'], value: 0 }],
      },
      {
        action: { name: 'INCREMENT' },
        patches: [{ op: 'replace', path: ['count'], value: 2 }],
        inversePatches: [{ op: 'replace', path: ['count'], value: 1 }],
      },
    ],
    present: { count: 2, count2: 0 },
    future: [],
  });
});

test('Check Dispatch Modifying Total Store (saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(110);
  assert.equal(STORE.getAll(), {
    past: [
      {
        action: { name: 'INCREMENT_ASYNC' },
        patches: [{ op: 'replace', path: ['count'], value: 1 }],
        inversePatches: [{ op: 'replace', path: ['count'], value: 0 }],
      },
      {
        action: { name: 'INCREMENT_ASYNC' },
        patches: [{ op: 'replace', path: ['count'], value: 2 }],
        inversePatches: [{ op: 'replace', path: ['count'], value: 1 }],
      },
    ],
    present: { count: 2, count2: 0 },
    future: [],
  });
});

test.run();
