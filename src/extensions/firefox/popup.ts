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

browser.storage.sync.get(['filters'])
  .then(({ filters }) => {
    if (!filters) {
      throw new Error('filters not found');
    }
    const filtersArray = (filters as string).split(',');
    popup.loadFilters(filtersArray);

    sendMessage({ filters: filtersArray });
  });

function syncFilters(filters: Array<string>) {
  browser.storage.sync.set({ filters: filters.join(',') });
}

function sendMessage(message: any) {
  browser.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id as number, message);
    });
}

document.querySelectorAll('*[i18n]')
  .forEach((element) => {
    element.childNodes[0].nodeValue = browser.i18n.getMessage(element.getAttribute('i18n') as string);
  });
