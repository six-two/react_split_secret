import { crc16 } from 'js-crc';
import { ReduxState } from './redux/store';
import * as C from './redux/constants';
import * as Codec from './CodecConverter';


const FORMAT_BITS = new Map<string, string>();
FORMAT_BITS.set(C.SECRET_TYPE_RAW, '00');
FORMAT_BITS.set(C.SECRET_TYPE_HEX, '01');
FORMAT_BITS.set(C.SECRET_TYPE_BASE64, '10');

const bits2hex = (bits: string, targetedHexLength: number) => {
    targetedHexLength *= 4;
    // Add trailing zeros, till it can be converted into hex
    while (bits.length < targetedHexLength) {
        bits += "0";
    }
    if (bits.length !== targetedHexLength) {
        throw new Error(`Bit string too long: Got ${bits.length}, but expected ${targetedHexLength}`);
    }

    let hex = "";
    for (let i = 0; i < bits.length; i += 4) {
        const nextFourBits = bits.substr(i, 4);
        hex += parseInt(nextFourBits, 2).toString(16);
    }
    return hex;
}


export const convertToMyShareFormat = (state: ReduxState, secretJsShares: string[]): string[] => {
    const versionBits = '00'; // 2 bits
    const formatBits = FORMAT_BITS.get(state.secret_format); // 2 bits
    const constantSizeSharesBit = state.constant_size_shares ? '1' : '0';

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

// // @SOURCE Taken from a comment on https://stackoverflow.com/questions/39460182/decode-base64-to-hexadecimal-string-with-javascript
// const hexToBase64 = (hex: string): string => {
//     return btoa(String.fromCharCode(...Array.apply(null, Array(hex.length / 2)).map((_, i) => parseInt(hex[i * 2] + hex[i * 2 + 1], 16))))
// }

// const hexToBase64 = (hex: string) => {
//     return btoa(hexToAscii(hex));
// }

// const hexToAscii = (hex: string) => {
//     if (hex.length % 2 !== 0) {
//         throw new Error("hex2ascii needs an hex string with an even length");
//     }
//     if (!hex.match(/^[0-9A-Fa-f]+$/)) {
//         throw new Error(`Invalid characters in hex string: "${hex}"`);
//     }
//     const values = [];
//     for (let i = 0; i < hex.length; i += 2) {
//         const hexByte = hex.substr(i, 2);
//         const byteValue = parseInt(hexByte, 16);
//         values.push(byteValue);
//     }
//     return String.fromCharCode(...values);
// }

// const asciiToHex = (ascii: string) => {
//     const hexList = [];
//     for (let i = 0; i < ascii.length; i++) {
//         const value = ascii.charCodeAt(i);
//         const hex = byte2hex(value);
//         hexList.push(hex);
//     }
//     return hexList.join("");
// }

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
