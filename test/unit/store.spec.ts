import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStore, Logic } from '../../src';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type StateType = { count: number; count2: number };
type PayloadType = { amount: number | undefined };
const LOGIC: Logic<StateType, PayloadType, number> = {
  initialState: { count: 0, count2: 0 },
  actions: {
    INCREMENT: {
      reducer: (state, payload) => {
        state.count += payload?.amount ?? 1;
      },
    },
    INCREMENT2: {
      skipUndo: true,
      reducer: (state, payload) => {
        state.count2 += payload?.amount ?? 1;
      },
    },
    INCREMENT_ASYNC: {
      skipUndo: true,
      saga: async (state, payload) => {
        await delay(50);
        return payload?.amount ?? 1;
      },
      reducer: (state, payload, sagaResponse) => {
        state.count += sagaResponse ?? 1;
      },
    },
  },
};

test('Initialize Store', async () => {
  const STORE = createStore(LOGIC);
  assert.ok(STORE);
  assert.ok(STORE.subject);
  assert.ok(STORE.subjectAll);
  assert.ok(STORE.subscribe);
  assert.ok(STORE.get);
  assert.ok(STORE.getAll);
  assert.ok(STORE.dispatch);
  assert.ok(STORE.undo);
  assert.ok(STORE.redo);
  assert.ok(STORE.rebase);
});

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

test('Dispatch (no saga)', async () => {
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

test('Dispatch (saga)', async () => {
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

test('Subscribe to Present State', async () => {
  const STORE = createStore(LOGIC);
  let curCount = 0;
  STORE.subscribe((state) => {
    curCount = state.count;
  });
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(curCount, 1);
});

test('Subscribe to Total State', async () => {
  const STORE = createStore(LOGIC);
  let curCount = 0;
  STORE.subscribeAll((state) => {
    curCount = state.present.count;
  });
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(curCount, 1);
});

test('Get Deep Copy of Present State', async () => {
  const STORE = createStore(LOGIC);
  const present = STORE.get();
  assert.equal(present.count, 0);
  present.count = -1;
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(STORE.get().count, 1);
  assert.equal(present.count, -1);
});

test('Get Deep Copy of Total State', async () => {
  const STORE = createStore(LOGIC);
  const state = STORE.getAll();
  assert.equal(state.present.count, 0);
  state.present.count = -1;
  STORE.dispatch({ name: 'INCREMENT' });
  assert.equal(STORE.get().count, 1);
  assert.equal(state.present.count, -1);
});

test('Undo Action (no saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT2' });
  STORE.undo();
  assert.equal(STORE.get().count, 1);
  assert.equal(STORE.get().count2, 0);
});

test('Undo Action (saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(110);
  STORE.undo();
  assert.equal(STORE.get().count, 0);
});

test('Redo Action (no saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT2' });
  // console.log(JSON.stringify(STORE.getAll()));
  STORE.undo();
  // console.log(JSON.stringify(STORE.getAll()));
  STORE.redo();
  // console.log(JSON.stringify(STORE.getAll()));
  assert.equal(STORE.get().count, 2);
  assert.equal(STORE.get().count2, 0);
});

test('Redo Action (saga)', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  STORE.dispatch({ name: 'INCREMENT_ASYNC' });
  await delay(110);
  STORE.undo();
  STORE.redo();
  assert.equal(STORE.get().count, 2);
});

test('Rebase', async () => {
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.dispatch({ name: 'INCREMENT' });
  STORE.undo();
  STORE.rebase();
  STORE.undo();
  assert.equal(STORE.get().count, 1);
});

test.run();

// const test1 = {
//   past: [
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 0 }],
//     },
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 2 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 1 }],
//     },
//     {
//       action: { name: 'INCREMENT2' },
//       patches: [{ op: 'replace', path: ['count2'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count2'], value: 0 }],
//     },
//   ],
//   present: { count: 2, count2: 1 },
//   future: [],
// };

// const test2 = {
//   past: [
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 0 }],
//     },
//   ],
//   present: { count: 1, count2: 0 },
//   future: [
//     {
//       action: { name: 'INCREMENT2' },
//       patches: [{ op: 'replace', path: ['count2'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count2'], value: 0 }],
//     },
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 2 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 1 }],
//     },
//   ],
// };

// const test3 = {
//   past: [
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 0 }],
//     },
//     {
//       action: { name: 'INCREMENT' },
//       patches: [{ op: 'replace', path: ['count'], value: 2 }],
//       inversePatches: [{ op: 'replace', path: ['count'], value: 1 }],
//     },
//   ],
//   present: { count: 2, count2: 0 },
//   future: [
//     {
//       action: { name: 'INCREMENT2' },
//       patches: [{ op: 'replace', path: ['count2'], value: 1 }],
//       inversePatches: [{ op: 'replace', path: ['count2'], value: 0 }],
//     },
//   ],
// };
