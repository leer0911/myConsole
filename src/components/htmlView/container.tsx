import React, { PureComponent } from 'react';
import Node from './node';
import Immutable from 'immutable';
import { getDepth, getSelector } from './tool';

interface Props {
  tree: object[];
  defaultExpandedTags: string[];
}

interface State {
  root: any;
}

export default class Container extends PureComponent<Props, State> {
  timeout: any = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      root: this.getRoot()
    };
  }
  render() {
    const { root } = this.state;
    return (
      <div className="Container">
        <div className="Container__Nodes">
          <Node node={root} update={this.onUpdate()} />
        </div>
      </div>
    );
  }
  getRoot() {
    const { tree, defaultExpandedTags } = this.props;

    transformNodes(tree, [], true);
    return Immutable.fromJS(tree[0]);

    // recursive enumeration
    function transformNodes(trees: any[], keyPath: any, initial?: boolean) {
      trees.forEach((node: any, i: number) => {
        node.depth = getDepth(node);
        node.selector = getSelector(node.name ? node : node.parent);
        node.keyPath = initial ? keyPath : [...keyPath, 'children', i];
        node.state =
          defaultExpandedTags.indexOf(node.name) > -1 ? { expanded: true } : {};
        if (node.children) {
          if (node.children.length) {
            node.children = node.children.filter(
              (child: any) => child.type !== 'text' || child.data.trim().length
            );
            transformNodes(node.children, node.keyPath);
          } else {
            delete node.children;
          }
        }
        if (node.attribs && !Object.keys(node.attribs).length) {
          delete node.attribs;
        }
        delete node.parent;
        delete node.next;
        delete node.prev;
      });
    }
  }
  onUpdate() {
    return (e: any, component: any, type: any, data: any) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      const { node } = component.props;
      const { root } = this.state;
      let keyPath = [...node.get('keyPath').toJS(), 'state'];
      let updater = null;
      switch (type) {
        case 'toggleExpand':
          keyPath = [...keyPath, 'expanded'];
          updater = (expanded: boolean) => !expanded;
          break;
      }
      this.setState({
        root: root.updateIn(keyPath, updater)
      });
    };
  }
}
