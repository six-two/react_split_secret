import sjcl from 'sjcl';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';
import { Share } from './Share';


const secrets = (window as any).secrets;

export const isValidFormat = (secret: string, secret_format: string): boolean => {
    try {
        getSecretBytes(secret, secret_format)
        return true;
    } catch {
        return false;
    }
}

export const getSecretBytes = (value: string, type: string): string => {
    try {
        switch (type) {
            case C.SECRET_TYPE_RAW:
                return value;
            case C.SECRET_TYPE_HEX:
                // This function just ignores invalid characters: abc === aggggbhhhhhchh === hhhabc$$$
                if (!value.match(/^([0-9A-Fa-f]{2})*$/)) {
                    throw new Error(`Failed to decode "${value}" as hex string`);
                }
                return secrets.hex2str(value.toLowerCase());
            case C.SECRET_TYPE_BASE64:
                return atob(value);
            default:
                console.error(`Unknown secret type: "${type}"`);
                return value;
        }
    } catch {
        const msg = `Failed to decode "${value}" as ${type}`;
        console.debug(msg);
        throw new Error(msg);
    }
}

export const splitSecret = (state: ReduxState): SplitSecretResult => {
    try {
        let secret = getSecretBytes(state.secret, state.secret_format);
        let encrypted_data;

        if (state.constant_size_shares) {
            const key = secrets.random(256); // a random hex string with 256 chars of entropy
            encrypted_data = sjcl.encrypt(key, secret).toString(); // use it to encrypt the secret
            secret = key; // and then make the key the thing to split
        } else {
            // convert the secret to a hex string
            secret = secrets.str2hex(secret) as string;
        }

        // TODO also add secret format to serialized share
        //TODO rework share
        const raw_shares = secrets.share(secret, state.total_share_count, state.threshold_share_count);
        const shares = raw_shares.map((share: string) => new Share(state.threshold_share_count, share).serialize2hex());

        return {
            shares,
            encrypted_data,
        }
    } catch (e: any) {
        console.error("Error while splitting secret:", e);
        return {
            error: e.toString(),
        }
    }
}

export interface SplitSecretResult {
    shares?: string[],
    encrypted_data?: string,
    error?: string,
}
