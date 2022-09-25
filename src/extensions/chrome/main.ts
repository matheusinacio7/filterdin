import { FeedObserver } from "../../app/FeedObserver";
import { matchesText } from "../../app/matchesText";

const matcher = new RegExp('developer|program', 'i');
const matchesSomeCommonWords = matchesText(matcher);

const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log(node);
}

const feedObserver = new FeedObserver(applyRedBorder, matchesSomeCommonWords);
feedObserver.observe();

chrome.runtime.onMessage.addListener((message) => {
  console.log(message, 'mensagme recebida');
});
