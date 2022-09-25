import { matchesText } from "./matchesText";
import { removeNode } from "./removeNode";

export const FEED_CLASS = 'scaffold-finite-scroll__content';

const matcher = new RegExp('developer|program', 'i');
const matchesSomeCommonWords = matchesText(matcher);

const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log(node);
}

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

  private handleMutations(mutations: MutationRecord[]): void {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (matchesSomeCommonWords(node)) {
            applyRedBorder(node);
            return;
          }
          const observerId = self.crypto.randomUUID();
          const tmpObserver = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((m) => {
              m.addedNodes.forEach((n) => {
                if ((n as HTMLElement).classList?.contains('update-components-text') && matchesSomeCommonWords(n)) {
                  applyRedBorder(node);
                  tmpObserver.disconnect();
                  FeedObserver.observerMap.delete(observerId);
                }
              });
            });
          });
          FeedObserver.observerMap.set(observerId, tmpObserver);
          tmpObserver.observe(node, { childList: true, subtree: true });
        }
      });
    });
  }

  observe(): void {
    this.setupGarbageCollector;
    let tempObserver: MutationObserver;
    let feedNode = document.querySelector(`.${FEED_CLASS}`);
    if (feedNode) {
      this.mutationObserver.observe(feedNode, { childList: true });
      console.log("Encontrado node de feed");
      return;
    }
    
    tempObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          if ((n as Element).classList.contains(FEED_CLASS)) {
            console.log("Encontrado node de feed");
            feedNode = n as Element;
            this.mutationObserver.observe(feedNode, { childList: true })
            tempObserver.disconnect();
          }
        });
      });
    });

    tempObserver.observe(document.body, { childList: true, subtree: true });
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
