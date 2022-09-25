document.getElementById('changeSomething')?.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, { message: 'hey, this is my message' });
  });
});
