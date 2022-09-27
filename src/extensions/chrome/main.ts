import { hideElement, unhideElement } from "../../app/elementHiding";
import { FeedObserverWordMatcher } from "../../app/FeedObserverWordMatcher";
import { Popup } from "../../app/popup";

const feedObserver = new FeedObserverWordMatcher(hideElement, unhideElement);

window.addEventListener('focus', () => {
  syncStorage();
});

syncStorage();

function syncStorage() {
  chrome.storage.sync.get(['filters'], ({ filters }) => {
    if (filters) {
      feedObserver.regenerateFeedObserver(filters.split(','));
    }
  });
}

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === Popup.PopupEvent.FilterAdded || message.type === Popup.PopupEvent.FilterDeleted) {
    feedObserver.regenerateFeedObserver(message.filters);
  }
});
