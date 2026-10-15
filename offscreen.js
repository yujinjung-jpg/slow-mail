chrome.runtime.onMessage.addListener(m => {
  if (m?.type === 'chime') playChime();
});
