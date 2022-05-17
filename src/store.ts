import { produceWithPatches, enablePatches, applyPatches } from 'immer';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Logic, DispatchAction } from './types';

enablePatches();

export const createStore = <State, Payload, SagaResponse>(
  LOGIC: Logic<State, Payload, SagaResponse>,
) => {
  let STATE = {
    past: [],
    present: LOGIC.initialState,
    future: [],
  };

  const StateSubject = new BehaviorSubject(STATE);

  const SagaSubject = new BehaviorSubject({ name: '' });

  SagaSubject.subscribe(async (action: DispatchAction<Payload>) => {
    const actionObj = LOGIC.actions[action.name];
    if (actionObj && actionObj.saga) {
      const sagaResponse = await actionObj.saga(
        cloneDeep(STATE).present,
        action.payload,
      );
      const [finalState, patches, inversePatches] = produceWithPatches(
        STATE.present,
        (draftState) =>
          actionObj.reducer(draftState, action.payload, sagaResponse),
      );
      STATE = {
        past: [...STATE.past, { action, patches, inversePatches }],
        present: finalState as unknown as State,
        future: [],
      };
      StateSubject.next(STATE);
    }
  });

  return {
    subject: () => StateSubject,
    subscribe: (observer) => StateSubject.subscribe(observer),
    get: () => cloneDeep(STATE).present,
    getAll: () => cloneDeep(STATE),
    dispatch: (action: DispatchAction<Payload>) => {
      const actionObj = LOGIC.actions[action.name];
      if (actionObj) {
        if (actionObj.saga) {
          SagaSubject.next(action);
        } else {
          const [finalState, patches, inversePatches] = produceWithPatches(
            STATE.present,
            (draftState) => actionObj.reducer(draftState, action.payload),
          );

          STATE = {
            past: [...STATE.past, { action, patches, inversePatches }],
            present: finalState as unknown as State,
            future: [],
          };
        }
        StateSubject.next(STATE);
      }
    },
    undo: () => {
      let lastAction = STATE.past.pop();
      while (lastAction && lastAction.action) {
        STATE.present = applyPatches(STATE.present, lastAction.inversePatches);
        STATE.future = [...STATE.future, { ...lastAction }];
        const actionObj = LOGIC.actions[lastAction.action.name];
        if (!actionObj.skipUndo) {
          break;
        }
        lastAction = STATE.past.pop();
      }
      StateSubject.next(STATE);
    },
    redo: () => {
      let nextAction = STATE.future.pop();
      while (nextAction && nextAction.action) {
        STATE.present = applyPatches(STATE.present, nextAction.patches);
        STATE.past = [...STATE.past, { ...nextAction }];
        const actionObj = LOGIC.actions[nextAction.action.name];
        if (!actionObj.skipUndo) {
          break;
        }
        nextAction = STATE.future.pop();
      }
      StateSubject.next(STATE);
    },
    rebase: () => {
      STATE.past = [];
      STATE.future = [];
      StateSubject.next(STATE);
    },
  };
};
