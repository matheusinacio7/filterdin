export const FEED_SELECTOR = '.scaffold-finite-scroll__content';
export class FeedObserver extends MutationObserver {
  private feedNode: Element | undefined | null;

  constructor(callback: (newNode: Node) => void) {
    super(function (mutations: MutationRecord[]) {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            callback(node);
          }
        });
      });
    });
    document.addEventListener('load', this.setFeedNode.bind(this));
  }

  private setFeedNode() {
    this.feedNode = document.querySelector(FEED_SELECTOR);
  }

  observe(): void {
    if (!this.feedNode) {
      throw new Error('Could not locate linkedin Feed');
    }

    super.observe(this.feedNode, { childList: true });
  }
}
