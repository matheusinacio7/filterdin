export function removeNodeIfMatches(condition: (n: Node) => boolean) {
  return (node: Node) => {
    if (condition(node)) {
      console.log('REMOVING NODE', node);
      node.parentElement?.removeChild(node);
    }
  }
}
