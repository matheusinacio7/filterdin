export function removeNodeIfMatches(condition: (n: Node) => boolean) {
  return (node: Node) => {
    if (condition(node)) {
      node.parentElement?.removeChild(node);
    }
  }
}
