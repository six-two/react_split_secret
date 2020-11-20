import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';
import {getSecretBytes} from '../SplitSecret';

/// Use constant size shares by default, if the secret is bigger than this many bytes
/// The encryption key is 32 bytes long, so this value should be at least 32
const USE_CONST_SIZE_THRESHOLD = 64;

export function reducer(state: ReduxState | undefined, action: Actions.Action): ReduxState {
    if (!state) {
        console.warn("No state was supplied to reducer. Falling back to default values");
        state = FALLBACK_STATE;
    }

    return wrapped_reducer(state, action);
}

export function wrapped_reducer(state: ReduxState, action: Actions.Action): ReduxState {
    switch (action.type) {
        case C.SET_SCREEN: {
            return {
                ...state,
                screen: action.payload as string,
            }
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
            return updateConstantSizeMode({
                ...state,
                secret: action.payload as string,
            });
        case C.SET_SECRET_FORMAT:
            return updateConstantSizeMode({
                ...state,
                secret_format: action.payload as string,
            });
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

const updateConstantSizeMode = (state: ReduxState): ReduxState => {
    /// Call this method, whenever the secret (in its byte array representation) gets changed
    const secretLength = getSecretBytes(state.secret, state.secret_format).length;
    return {
        ...state,
        constant_size_shares: secretLength >= USE_CONST_SIZE_THRESHOLD,
    }
}

export default reducer;
