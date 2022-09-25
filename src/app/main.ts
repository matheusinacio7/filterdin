import { FeedObserver } from "./FeedObserver";
import { matchesText } from "./matchesText";
import { removeNodeIfMatches } from "./removeNode";

(window as any).nodes = [];
const matcher = new RegExp('developer|program', 'i');
const matchesSomeCommonWords = matchesText(matcher);

const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log(node);
}

const feedObserver = new FeedObserver(applyRedBorder, matchesSomeCommonWords);
feedObserver.observe();
