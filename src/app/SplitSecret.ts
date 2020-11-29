import sjcl from 'sjcl';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';
import * as Codec from './CodecConverter';
import { convertToMyShareFormat, convertToMyEncryptedDataFormat } from './CustomShareFormat';


const secrets = (window as any).secrets;

export interface HexAndFormat {
    hex: string,
    format: string,
}

export const isValidFormat = (secret: string, secret_format: string): boolean => {
    try {
        getSecretHex(secret, secret_format)
        return true;
    } catch {
        return false;
    }
}

export const removeWhitespace = (text: string): string => {
    return text.replaceAll(/[\s]+/g, "");
}

export const getSecretHexFromState = (state: ReduxState): HexAndFormat => {
    const secret = state.secret_is_file ? (state.secret_file || "") : state.secret_text;
    const secret_format = state.secret_is_file ? C.SECRET_TYPE_AUTO_DETECT : state.secret_format;
    return getSecretHex(secret, secret_format);
}

const autodetectFormat = (value: string): string => {
    // sort them by efficiency
    const formats = [C.SECRET_TYPE_HEX, C.SECRET_TYPE_BASE64, C.SECRET_TYPE_ASCII, C.SECRET_TYPE_UNICODE];
    for (let format of formats) {
        try {
            // this will throw an error, if the format is not correct
            internalSecretToHex(value, format);
            console.debug(`Autodetected format: "${value}" has format "${format}"`);
            return format;
        } catch {
            // do nothing, try the next format
        }
    }
    const msg = `Could not find a matching format for secret: "${value}"`;
    console.error(msg);
    throw new Error(msg);
}

export const getSecretHex = (value: string, format: string): HexAndFormat => {
    if (format === C.SECRET_TYPE_AUTO_DETECT) {
        format = autodetectFormat(value);
    }
    try {
        const hex = internalSecretToHex(value, format);
        return {
            hex: Codec.assertHex(hex),
            format,
        };
    } catch (e) {
        const msg = `Failed to decode "${value}" as ${format}`;
        console.log(msg, e);
        throw new Error(msg);
    }
}

const internalSecretToHex = (value: string, type: string): string => {
    switch (type) {
        case C.SECRET_TYPE_UNICODE:
            return Codec.unicodeToHex(value);
        case C.SECRET_TYPE_ASCII:
            return Codec.asciiToHex(value);
        case C.SECRET_TYPE_HEX:
            value = removeWhitespace(value);
            return Codec.assertHex(value);
        case C.SECRET_TYPE_BASE64:
            value = removeWhitespace(value);
            value = Codec.base64ToAscii(value);
            return Codec.asciiToHex(value);
        default:
            throw new Error(`Unknown secret type: "${type}"`);
    }
}

export const splitSecret = (state: ReduxState): SplitSecretResult => {
    try {
        const tmp = getSecretHexFromState(state);
        let [secretHex, secretFormat] = [tmp.hex, tmp.format];
        let encrypted_data;

        if (state.constant_size_shares) {
            // convert the secret hex to binary data
            let secretRaw;
            if (secretFormat === C.SECRET_TYPE_UNICODE) {
                secretRaw = Codec.hexToUnicode(secretHex);
            } else {
                secretRaw = Codec.hexToAscii(secretHex);
            }

            const key = secrets.random(256); // a random hex string with 256 chars of entropy
            const sjclData = sjcl.encrypt(key, secretRaw).toString();
            encrypted_data = convertToMyEncryptedDataFormat(sjclData);
            secretHex = key; // and then make the key the thing to split
        } else {
            // convert the secret to a hex string
        }

        const raw_shares = secrets.share(secretHex, state.total_share_count, state.threshold_share_count);
        const shares = convertToMyShareFormat(state, raw_shares);

        return {
            shares,
            encrypted_data,
            secretFormat,
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
    secretFormat?: string,
    error?: string,
}
