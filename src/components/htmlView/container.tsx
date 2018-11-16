import * as React from 'react';
import Immutable from 'immutable';
import { getDepth, getSelector } from './tool';
import { Node } from './node';

interface Props {
  tree: any[];
  origin: any;
  defaultExpandedTags?: any[];
}

interface State {
  root: any;
}

export class Container extends React.Component<Props, State> {
  timeout: any = null;

  constructor(props: Props) {
    super(props);
    const { tree, defaultExpandedTags } = this.props;
    this.state = {
      root: this.getRoot(tree, defaultExpandedTags)
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
  getRoot(tree: any, defaultExpandedTags: any) {
    transformNodes(tree, [], true);
    return Immutable.fromJS(tree[0]);

    // recursive enumeration
    function transformNodes(trees: any, keyPath: any, initial?: any) {
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
