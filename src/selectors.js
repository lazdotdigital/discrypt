export const slateTextArea = () =>
  document.querySelector('[class*=slateTextArea-]');

export const messagesContainer = () =>
  document.querySelector('[class^=messagesWrapper-]');

export const messages = () =>
  messagesContainer().querySelectorAll('[id^=message-content-]');
