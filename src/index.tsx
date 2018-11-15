import * as React from "react";
import * as ReactDOM from "react-dom";
import 'antd-mobile/dist/antd-mobile.css';
import { HTMLTree } from "./components/htmlView/htmlTree";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HTMLTree source={document.documentElement} defaultExpandedTags={['html', 'body']} />, document.getElementById("root"));

registerServiceWorker();
