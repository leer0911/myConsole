import * as React from 'react';
import { Modal, Button, Tabs } from 'antd-mobile';
import { Log } from './log';
import { Element } from './element';
import { Network } from './network';
import { Storage } from './storage';
import { System } from './system';
import { logStore } from './store';
import { observer } from 'mobx-react';

const tabs = [
  { title: 'Log' },
  { title: 'System' },
  { title: 'Network' },
  { title: 'Element' },
  { title: 'Storage' }
];

interface LogsInfotype {
  logType: string;
  infos: any[];
}
interface State {
  logs: LogsInfotype[];
  paneShow: boolean;
}

@observer
export class MyConsole extends React.Component<any, State> {
  console: any = {};
  state: State = {
    logs: [],
    paneShow: false
  };
  componentDidMount() {
    this.mockConsole();
  }
  togglePane = (key: any) => (e: any) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      ...this.state,
      [key]: !this.state[key]
    });
  };
  onClose = (key: any) => () => {
    this.setState({
      ...this.state,
      [key]: false
    });
  };
  processLog(item: any) {
    const { logType } = item;
    let { logs = [] } = item;
    if (!logs.length) {
      return;
    }

    // copy logs as a new array
    logs = [].slice.call(logs || []);

    logStore.addLog({ logType, infos: logs });

    this.printOriginLog(item);
  }
  clearLog() {
    // console.log('a');
  }
  printOriginLog(item: any) {
    // 在原生 console 输出信息
    if (typeof this.console[item.logType] === 'function') {
      this.console[item.logType].apply(window.console, item.logs);
    }
  }
  mockConsole() {
    if (!window.console) {
      return;
    }

    const methodList = ['log', 'info', 'warn', 'debug', 'error'];

    methodList.map(method => {
      this.console[method] = window.console[method];
    });

    methodList.map(method => {
      window.console[method] = (...args: any[]) => {
        this.processLog({
          logType: method,
          logs: args
        });
      };
    });

    window.console.clear = (...args: any[]) => {
      this.clearLog();
      this.console.clear.apply(window.console, args);
    };
  }
  render() {
    return (
      <div>
        <Button
          onClick={this.togglePane('paneShow')}
          type="primary"
          style={{
            width: '150px',
            position: 'fixed',
            bottom: '20px',
            right: '20px'
          }}
        >
          myConsole
        </Button>
        <Modal
          popup
          visible={this.state.paneShow}
          onClose={this.onClose('paneShow')}
          animationType="slide-up"
        >
          <div style={{ height: '80vh' }}>
            <Tabs tabs={tabs} animated={false} tabBarBackgroundColor="#efefef">
              <Log
                logList={logStore.logList}
                togglePane={this.togglePane('paneShow')}
              />
              <System />
              <Network />
              <Element />
              <Storage />
              <System />
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}
