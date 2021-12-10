import { removeWhitespace } from './utils';
import * as openpgp from 'openpgp';
import * as selectors from './selectors';
import { beginningOfPublicKey, beginningOfMessage } from './constants';
import { discryptMessage } from './utils';
import * as state from './state';
import Swal from 'sweetalert2';

export const slateTextAreaKeyDown = async e => {
  if (e.key === 'Enter' || (e.key === 'v' && e.ctrlKey)) {
    return;
  }
  const recipientPublicKey = await state.recipientPublicKey();
  if (!recipientPublicKey) {
    await Swal.fire('No recipient public key detected.');
    return;
  }

  e.preventDefault();

  const { value: text } = await Swal.fire({
    title: 'Message',
    input: 'textarea',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off',
    },
  });
  const textEncrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text }),
    encryptionKeys: recipientPublicKey,
  });
  await Swal.fire({
    title: 'Encrypted message',
    input: 'textarea',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off',
    },
    inputValue: textEncrypted,
  });
  state.cacheMessage(removeWhitespace(textEncrypted), text);
};

export const messagesContainerInterval = async () => {
  const privateKey = state.privateKey();
  const publicKey = await state.publicKey();
  selectors.messages().forEach(async el => {
    const text = el.textContent;
    const textNoWhitespace = removeWhitespace(text);
    // Direct comparison doesn't work.
    if (textNoWhitespace === removeWhitespace(publicKey.armor())) {
      el.innerHTML = discryptMessage('<i>OWN PUBLIC KEY</i>');
    } else if (text.startsWith(beginningOfPublicKey)) {
      state.setRecipientPublicKey(text);
      el.innerHTML = discryptMessage('<i>RECIPIENT PUBLIC KEY</i>');
    } else if (text.startsWith(beginningOfMessage)) {
      const cached = state.cachedMessage(textNoWhitespace);
      if (cached) {
        el.innerHTML = discryptMessage(cached);
      } else {
        try {
          const { data } = await openpgp.decrypt({
            message: await openpgp.readMessage({
              armoredMessage: text,
            }),
            decryptionKeys: privateKey,
          });
          el.innerHTML = discryptMessage(data);
        } catch (err) {
          el.innerHTML = discryptMessage(`<i>${err}</i>`);
        }
      }
    }
  });
};
