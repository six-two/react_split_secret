# Split secrets

This application uses the [secret.js](https://github.com/grempe/secrets.js) library to split a secret (like a passowrd) into many shares.
You can then recover the secret from the shares, if you have know at least a certain number of shares.

But app also offers some improvments on top of secret.js:
- Formats shares in a less errorprone way
- Detect typos in shares
- Can encode different types of data efficiently (hex, base64, ascii, and unicode strings).
- Better handling of big files. Instead of splitting the secret directly (which results in multiple shares, each slightly bigger than the secret), it can encrypt big secrets. Then only the encryption key needs to be split, which can results in *way* smaller shares.

## Demo
1. [Split a secret into shares](https://split.secrets.six-two.dev/)
2. [Use the shares to reveal the secret again](https://reveal.secrets.six-two.dev/)

## Example usecase
Say you want to store the master password for your password manager.

You can split it into say 5 shares and set it up, so that you will need any 3 of them to reveal it again.
Then you can store each of the shares in different places (just pick better choices than I did for this example 😉):

- your email drafts folder
- on your phone
- your laptop
- an old usb stick
- a postit note in your office

This protects your secret in two ways:

- You can loose some (in this case 2) of the shares, without loosing access to your secret.
   So if your laptop dies you have one less thing to worry about.
- If someone gets only a few (in this case 2 or fewer) shares, they will not be able to steal your secret.
    So even if a hacker gets access to your laptop (and thus probably also to your email), you are ok.
    At least until he/she hacks into your phone, you plug the usb into your laptop, or he/she manages to see the postit note with the laptops webcam.

## Documentation

- `docs/npm-commands.md`: Contains instruction how to build and run this program on your own computer.
- `docs/format.md`: Describes the structure and encoding of the shares and the encrypted data.

