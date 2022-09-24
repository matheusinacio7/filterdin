export function removeNode(node: Element, condition: (n: Node) => boolean) {
  if (condition(node)) {
    node.parentElement?.removeChild(node);
  }
}
