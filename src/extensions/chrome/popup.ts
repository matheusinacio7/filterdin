import { Popup } from "../../app/popup";

const popup = new Popup();

popup.addEventListener(Popup.PopupEvent.ChangeSomething, () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, { message: 'hey, this is my message' });
  });
});
