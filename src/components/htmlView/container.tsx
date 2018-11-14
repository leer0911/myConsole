import * as React from "react";
import { Node } from './node';

export class Container extends React.Component<any, any>{
  onUpdate() {
    return
  }
  render() {
    const { onHover, customRender } = this.props
    const { root } = this.state
    return (
      <div className="Container">
        <div className="Container__Nodes">
          <Node node={root} update={this.onUpdate} onHover={onHover} customRender={customRender} />
        </div>
        <input className="Container__Input" type="text" ref="input" />
      </div>
    )
  }
}
