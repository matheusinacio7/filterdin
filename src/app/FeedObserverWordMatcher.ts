import { FeedObserver } from "./FeedObserver";
import { matchesAnyWholeWord } from "./matchesAnyWholeWord";

export class FeedObserverWordMatcher {
  private observerInstance: FeedObserver | null | undefined;

  constructor(
    private readonly callback: ConstructorParameters<typeof FeedObserver>[0],
    private readonly reverseCallback?: ConstructorParameters<typeof FeedObserver>[2],
  ) {}

  public regenerateFeedObserver(words: Array<string>) {
    if (this.observerInstance) {
      this.observerInstance.cleanup();
    }

    if (words.length) {
      this.observerInstance = new FeedObserver(this.callback, matchesAnyWholeWord(words), this.reverseCallback);
      this.observerInstance.observe();
    } else {
      this.observerInstance = null;
    }
  }
};
