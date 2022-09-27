import { Popup } from "../../app/popup";

const popup = new Popup();

popup.addEventListener(Popup.PopupEvent.FilterAdded, (addedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterAdded, filters, addedFilter };
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, message);
  });
});

popup.addEventListener(Popup.PopupEvent.FilterDeleted, (deletedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterDeleted, filters, deletedFilter };
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, message);
  });
});

chrome.storage.sync.get(['filters'], function({ filters }) {
  if (!filters) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, { filters });
  });

  const filtersArray = (filters as string).split(',');
  popup.loadFilters(filtersArray);
});

document.querySelectorAll('*[i18n]')
  .forEach((element) => {
    element.childNodes[0].nodeValue = chrome.i18n.getMessage(element.getAttribute('i18n') as string);
  });
