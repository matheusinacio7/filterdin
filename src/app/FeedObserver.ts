export const FEED_SELECTOR = '.scaffold-finite-scroll__content';
export class FeedObserver extends MutationObserver {
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
  }

  observe(): void {
    let tempObserver: MutationObserver;
    
    tempObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          if ((n as Element).classList.contains(FEED_SELECTOR)) {
            super.observe(n, { childList: true, attributes: true });
            tempObserver.disconnect();
          }
        });
      });
    });

    tempObserver.observe(document.body, { childList: true, attributes: true, subtree: true });
  }
}
