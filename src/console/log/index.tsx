import * as React from 'react';
import { Flex, ActionSheet, List, SearchBar } from 'antd-mobile';
import { DataView } from '../../components/logView/';
import { logStore } from '../store';
import { observer } from 'mobx-react';

const FlexItem = Flex.Item;
const ListItem = List.Item;

@observer
export class Log extends React.Component<any, any> {
  console: any = {};
  componentDidMount() {
    console.log(this);
  }
  showFilter() {
    const BUTTONS = ['All', 'Log', 'Info', 'Warn', 'Error'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS
    });
  }
  renderLogList() {
    const { logList } = this.props;
    return logList.map((log: any, index: number) => {
      const dataView = log.infos.map((info: any, i: number) => {
        return typeof info !== 'object' || info === null ? (
          <div key={i}>{`${info}`}</div>
        ) : (
          <DataView data={info} key={i} />
        );
      });
      let ret = null;
      switch (log.logType) {
        case 'warn':
          ret = (
            <ListItem
              key={index}
              wrap
              align="top"
              style={{
                background: '#fffacd',
                color: 'orange',
                border: '1px solid #ffb930'
              }}
            >
              {dataView}
            </ListItem>
          );
          break;
        case 'log':
          ret = (
            <ListItem wrap key={index} align="top">
              {dataView}
            </ListItem>
          );
          break;
        case 'error':
          ret = (
            <ListItem
              key={index}
              wrap
              align="top"
              style={{
                background: '#ffe4e1',
                border: '1px solid #f4a0ab'
              }}
            >
              <div style={{ color: '#dc143c' }}>{dataView}</div>
            </ListItem>
          );
          break;
      }

      return ret;
    });
  }
  clearLogs() {
    return () => {
      if (logStore.logList.length > 0) {
        logStore.clearLog();
      }
    };
  }
  hidePane() {
    return () => {
      // cl
    };
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem style={{ overflow: 'auto' }}>{this.renderLogList()}</FlexItem>
        <SearchBar
          placeholder="输入要查询的变量"
          showCancelButton
          cancelText="OK"
        />
        <Flex
          align="stretch"
          style={{
            height: '50px',
            background: '#efefef',
            borderTop: '1px solid #ddd'
          }}
        >
          <Flex
            align="center"
            style={{ flex: 1, borderRight: '1px solid #ddd' }}
            justify="center"
            onClick={this.clearLogs()}
          >
            Clear
          </Flex>
          <Flex
            align="center"
            style={{ flex: 1, borderRight: '1px solid #ddd' }}
            justify="center"
            onClick={this.showFilter}
          >
            Filter
          </Flex>
          <Flex
            onClick={this.props.togglePane}
            align="center"
            style={{ flex: 1 }}
            justify="center"
          >
            Hide
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
