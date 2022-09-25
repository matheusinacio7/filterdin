export function removeNode(node: Node) {
  node?.parentElement?.removeChild(node);
}

export function removeNodeIfMatches(condition: (n: Node) => boolean) {
  return (node: Node) => {
    console.log(condition(node));
    if (condition(node)) {
      console.log('REMOVING NODE', node);
      removeNode(node);
    }
  }
}
