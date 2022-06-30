import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore } from '../../src';
import { LOGIC } from './common';

test('Check Store Function Initialization', async () => {
  const STORE = createStore(LOGIC);
  assert.ok(STORE);
  assert.type(STORE.subject, 'function');
  assert.type(STORE.subjectAll, 'function');
  assert.type(STORE.subscribe, 'function');
  assert.type(STORE.get, 'function');
  assert.type(STORE.getAll, 'function');
  assert.type(STORE.dispatch, 'function');
  assert.type(STORE.undo, 'function');
  assert.type(STORE.redo, 'function');
  assert.type(STORE.rebase, 'function');
});

test.run();
