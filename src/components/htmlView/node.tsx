import * as React from "react";

export class Node extends React.Component<any, any>{
  getRenderable() {
    return <div />
  }
  render() {
    const { customRender } = this.props
    const Renderable: React.ReactNode = this.getRenderable()
    return (!customRender) ? Renderable : customRender((decorate: any) => {
      return decorate(Renderable)
    }, this.props.node.toJS())
  }
}
