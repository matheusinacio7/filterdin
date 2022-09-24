import { FeedObserver } from "./FeedObserver";
import { matchesText } from "./matchesText";
import { removeNodeIfMatches } from "./removeNode";

const matcher = new RegExp('this|is|that|yes|no|programmer|program|dia|feliz|sim|não|rede', 'i');
const matchesSomeCommonWords = matchesText(matcher);

const feedObserver = new FeedObserver(removeNodeIfMatches(matchesSomeCommonWords));
feedObserver.observe();
