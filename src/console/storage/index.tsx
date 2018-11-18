import React, { PureComponent } from "react";
import { Flex } from 'antd-mobile';
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'key', key: 'key'
}, {
  title: 'Value', dataIndex: 'value', key: 'value'
}];

interface StorageVal {
  key: string;
  value: string;
}

const FlexItem = Flex.Item

export default class Storage extends PureComponent<any, any>{
  constructor(props: any) {
    super(props);
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

  render() {
    const data = [
      {
        key: 'cookie', value: '', children: this.getCookieList()
      },
      {
        key: 'localStorage', value: '', children: this.getLocalStorageList()
      },
    ];

    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table expandRowByClick expandIconAsCell useFixedHeader columns={columns} data={data} />
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Refresh</Flex>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Clear</Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
