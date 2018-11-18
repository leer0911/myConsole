import React, { createRef, Component } from 'react';
import { Flex, ActionSheet, List, SearchBar, Toast } from 'antd-mobile';
import { DataView } from '../../components/logView/';
import { logStore } from '../store';
import { LogType } from '../store/log';
import { observer } from 'mobx-react';

const FlexItem = Flex.Item;
const ListItem = List.Item;

interface Props {
  togglePane: () => void;
  logList: LogType[]
}

interface State {
  searchVal: string
}

@observer
export default class Log extends Component<Props, State> {
  private searchBarRef = createRef<SearchBar>()
  constructor(props: any) {
    super(props);
    this.state = {
      searchVal: ''
    };
  }
  componentDidMount() {
    console.log(this);
  }
  showFilter() {
    const BUTTONS = ['All', 'Log', 'Info', 'Warn', 'Error'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS
    }, (i) => {
      if (!BUTTONS[i]) {
        return
      }
      logStore.changeLogType(BUTTONS[i])
    });
  }
  renderLogList() {
    const { logList } = this.props;
    return logList.map((log: LogType, index: number) => {
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
        Toast.info('清除完成！', 1);
        logStore.clearLog();
      }
    };
  }
  sendCMD() {
    return (cmd: string) => {
      let result = void 0;
      try {
        result = eval.call(window, '(' + cmd + ')');
      } catch (e) {
        try {
          result = eval.call(window, cmd);
        } catch (e) {
          ;
        }
      }
      logStore.addLog({ logType: 'log', infos: [result] })
      this.setState({
        searchVal: ''
      })
      this.searchBarRef.current!.focus()
    }
  }
  onChange = (searchVal: string) => {
    this.setState({ searchVal });
  };
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem style={{ overflow: 'auto' }}>{this.renderLogList()}</FlexItem>
        <SearchBar
          value={this.state.searchVal}
          placeholder="输入要查询的变量"
          showCancelButton
          cancelText="OK"
          ref={this.searchBarRef}
          onCancel={this.sendCMD()}
          onSubmit={this.sendCMD()}
          onChange={this.onChange}
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
            {logStore.logType}
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
