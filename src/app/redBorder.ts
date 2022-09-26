export const applyRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '5px solid red';
  console.log('applyredborder', node);
};

export const removeRedBorder = (node: Node) => {
  (node as HTMLElement).style.border = '';
  console.log('removeredborder', node);
}
