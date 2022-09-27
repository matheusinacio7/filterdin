export function hideElement(node: Node) {
  const originalDisplay = window.getComputedStyle(node as HTMLElement).display;
  (node as HTMLElement).dataset['originalDisplay3'] = originalDisplay;
  (node as HTMLElement).style.display = 'none';
}

export function unhideElement(node: Node) {
  const originalDisplay = (node as HTMLElement).dataset['originalDisplay'] || 'block';
  (node as HTMLElement).style.display = originalDisplay;
}
