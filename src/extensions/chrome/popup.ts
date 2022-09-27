import { Popup } from "../../app/popup";

const popup = new Popup();

popup.addEventListener(Popup.PopupEvent.FilterAdded, (addedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterAdded, filters, addedFilter };
  sendMessage(message);
  syncFilters(filters);
});

popup.addEventListener(Popup.PopupEvent.FilterDeleted, (deletedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterDeleted, filters, deletedFilter };
  sendMessage(message);
  syncFilters(filters);
});

chrome.storage.sync.get(['filters'], function({ filters }) {
  if (!filters) {
    return;
  }

  const filtersArray = (filters as string).split(',');

  sendMessage({ filters: filtersArray });

  popup.loadFilters(filtersArray);
});

function sendMessage(message: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url?.includes('linkedin')) {
      chrome.tabs.sendMessage(tabs[0].id as number, message);
    }
  });
}

function syncFilters(filters: Array<string>) {
  chrome.storage.sync.set({ filters: filters.join(',') });
}

document.querySelectorAll('*[i18n]')
  .forEach((element) => {
    element.childNodes[0].nodeValue = chrome.i18n.getMessage(element.getAttribute('i18n') as string);
  });
