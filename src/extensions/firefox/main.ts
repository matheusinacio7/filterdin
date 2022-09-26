import { FeedObserverWordMatcher } from "../../app/FeedObserverWordMatcher";
import { Popup } from "../../app/popup";
import { applyRedBorder, removeRedBorder } from "../../app/redBorder";

const feedObserver = new FeedObserverWordMatcher(applyRedBorder, removeRedBorder);

browser.storage.local.get(['filters'])
  .then(({ filters }) => {
    if (filters) {
      feedObserver.regenerateFeedObserver(filters.split(','));
    }
  });

browser.runtime.onMessage.addListener((message: any) => {
  if (message.type === Popup.PopupEvent.FilterAdded || message.type === Popup.PopupEvent.FilterDeleted) {
    browser.storage.local.set({ filters: message.filters.join(',') });
    feedObserver.regenerateFeedObserver(message.filters);
  }
});
