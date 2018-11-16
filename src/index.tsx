import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { MyConsole } from './console';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MyConsole />, document.getElementById('root'));

registerServiceWorker();
