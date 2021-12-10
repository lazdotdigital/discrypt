import * as openpgp from 'openpgp';

const cachedMessagesJson = localStorage.getItem('messages');

const state = {
  privateKey: null,
  recipientPublicKey: null,
  cachedMessages: cachedMessagesJson ? JSON.parse(cachedMessagesJson) : {},
};

export const cacheMessage = (encrypted, message) => {
  state.cachedMessages[encrypted] = message;
  localStorage.setItem('messages', JSON.stringify(state.cachedMessages));
};

export const cachedMessage = encrypted => state.cachedMessages[encrypted];

export const setRecipientPublicKey = async armoredKey => {
  state.recipientPublicKey = await openpgp.readKey({ armoredKey });
  return state.recipientPublicKey;
};

export const recipientPublicKey = () => state.recipientPublicKey;

export const setPrivateKey = async (armoredKey, passphrase) => {
  const privateKey = await openpgp.readPrivateKey({ armoredKey });
  if (passphrase) {
    state.privateKey = openpgp.decryptKey({ privateKey, passphrase });
  } else {
    state.privateKey = privateKey;
  }
};

export const privateKey = () => state.privateKey;

export const publicKey = async () =>
  state.privateKey ? await state.privateKey.toPublic() : null;
