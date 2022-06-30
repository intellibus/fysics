import { produceWithPatches, enablePatches, applyPatches } from 'immer';
import { cloneDeep } from 'lodash';
import { Subject, map, Observer } from 'rxjs';
import { Logic, DispatchAction, FullState } from './types';

enablePatches();

export const createStore = <State, Payload, SagaResponse>(
  LOGIC: Logic<State, Payload, SagaResponse>,
) => {
  let STATE: FullState<State, Payload> = {
    past: [],
    present: LOGIC.initialState,
    future: [],
  };

  const StateSubject = new Subject<FullState<State, Payload>>();
  const PresentStateSubject = new Subject<State>();

  StateSubject.pipe(map(({ present }) => present)).subscribe(
    PresentStateSubject,
  );

  const SagaSubject = new Subject<DispatchAction<Payload>>();

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
        present: finalState,
        future: [],
      };
      StateSubject.next(STATE);
    }
  });

  StateSubject.next(STATE);
  PresentStateSubject.next(STATE.present);

  return {
    subject: () => PresentStateSubject,
    subjectAll: () => StateSubject,
    subscribe: (
      observer?: Partial<Observer<State>> | ((value: State) => void),
    ) => {
      if (observer) {
        return PresentStateSubject.subscribe(
          observer as Partial<Observer<State>>,
        );
      }
      return PresentStateSubject.subscribe();
    },
    subscribeAll: (
      observer?:
        | Partial<Observer<FullState<State, Payload>>>
        | ((value: FullState<State, Payload>) => void),
    ) => {
      if (observer) {
        return StateSubject.subscribe(
          observer as Partial<Observer<FullState<State, Payload>>>,
        );
      }
      return StateSubject.subscribe();
    },
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
            present: finalState,
            future: [],
          };
          StateSubject.next(STATE);
        }
      }
    },
    undo: () => {
      let i = STATE.past.length - 1;
      for (; i >= 0; i -= 1) {
        if (!LOGIC.actions[STATE.past[i].action.name].skipUndo) {
          break;
        }
      }
      if (i >= 0) {
        for (let j = STATE.past.length - 1; j >= i; j -= 1) {
          const lastAction = STATE.past.pop();
          STATE.present = applyPatches(
            STATE.present,
            lastAction.inversePatches,
          );
          STATE.future = [...STATE.future, { ...lastAction }];
        }
        StateSubject.next(STATE);
      }
    },
    redo: () => {
      if (STATE.future.length === 0) {
        return;
      }
      let i = STATE.future.length - 1;
      let shouldBreak = false;
      for (; i >= 0; i -= 1) {
        if (!LOGIC.actions[STATE.future[i].action.name].skipUndo) {
          if (shouldBreak) {
            break;
          }
          shouldBreak = true;
        }
      }
      for (let j = STATE.future.length - 1; j > i; j -= 1) {
        const nextAction = STATE.future.pop();
        STATE.present = applyPatches(STATE.present, nextAction.patches);
        STATE.past = [...STATE.past, { ...nextAction }];
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
