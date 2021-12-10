import * as selectors from './selectors';
import * as state from './state';
import textEncoding from 'text-encoding-utf-8';
import { slateTextAreaKeyDown, messagesContainerInterval } from './callbacks';
import Swal from 'sweetalert2';

// must set these in order for encryption functions to work
global.TextEncoder = textEncoding.TextEncoder;
global.TextDecoder = textEncoding.TextDecoder;

window.onload = async () =>
  await Swal.fire(
    'Discrypt',
    'Press <b>ctrl+d</b> once page is loaded to enable Discrypt.',
  );

const main = async () => {
  window.onkeydown = () => {};

  await Swal.fire({
    title: 'Your public key',
    input: 'textarea',
    inputValue: (await state.publicKey()).armor(),
  });

  selectors.slateTextArea().onkeydown = slateTextAreaKeyDown;

  messagesContainerInterval();
  setInterval(() => {
    messagesContainerInterval();
  }, 1000);
};

const initPrivateKey = async () => {
  const { value: file } = await Swal.fire({
    title: 'Armored private key',
    input: 'file',
  });
  if (file) {
    const reader = new FileReader();
    reader.onload = async e => {
      const armoredKey = e.target.result;
      const { value: passphrase } = await Swal.fire({
        title: 'Passphrase',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off',
        },
      });
      await state.setPrivateKey(armoredKey, passphrase);
      main();
    };
    reader.readAsBinaryString(file);
  } else {
    await initPrivateKey();
  }
};

window.onkeydown = e => {
  if (e.key === 'd' && e.ctrlKey) {
    initPrivateKey();
  }
};
