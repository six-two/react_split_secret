// Needs to be here to prevent cyclic references
import store from './store';
import * as C from './constants';
import { Share } from '../Share';

function d(action: Action) {
  store.dispatch(action);
}

export interface Action {
  type: string,
  payload?: string | number | boolean | null | Share,
};

// action creators
export function setScreen(newValue: string) {
  d({ type: C.SET_SCREEN, payload: newValue });
}

export function setTotalShareCount(newValue: number) {
  d({ type: C.SET_TOTAL_SHARE_COUNT, payload: newValue });
}

export function setThresholdShareCount(newValue: number) {
  d({ type: C.SET_THRESHOLD_SHARE_COUNT, payload: newValue });
}

export function setSecret(newValue: string) {
  d({ type: C.SET_SECRET, payload: newValue });
}

export function setSecretFormat(newValue: string) {
  d({ type: C.SET_SECRET_FORMAT, payload: newValue });
}

export function setMode(newValue: string) {
  d({ type: C.SET_MODE, payload: newValue });
}

