export function matchesText(matcher: RegExp | string) {
  const regexMatch = matcher instanceof RegExp ? matcher : new RegExp(matcher, 'i');
  return (node: Node) => {
    if (!node.textContent) {
      return false;
    }

    return regexMatch.test(node.textContent);
  };
}
