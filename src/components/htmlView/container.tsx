import * as React from "react";
import { getDepth, getSelector } from './tool'

import { Node } from './node';

interface Props {
  tree: any[];
  origin: any;
  defaultExpandedTags?: any[];
};

export class Container extends React.Component<Props>{

  timeout: any = null

  render() {
    const { tree, defaultExpandedTags } = this.props

    const rootData = this.getRoot(tree, defaultExpandedTags)

    return (
      <div className="Container">
        <div className="Container__Nodes">
          <Node node={rootData} />
        </div>
      </div>
    )
  }
  getRoot(tree: any, defaultExpandedTags: any) {
    transformNodes(tree, [], true)
    return tree[0]

    // recursive enumeration
    function transformNodes(trees: any, keyPath: any, initial?: any) {
      trees.forEach((node: any, i: number) => {
        node.depth = getDepth(node)
        node.selector = getSelector(node.name ? node : node.parent)
        node.keyPath = initial ? keyPath : [...keyPath, 'children', i]
        node.state = defaultExpandedTags.indexOf(node.name) > -1 ? { expanded: true } : {}
        if (node.children) {
          if (node.children.length) {
            node.children = node.children.filter((child: any) => child.type !== 'text' || child.data.trim().length)
            transformNodes(node.children, node.keyPath)
          } else {
            delete node.children
          }
        }
        if (node.attribs && !Object.keys(node.attribs).length) {
          delete node.attribs
        }
        delete node.parent
        delete node.next
        delete node.prev
      })
    }
  }

}
