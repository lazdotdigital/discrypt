# discrypt

## Browser extension that adds client side E2E encryption to discord via PGP

![logo](./src/icons/96.png 'logo')

### How to use

- After installation, open a DM with someone on the Discord website. You will notice an alert popup.
- Once the page is fully loaded and you are ready to enable discrypt, press `ctrl+d`.
- Open your armored private key file, then optionally enter a passphrase (your key and passphrase are only stored in memory).
- You will notice your public key pop up. Copy it, paste it into the chat box, then hit enter. The person you are DMing should do the same.
- You are now ready to begin the message exchange. Click into the text box, and hit any key. A new prompt will come up. Go ahead and type your message in there.
- Upon hitting enter, the message encrypted with the recipients public key will pop up. Copy that, paste it into the text box, and hit enter.
- That's it! Continue to have a message exchange like that.
