import { FeedObserver, FEED_CLASS, FEED_ITEM_TEXT_CONTAINER_CLASS } from './FeedObserver';
import crypto from 'node:crypto';

let conditional: (node: Node) => boolean;
let testWord: string;
let functionToApply: jest.Func;
let feedObserver: FeedObserver;
let feedContainer: HTMLDivElement;

beforeEach(() => {
  testWord = 'just jesting';
  conditional = (node) => node.textContent ? node.textContent.includes(testWord) : false;
  functionToApply = jest.fn();
  self.crypto.randomUUID = crypto.randomUUID;

  feedObserver = new FeedObserver(functionToApply, conditional);

  feedContainer = document.createElement('div');
  feedContainer.classList.add(FEED_CLASS);
  document.body.appendChild(feedContainer);
});

describe('observe', () => {
  it('immediately detects words that matches the conditional', () => {
    const { feedItem } = addFeedUpdate(testWord);

    feedObserver.observe();

    expect(functionToApply).toHaveBeenCalledWith(feedItem);
  });
});


function addFeedItem(node: Node) {
  const newFeedItem = document.createElement('div');
  newFeedItem.appendChild(node);
  feedContainer.appendChild(newFeedItem);
  return newFeedItem;
}

function addFeedUpdate(text: string) {
  const feedUpdate = document.createElement('span');
  feedUpdate.classList.add(FEED_ITEM_TEXT_CONTAINER_CLASS);

  const textNode = document.createTextNode(text);
  feedUpdate.appendChild(textNode);

  const feedItem = addFeedItem(feedUpdate);
  return { feedItem, feedUpdate };
}
