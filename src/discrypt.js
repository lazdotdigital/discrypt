import * as selectors from './selectors';
import { observeTextContent, readFile } from './utils';
import * as state from './state';
import textEncoding from 'text-encoding-utf-8';
import {
  slateTextAreaKeyDown,
  messagesContainerTextContentChange,
} from './callbacks';

// must set these in order for encryption functions to work
global.TextEncoder = textEncoding.TextEncoder;
global.TextDecoder = textEncoding.TextDecoder;

alert('Press ctrl+d once page is fully loaded to enable Discrypt.');

const initPrivateKey = async () => {
  alert('Select armored private key file:');
  const armoredKey = await readFile();
  const passphrase = prompt('Passphrase (if any):');
  await state.setPrivateKey(armoredKey, passphrase);
};

const main = async () => {
  window.onkeydown = () => {};

  await initPrivateKey();
  alert((await state.publicKey()).armor());

  selectors.slateTextArea().onkeydown = slateTextAreaKeyDown;

  messagesContainerTextContentChange();
  observeTextContent(
    selectors.messagesContainer(),
    messagesContainerTextContentChange,
    1000,
  );
};

window.onkeydown = e => {
  if (e.key === 'd' && e.ctrlKey) {
    main();
  }
};
