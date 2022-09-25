import { matchesText } from './matchesText';

export function matchesAnyWholeWord(words: Array<string>) {
  const matcher = new RegExp(`\\b(${words.join('|')})\\b`, 'i');
  return matchesText(matcher);
}
