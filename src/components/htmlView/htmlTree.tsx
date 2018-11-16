import * as React from 'react';
import { parseDOM } from 'htmlparser2';
import { renderToString } from 'react-dom/server';
import { Container } from './container';
import './themes/index.styl';
import './themes/chrome-devtools.styl';

interface Props {
  source: any;
  defaultExpandedTags?: string[];
  theme?: string;
}

const isBrowser = typeof HTMLElement !== 'undefined';

export class HTMLTree extends React.Component<Props> {
  render() {
    const { source } = this.props;
    const origin = isBrowser && source instanceof HTMLElement && source;
    const tree = parseDOM(
      origin
        ? source.outerHTML
        : React.isValidElement(source)
        ? renderToString(source)
        : source.replace(/<!DOCTYPE(.|\n|\r)*?>/i, '')
    );

    return (
      <div className="HTMLTree">
        <Container
          tree={tree}
          origin={origin || null}
          defaultExpandedTags={this.props.defaultExpandedTags}
        />
      </div>
    );
  }
}
