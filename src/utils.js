export const observeTextContent = (() => {
  let callCount = 0;
  const prevStates = {};

  return (el, cb, ms) => {
    const num = callCount++;
    prevStates[num] = el.textContent;
    setInterval(() => {
      if (prevStates[num] !== el.textContent) {
        prevStates[num] = el.textContent;
        cb(el);
      }
    }, ms);
  };
})();

export const readFile = async () =>
  new Promise((resolve, _reject) => {
    const input = document.createElement('input');
    input.style = 'display:none;';
    input.type = 'file';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = re => {
        resolve(re.target.result);
      };
    };
    document.body.appendChild(input);
    input.click();
    input.remove();
  });

export const removeWhitespace = s => s.replace(/\s/g, '');

export const currentChannel = () =>
  window.location.href.split('/').slice(-2).join('/');

export const discryptMessage = text =>
  `<span style="font-weight:bold;color:red;">Discrypt: </span>${text}`;
