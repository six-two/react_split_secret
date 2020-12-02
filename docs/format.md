# Format documentation
This document describes, how the input / output of this web application is structured.
When bits and bytes are indexed, I use the following system:

Option | Value
---|---
Index of first element | 0
Byteorder | From most significant byte to least significant byte. Example: [byte_0, byte_1, byte_2, ..., byte_n]
Bitorder | From most significant bit to least significant bit. Example: [bit_0, bit_1, ..., bit_7]


## Shares
The first 2 bits contain the format version.

The versions are as follows:

Version bits | Version number | Comment
---|---|---
00 | 1 | 
01 | 2 | Does not exist yet
10 | 3 | Does not exist yet
11 | 4 | Does not exist yet

### Version 1
This format is only used, if the version bits have the value '00'. If they have a different value, 

#### Structure
Field | Size | Comment
---|---|---
VERSION | 2 bits | Value: '00'. Used to keep compatibility when changing the format in the future
SECRET_FORMAT | 2 bits | How the secret was originally encoded. Values: Unicode ('00'), Hex ('01'), Base64 ('10'), ASCII ('11')
CONSTANT_SIZE_SHARES | 1 bit | Indicates that constant size shares were used. The reconstruction of the secret will require additional encrypted data.
RESERVED | 3 bits | Defaults to zeros. Reserved for future use
THRESHOLD | 8 bits | The number of shares needed to reveal the secret again
SECRET_JS_SHARE | 4 * `n` bits, with `n` being any natural number | The share I got from the reveal.js library. Flexible length, but is a multiple of 4 bits.
CHECKSUM | 16 bits | Calculated by turning all data before this field into a hex string, and then getting the CRC16 of that value. Used to detect typos.

#### Encoding
The shares will be output as a hex string.

The characters can be visually grouped into chunks using whitespaces or dashes.
That should make it easier to input a potentially long code by hand.
Doing this is optional, since all spaces and dashes will be ignored when the value is parsed.

Example:
`abcdefghijklmnopqrstuvwxyz` => `abcd-efgh-ijkl-mnop qrst-uvwx-yz`


## Encrypted data
The first 2 bits contain the format version.

The versions are as follows:

Version bits | Version number | Comment
---|---|---
00 | 1 | 
01 | 2 | Does not exist yet
10 | 3 | Does not exist yet
11 | 4 | Does not exist yet

### Version 1

#### Structure
Field | Size | Comment
---|---|---
VERSION | 2 bits | Value: '00'. Used to keep compatibility when changing the format in the future.
RESERVED | 6 bits | Defaults to zeros. Reserved for future use
SJCL_ENCRYPTED | `n` bytes, with `n` being any natural number | The data encrypted by using SJCL.
CHECKSUM | 16 bits | Calculated by turning all data before this field into a hex string, and then getting the CRC16 of that value.

#### Encoding
The shares will be output as a base64 string.

