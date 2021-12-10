export const removeWhitespace = s => s.replace(/\s/g, '');

/* export const currentChannel = () =>
  window.location.href.split('/').slice(-2).join('/'); */

export const discryptMessage = text =>
  `<span style="font-weight:bold;color:red;">Discrypt: </span>${text}`;
