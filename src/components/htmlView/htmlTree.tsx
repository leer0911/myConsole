import * as React from "react";
import { Parser } from 'htmlparser2'
import { renderToString } from 'react-dom/server'
import { Container } from './container'
import getStyles from './themes/'

interface Props {
  source: any
  defaultExpandedTags: string[]
  theme: string
}

const isBrowser = typeof HTMLElement !== 'undefined'


export class HTMLTree extends React.Component<Props>{

  render() {
    const { source, ...defaultsAndEventHandlers } = this.props
    const origin = isBrowser && source instanceof HTMLElement && source
    const tree = new Parser(/** sourceText **/
      origin ? source.outerHTML :
        (React.isValidElement(source) ? renderToString(source) : source.replace(/<!DOCTYPE(.|\n|\r)*?>/i, ''))
    )

    const componentStyles = getStyles(this.props.theme)

    return (
      <div className="HTMLTree">
        <style dangerouslySetInnerHTML={{ __html: componentStyles }} />
        <Container tree={tree} origin={origin || null} {...defaultsAndEventHandlers} />
      </div>
    )
  }
}
