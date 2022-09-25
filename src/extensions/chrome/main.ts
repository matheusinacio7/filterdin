import { FeedObserver } from "../../app/FeedObserver";
import { matchesText } from "../../app/matchesText";
import { Popup } from "../../app/popup";

const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log('applyredborder', node);
};

const removeRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '';
  console.log('removeredborder', node);
}

let feedObserver: FeedObserver | null | undefined;

chrome.storage.sync.get(['filters'], ({ filters }) => {
  if (filters) {
    regenerateFeedObserver(filters.split(','));
  }
});

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === Popup.PopupEvent.FilterAdded || message.type === Popup.PopupEvent.FilterDeleted) {
    chrome.storage.sync.set({ filters: message.filters.join(',') });
    regenerateFeedObserver(message.filters);
  }
});

function regenerateFeedObserver(filters: Array<string>) {
  const matcher = new RegExp(`\\b(${filters.join('|')})\\b`, 'i');
  const matchesAnyFilter = matchesText(matcher);
  if (feedObserver) {
    feedObserver.cleanup();
  }

  if (filters.length) {
    feedObserver = new FeedObserver(applyRedBorder, matchesAnyFilter, removeRedBorder);
    feedObserver.observe();
  } else {
    feedObserver = null;
  }
}
