import React, { PureComponent } from 'react';
import Container from './container';
import { parseDOM } from 'htmlparser2';
import './themes/index.styl';
import './themes/chrome-devtools.styl';

interface Props {
  source: HTMLElement;
  defaultExpandedTags: string[];
}

export default class HTMLTree extends PureComponent<Props> {


  render() {
    const { source } = this.props;
    const tree = parseDOM(source.outerHTML);
    return (
      <div className="HTMLTree">
        <Container
          tree={tree}
          defaultExpandedTags={this.props.defaultExpandedTags}
        />
      </div>
    );
  }
}
