import { crc16 } from 'js-crc';

const byte2hex = (byte: number, padding: number = 2) => {
    if (byte < 0 || byte > 255) {
        throw new Error(`Number is out of byte range: ${byte}`);
    }
    let hexString = byte.toString(16);
    while (hexString.length < padding) {
        hexString = '0' + hexString;
    }
    return hexString;
}

export const deserializeHex = (hexBytes: string): Share => {
    const versionAndFlags = hexBytes.substr(0, 2);
    // Remove version header
    let remainingBytes = hexBytes.substr(2);

    if (versionAndFlags === '00') {
        // Check the crc
        const crcOffset = hexBytes.length - 4;
        const calculatedCrc = crc16(hexBytes.substr(0, crcOffset));
        const originalCrc = hexBytes.substr(crcOffset);
        if (calculatedCrc !== originalCrc) {
            throw new Error(`Checksum validation failed: Calculated ${calculatedCrc}, but expected ${originalCrc}`)
        }
        // Remove trailing crc
        remainingBytes = remainingBytes.substr(0, remainingBytes.length - 4);

        const thresholdBytes = remainingBytes.substr(0, 2);
        const threshold = parseInt(thresholdBytes, 16);
        // Remove threshold header
        remainingBytes = remainingBytes.substr(2);

        const share = remainingBytes;

        return new Share(threshold, share);
    } else {
        throw new Error('The data is either corrupted or was created by a newer version of this app');
    }
};

export class Share {
    versionAndFlags: string;
    threshold: number;
    share: string;

    constructor(threshold: number, share: string) {
        this.versionAndFlags = "00";
        this.threshold = threshold;
        this.share = share;
    }

    serialize2hex(): string {
        const thresholdBytes = byte2hex(this.threshold);
        const shareAsHex = this.share;//TODO make sure it is completely in hex format, otherwise convert is to hex (and store a flag that warns me)
        const hexBytes = this.versionAndFlags + thresholdBytes + shareAsHex;

        return hexBytes + crc16(hexBytes);
    }
}
