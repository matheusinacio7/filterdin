import { FeedObserver } from "./FeedObserver";
import { matchesText } from "./matchesText";
import { removeNodeIfMatches } from "./removeNode";

(window as any).nodes = [];

const matcher = new RegExp('this|is|that|yes|no|programmer|program|dia|feliz|sim|não|rede|great|you|você|eu', 'i');
const matchesSomeCommonWords = matchesText(matcher);

const feedObserver = new FeedObserver('k' as any, 'k' as any);
feedObserver.observe();
