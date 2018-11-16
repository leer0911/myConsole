export function getSelector(node: any, selector = [node.name]): any {
  const parent = node.parent;
  if (parent) {
    const children = parent.children;
    const matches = children.filter((child: any) => child.name === node.name);
    if (matches.length > 1) {
      for (let i = 0, l = matches.length; i < l; i++) {
        if (matches[i] === node) {
          selector[0] = `${selector[0]}:nth-of-type(${i + 1})`;
          break;
        }
      }
    }
    selector.unshift(parent.name);
  }
  return parent && parent.parent
    ? getSelector(parent, selector)
    : selector.join(' > ');
}

export function getDepth(node: any) {
  let level = 1; // level: 0
  while (node.parent) {
    level += 1;
    node = node.parent;
  }
  return level;
}
