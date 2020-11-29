import { crc16 } from 'js-crc';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';
import * as Codec from './CodecConverter';
import { getSecretHexFromState } from './SplitSecret';


const FORMAT_BITS = new Map<string, string>();
FORMAT_BITS.set(C.SECRET_TYPE_UNICODE, '00');
FORMAT_BITS.set(C.SECRET_TYPE_HEX, '01');
FORMAT_BITS.set(C.SECRET_TYPE_BASE64, '10');
FORMAT_BITS.set(C.SECRET_TYPE_ASCII, '11');

const bits2hex = (bits: string, targetedHexLength: number) => {
    if (!bits.match(/^[01]*$/)) {
        throw new Error(`Bit string contains invalid characters: "${bits}"`);
    }

    targetedHexLength *= 4;
    // Add trailing zeros, till it can be converted into hex
    while (bits.length < targetedHexLength) {
        bits += "0";
    }
    if (bits.length !== targetedHexLength) {
        throw new Error(`Bit string too long: Got ${bits.length}, but expected ${targetedHexLength}. Bits: "${bits}"`);
    }

    let hex = "";
    for (let i = 0; i < bits.length; i += 4) {
        const nextFourBits = bits.substr(i, 4);
        hex += parseInt(nextFourBits, 2).toString(16);
    }
    return hex;
}


export const convertToMyShareFormat = (state: ReduxState, secretJsShares: string[]): string[] => {
    const secret = getSecretHexFromState(state);
    const versionBits = '00'; // 2 bits
    const formatBits = FORMAT_BITS.get(secret.format); // 2 bits
    const constantSizeSharesBit = state.constant_size_shares ? '1' : '0';

    if (!formatBits) {
        throw new Error(`No format bit code known for format: "${secret.format}"`)
    }

    return secretJsShares.map(shareData => {
        if (!shareData.match(/^[0-9A-Fa-f]+$/)) {
            throw new Error(`[Internal error] SecretJS created a share, which is not a valid hex string: '${shareData}'`);
        }
        let hexData = bits2hex(versionBits + formatBits + constantSizeSharesBit, 2); // 1 byte
        hexData += Codec.byteToHex(state.threshold_share_count); // 1 byte
        hexData += shareData;
        return hexData + crc16(hexData); // 2 bytes
    });
};

export const convertToMyEncryptedDataFormat = (sjclDataString: string) => {
    const header = "00";
    console.debug("Encrypted data raw:", sjclDataString);
    const sjclHex = Codec.asciiToHex(sjclDataString);
    let hexData = header + sjclHex;
    hexData += crc16(hexData);
    console.debug("Encrypted data hex:", hexData);
    // hex -> base64
    return Codec.asciiToBase64(Codec.hexToAscii(hexData));
}
