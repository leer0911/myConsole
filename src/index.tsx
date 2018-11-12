import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
// import { MyConsole } from './console';
import { DataView } from './components/DataView/DataView';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<DataView data={window} />, document.getElementById('root'));

registerServiceWorker();
