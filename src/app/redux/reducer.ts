import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';


export function reducer(state: ReduxState | undefined, action: Actions.Action): ReduxState {
    if (!state) {
        console.warn("No state was supplied to reducer. Falling back to default values");
        state = FALLBACK_STATE;
    }

    return wrapped_reducer(state, action);
}

export function wrapped_reducer(state: ReduxState, action: Actions.Action): ReduxState {
    switch (action.type) {
        case C.SET_SCREEN:
            return {
                ...state,
                screen: action.payload as string
            }
        case C.SET_TOTAL_SHARE_COUNT:
            return {
                ...state,
                total_share_count: action.payload as number,
            }
        case C.SET_THRESHOLD_SHARE_COUNT:
            return {
                ...state,
                threshold_share_count: action.payload as number,
            }
        case C.SET_SECRET:
            return {
                ...state,
                secret: action.payload as string,
            }
        case C.SET_SECRET_FORMAT:
            return {
                ...state,
                secret_format: action.payload as string,
            }
        case C.SET_MODE:
            return {
                ...state,
                mode: action.payload as string,
            }
        case C.SET_CONSTANT_SHARE_SIZE:
            return {
                ...state,
                constant_size_shares: action.payload as boolean,
            }
        default:
            return state;
    }
}

export default reducer;
