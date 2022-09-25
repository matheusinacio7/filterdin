export function removeNode(node: Node) {
  node?.parentElement?.removeChild(node);
}

export function removeNodeIfMatches(condition: (n: Node) => boolean) {
  return (node: Node) => {
    if (condition(node)) {
      removeNode(node);
    }
  }
}
