import { FeedObserverWordMatcher } from "../../app/FeedObserverWordMatcher";
import { Popup } from "../../app/popup";
import { applyRedBorder, removeRedBorder } from "../../app/redBorder";

const feedObserver = new FeedObserverWordMatcher(applyRedBorder, removeRedBorder);

chrome.storage.sync.get(['filters'], ({ filters }) => {
  if (filters) {
    feedObserver.regenerateFeedObserver(filters.split(','));
  }
});

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === Popup.PopupEvent.FilterAdded || message.type === Popup.PopupEvent.FilterDeleted) {
    chrome.storage.sync.set({ filters: message.filters.join(',') });
    feedObserver.regenerateFeedObserver(message.filters);
  }
});
