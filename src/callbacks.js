import { currentChannel, removeWhitespace } from './utils';
import * as openpgp from 'openpgp';
import * as selectors from './selectors';
import { beginningOfPublicKey, beginningOfMessage } from './constants';
import { currentChannel, discryptMessage, getPrivateKey } from './utils';
import * as state from './state';

export const slateTextAreaKeyDown = async e => {
  if (e.key === 'Enter' || (e.key === 'v' && e.ctrlKey)) {
    return;
  }
  const recipientPublicKey = await state.recipientPublicKey();
  if (!recipientPublicKey) {
    alert('No recipient public key detected.');
    return;
  }

  e.preventDefault();

  const text = prompt('Message (paste when done):');
  const textEncrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text }),
    encryptionKeys: recipientPublicKey,
  });
  alert(textEncrypted);
  state.cacheMessage(removeWhitespace(textEncrypted), text);
};

export const messagesContainerTextContentChange = async () => {
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
        const { data } = await openpgp.decrypt({
          message: await openpgp.readMessage({
            armoredMessage: text,
          }),
          decryptionKeys: privateKey,
        });
        el.innerHTML = discryptMessage(data);
      }
    }
  });
};
