import { Popup } from "../../app/popup";

const popup = new Popup();

popup.addEventListener(Popup.PopupEvent.FilterAdded, (addedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterAdded, filters, addedFilter };
  browser.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id as number, message);
    });
});

popup.addEventListener(Popup.PopupEvent.FilterDeleted, (deletedFilter, filters) => {
  const message = { type: Popup.PopupEvent.FilterDeleted, filters, deletedFilter };
  browser.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id as number, message);
    });
});

browser.storage.local.get(['filters'])
  .then(({ filters }) => {
    if (!filters) {
      throw new Error('filters not found');
    }
    const filtersArray = (filters as string).split(',');
    popup.loadFilters(filtersArray);
  
    return Promise.all([
      browser.tabs.query({ active: true, currentWindow: true }),
      Promise.resolve(filters),
    ]);
  })
  .then(([tabs, filters]: [browser.tabs.Tab[], Array<string>]) => {
    if (!tabs) {
      return;
    }
    browser.tabs.sendMessage(tabs[0].id as number, { filters });
  })
  .catch(() => {
    // handle error
  });
