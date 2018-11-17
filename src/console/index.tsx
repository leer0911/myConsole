import React, { Component } from 'react';
import Log from './log';
import System from './system';
import Network from './network';
import Storage from './storage';
import { Modal, Button, Tabs } from 'antd-mobile';
import { Element } from './element';
import { logStore } from './store';
import { LogType } from './store/log';
import { observer } from 'mobx-react';

const tabs = [
  { title: 'Log' },
  { title: 'System' },
  { title: 'Network' },
  { title: 'Element' },
  { title: 'Storage' }
];

interface State {
  logs: LogType[];
  paneShow: boolean;
}

@observer
export class MyConsole extends Component<any, State> {
  console: any = {};
  constructor(props: any) {
    super(props);
    this.state = {
      logs: [],
      paneShow: false
    };
  }
  componentDidMount() {
    this.mockConsole();
  }
  togglePane = () => {
    this.setState({
      paneShow: !this.state.paneShow
    });
  }
  processLog(item: LogType) {
    const { logType } = item;
    let { infos = [] } = item;
    if (!infos.length) {
      return;
    }

    // copy logs as a new array
    infos = [].slice.call(infos || []);

    logStore.addLog({ logType, infos });

    this.printOriginLog(item);
  }
  clearLog() {
    logStore.clearLog()
  }
  printOriginLog(item: LogType) {
    // 在原生 console 输出信息
    const { logType, infos } = item
    if (typeof this.console[logType] === 'function') {
      this.console[logType].apply(window.console, infos);
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
          infos: args
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
          onClick={this.togglePane}
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
          onClose={this.togglePane}
          animationType="slide-up"
        >
          <div style={{ height: '80vh' }}>
            <Tabs tabs={tabs} animated={false} tabBarBackgroundColor="#efefef">
              <Log
                logList={logStore.computeLogList}
              // togglePane={this.togglePane('paneShow')}
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
