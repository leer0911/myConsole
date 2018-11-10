import * as React from "react";
import * as ReactDOM from "react-dom";
import 'antd-mobile/dist/antd-mobile.css';
import { TsExample } from "./components/TsExample";
import registerServiceWorker from './registerServiceWorker';

export class Index extends React.Component<any, any> {
  render() {
    return (<div>
      <TsExample compiler="TypeScript" />
    </div>);
  }
}

ReactDOM.render(<Index />, document.getElementById("root"));

registerServiceWorker();
