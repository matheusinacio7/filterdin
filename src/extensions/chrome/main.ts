import { FeedObserver } from "../../app/FeedObserver";
import { matchesText } from "../../app/matchesText";
import { Popup } from "../../app/popup";

const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log(node);
}

let feedObserver: FeedObserver;

chrome.storage.sync.get(['filters'], ({ filters }) => {
  if (filters) {
    regenerateFeedObserver(filters.split(','));
  }
});

chrome.runtime.onMessage.addListener((message: any) => {
  console.log(message);
  if (message.type === Popup.PopupEvent.FilterAdded || message.type === Popup.PopupEvent.FilterDeleted) {
    chrome.storage.sync.set({ filters: message.filters.join(',') });
    regenerateFeedObserver(message.filters);
  }
});

function regenerateFeedObserver(filters: Array<string>) {
  const matcher = new RegExp(filters.join('|'), 'i');
  const matchesAnyFilter = matchesText(matcher);
  if (feedObserver) {
    feedObserver.cleanup();
  }
  feedObserver = new FeedObserver(applyRedBorder, matchesAnyFilter);
  feedObserver.observe();
}
