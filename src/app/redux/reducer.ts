import * as Actions from './actions';
import * as C from './constants';
import { ReduxState, FALLBACK_STATE } from './store';
import { getSecretBytes, isValidFormat } from '../SplitSecret';

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
            const secret = action.payload as string;

            return updateConstantSizeMode(
                updateSecretFormat(
                    {
                        ...state,
                        secret,
                    }
                )
            );
        case C.SET_SECRET_FORMAT:
            return updateConstantSizeMode({
                ...state,
                secret_format: action.payload as string,
            });
        case C.SET_MODE:
            return updateSecretFormat({
                ...state,
                mode: action.payload as string,
            });
        case C.SET_CONSTANT_SHARE_SIZE:
            return {
                ...state,
                constant_size_shares: action.payload as boolean,
            }
        case C.SET_SECRET_IS_FILE:
            return {
                ...state,
                secret_is_file: action.payload as boolean,
            }
        case C.ON_SECRET_UPLOAD_DONE:
            return {
                ...state,
                secret: action.payload as string,
                secret_format: C.SECRET_TYPE_RAW,
                screen: C.SCREEN_SHARE_COUNTS,
            }
        default:
            return state;
    }
}

const updateConstantSizeMode = (state: ReduxState): ReduxState => {
    try {
        /// Call this method, whenever the secret (in its byte array representation) gets changed
        const secretLength = getSecretBytes(state.secret, state.secret_format).length;
        return {
            ...state,
            constant_size_shares: secretLength >= USE_CONST_SIZE_THRESHOLD,
        }
    } catch {
        // The user has given us a secret, that does not match the format
        return state;
    }
}

const updateSecretFormat = (state: ReduxState): ReduxState => {
    if (state.mode === C.MODE_EASIEST) {
        // Choose the most efficient way to encode the secret
        let secret_format;
        if (isValidFormat(state.secret, C.SECRET_TYPE_HEX)) {
            secret_format = C.SECRET_TYPE_HEX;
        } else if (isValidFormat(state.secret, C.SECRET_TYPE_BASE64)) {
            secret_format = C.SECRET_TYPE_BASE64;
        } else {
            secret_format = C.SECRET_TYPE_RAW;
        }
        return {
            ...state,
            secret_format,
        };
    } else {
        return state;
    }
}

export default reducer;
