import React, { PureComponent } from "react";
import { Flex, Toast } from 'antd-mobile';
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'key', key: 'key'
}, {
  title: 'Value', dataIndex: 'value', key: 'value'
}];

interface StorageVal {
  key: string;
  value: string;
  children?: StorageVal[]
}

interface State {
  data: StorageVal[]
}

const FlexItem = Flex.Item

export default class Storage extends PureComponent<any, State>{
  constructor(props: any) {
    super(props);
    this.state = {
      data: [{
        key: 'cookie', value: ''
      },
      {
        key: 'localStorage', value: ''
      }]
    }
  }
  componentDidMount() {
    this.setData()
  }
  getCookieList() {
    if (!document.cookie || !navigator.cookieEnabled) {
      return [];
    }

    const list: StorageVal[] = [];
    const items = document.cookie.split(';');

    items.forEach((item: string) => {
      const ret: any[] = item.split('=')
      if (ret) {
        const key = ret.shift().replace(/^ /, '');
        const value = ret.join('=');
        list.push({
          key: decodeURIComponent(key),
          value: decodeURIComponent(value)
        })
      }
    })

    return list;
  }

  getLocalStorageList() {
    if (!window.localStorage) {
      return [];
    }

    try {
      const list: StorageVal[] = []
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage[key];
          list.push({
            key,
            value
          });
        }
      }
      return list;
    } catch (e) {
      return [];
    }
  }
  setData() {
    this.setState({
      data: [
        {
          key: 'cookie', value: '', children: this.getCookieList()
        },
        {
          key: 'localStorage', value: '', children: this.getLocalStorageList()
        },
      ]
    })
  }
  clearCookieList() {
    if (!document.cookie || !navigator.cookieEnabled) {
      return;
    }

    const list = this.getCookieList();
    for (const iterator of list) {
      document.cookie = iterator.key + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
  clearLocalStorageList() {
    if (!!window.localStorage) {
      try {
        localStorage.clear();
      } catch (e) {
        alert('localStorage.clear() fail.');
      }
    }
  }
  refresh = () => {
    this.setData()
    Toast.info('刷新完成！', 1);
  }
  clear = () => {
    this.clearCookieList()
    this.clearLocalStorageList()
    this.setData()
    Toast.info('清除完成！', 1);
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table expandRowByClick expandIconAsCell useFixedHeader columns={columns} data={this.state.data} />
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex onClick={this.refresh} align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Refresh</Flex>
          <Flex onClick={this.clear} align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Clear</Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
