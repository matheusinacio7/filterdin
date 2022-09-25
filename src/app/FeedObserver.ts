const FEED_CLASS = 'scaffold-finite-scroll__content';
const FEED_ITEM_TEXT_CONTAINER_CLASS = 'update-components-text';

export class FeedObserver {
  static garbageCollectorInterval: ReturnType<typeof setInterval> | null = null;
  static readonly observerMap: Map<string, MutationObserver> = new Map();
  private readonly mutationObserver;

  constructor(
    private readonly callback: (node: Node) => void,
    private readonly conditional: (node: Node) => boolean,
  ) {
    this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
  }

  observe(): void {
    this.setupGarbageCollector;
    let feedNode = document.querySelector(`.${FEED_CLASS}`);
    if (feedNode) {
      console.log("Encontrado node de feed");
      feedNode.childNodes.forEach(this.handleFeedItemNode.bind(this));
      this.mutationObserver.observe(feedNode, { childList: true });
      return;
    }
    
    const tempObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          if ((n as Element).classList.contains(FEED_CLASS)) {
            console.log("Encontrado node de feed");
            feedNode = n as Element;
            feedNode.childNodes.forEach(this.handleFeedItemNode.bind(this));
            this.mutationObserver.observe(feedNode, { childList: true })
            tempObserver.disconnect();
          }
        });
      });
    });

    tempObserver.observe(document.body, { childList: true, subtree: true });
  }

  cleanup() {
    this.mutationObserver.disconnect();
    FeedObserver.observerMap.forEach((observer, key) => {
      observer.disconnect();
      FeedObserver.observerMap.delete(key)
    })
  }

  private handleMutations(mutations: MutationRecord[]): void {
    mutations.forEach((m) => {
      m.addedNodes.forEach(this.handleFeedItemNode.bind(this));
    });
  }

  private handleFeedItemNode(feedItem: Node) {
    if (feedItem.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const textContainer = (feedItem as HTMLElement).querySelector(`.${FEED_ITEM_TEXT_CONTAINER_CLASS}`);

    if (textContainer && this.conditional(textContainer)) {
      this.callback(feedItem);
      return;
    }

    this.handleFeedItemChildrenMutations(feedItem as HTMLElement);
  }

  private handleFeedItemChildrenMutations(feedItem: HTMLElement) {
    const observerId = self.crypto.randomUUID();
    const tmpObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((childNode) => {
          const isTextContainer = (childNode as HTMLElement).classList?.contains(FEED_ITEM_TEXT_CONTAINER_CLASS);

          if (isTextContainer && this.conditional(childNode)) {
            this.callback(feedItem);
            tmpObserver.disconnect();
            FeedObserver.observerMap.delete(observerId);
          }
        });
      });
    });

    FeedObserver.observerMap.set(observerId, tmpObserver);
    tmpObserver.observe(feedItem, { childList: true, subtree: true });
  }

  private setupGarbageCollector(): void {
    if (FeedObserver.garbageCollectorInterval) {
      return;
    }
    FeedObserver.garbageCollectorInterval = setInterval(() => {
        FeedObserver.observerMap.forEach((observer, key) => {
          observer.disconnect();
          FeedObserver.observerMap.delete(key);
        });
    }, 10000);
  }
}
