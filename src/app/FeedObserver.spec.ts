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

afterEach(() => {
  document.body.innerHTML = '';
});

describe('observe', () => {
  it('immediately detects words that matches the conditional', () => {
    const { feedItem } = addFeedUpdate(testWord);

    feedObserver.observe();

    expect(functionToApply).toHaveBeenCalledWith(feedItem);
  });

  it('does not call the function immediately if no node matches the conditional', () => {
    addFeedUpdate('another word');
    addFeedUpdate('some other word');

    feedObserver.observe();

    expect(functionToApply).not.toHaveBeenCalled();
  });

  it('calls the function if an update item is added later that matches the conditional', async () => {
    addFeedUpdate('some word');
    feedObserver.observe();

    const { feedItem } = addFeedUpdate(testWord);
    await flushMicrotasks();

    expect(functionToApply).toHaveBeenCalledTimes(1);
    expect(functionToApply).toHaveBeenCalledWith(feedItem);
  });

  it('calls the function once for every feed item added', async () => {
    feedObserver.observe();

    const { feedItem: fi1 } = addFeedUpdate(testWord);
    const { feedItem: fi2 } = addFeedUpdate(`blabla blabla ${testWord}`);
    await flushMicrotasks();

    expect(functionToApply).toHaveBeenCalledTimes(2);
    expect(functionToApply).toHaveBeenCalledWith(fi1);
    expect(functionToApply).toHaveBeenCalledWith(fi2);
  });

  it('calls the function if a feed item is added without a matching text first, then has the text added', async () => {
    feedObserver.observe();
    const emptyContainer = document.createElement('div');
    const feedItem = addFeedItem(emptyContainer)
    await flushMicrotasks();

    feedItem.appendChild(createFeedUpate(testWord));
    await flushMicrotasks();

    expect(functionToApply).toHaveBeenCalledTimes(1);
    expect(functionToApply).toHaveBeenCalledWith(feedItem);
  });

  it('calls the function if the dom initializes without the feed container, and it is added later', async () => {
    // Arrange
    document.body.innerHTML = '';
    feedObserver.observe();
    
    // Act
    feedContainer = document.createElement('div');
    feedContainer.classList.add(FEED_CLASS);

    const feedItem = document.createElement('div');
    feedContainer.appendChild(feedItem);

    const feedUpdate = createFeedUpate(testWord);
    feedItem.appendChild(feedUpdate);

    document.body.appendChild(feedContainer);

    await flushMicrotasks();

    // Assert
    expect(functionToApply).toBeCalledTimes(1);
    expect(functionToApply).toHaveBeenCalledWith(feedItem);
  });
});

function flushMicrotasks() {
  return new Promise(process.nextTick);
}

function addFeedItem(node: Node) {
  const newFeedItem = document.createElement('div');
  newFeedItem.appendChild(node);
  feedContainer.appendChild(newFeedItem);
  return newFeedItem;
}

function addFeedUpdate(text: string) {
  const feedUpdate = createFeedUpate(text);

  const feedItem = addFeedItem(feedUpdate);
  return { feedItem, feedUpdate };
}

function createFeedUpate(text: string) {
  const feedUpdate = document.createElement('span');
  feedUpdate.classList.add(FEED_ITEM_TEXT_CONTAINER_CLASS);

  const textNode = document.createTextNode(text);
  feedUpdate.appendChild(textNode);

  return feedUpdate;
}