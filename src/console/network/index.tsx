import * as React from 'react';
import { Flex } from 'antd-mobile';
import Table from 'rc-table';

const columns = [
  {
    title: 'Url',
    dataIndex: 'url',
    key: 'url',
    width: 200
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    width: 100
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: 100
  }
];

const FlexItem = Flex.Item;

interface ReqData {
  url: string;
  method: string;
  status: string;
  time: number;
}

interface State {
  reqList: ReqData[];
}

export class Network extends React.Component<any, State> {
  open: any = null;
  send: any = null;
  state = {
    reqList: []
  };
  componentDidMount() {
    this.mockAjax();
    this.sendXHR();
  }
  sendXHR() {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', 'http://www.example.org/example.txt');
    XHR.send();
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table columns={columns} data={this.state.reqList} />
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex
            align="center"
            style={{ flex: 1, borderRight: '1px solid #ddd' }}
            justify="center"
          >
            Clear
          </Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">
            Hide
          </Flex>
        </Flex>
      </Flex>
    );
  }
  mockAjax() {
    const XMLHttpRequest = (window as any).XMLHttpRequest;
    if (!XMLHttpRequest) {
      return;
    }
    // const that = this;
    const XHRnativeOpen = XMLHttpRequest.prototype.open;
    const XHRnativeSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(...args: any) {
      const [url, method] = args;
      // const id = `XHR${that.getUniqueID()}`;
      const userOnreadystatechange = this.onreadystatechange;

      this.XHRDATA = {
        url,
        method
      };

      this.onreadystatechange = function(...stateArgs: any) {
        if (this.readyState === 4) {
          console.log(this);
        }
        return (
          userOnreadystatechange &&
          userOnreadystatechange.apply(this, stateArgs)
        );
      };

      return XHRnativeOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function(...args: any) {
      return XHRnativeSend.apply(this, args);
    };
  }
  getUniqueID() {
    const length = 8;
    const timestamp = +new Date();
    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const ts = timestamp.toString();
    const parts = ts.split('').reverse();
    let id = '';

    for (let i = 0; i < length; ++i) {
      const index = getRandomInt(0, parts.length - 1);
      id += parts[index];
    }

    return id;
  }
  updateRequest(id: any, reqData: any) {
    // see whether add new item into list
    // const preCount = Object.keys(this.reqList).length;
    // console.log(preCount);

    // update item
    const item = this.state.reqList[id] || {};
    for (const key in reqData) {
      if (reqData.hasOwnProperty(key)) {
        const element = reqData[key];
        item[key] = element;
      }
    }
    // this.setState({
    //   reqList: {
    //     id: item
    //   }
    // });
  }
}

// function isPlainObject(obj: any) {
//   const hasOwn = Object.prototype.hasOwnProperty;
//   // Must be an Object.
//   if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
//     return false;
//   }
//   try {
//     if (
//       obj.constructor &&
//       !hasOwn.call(obj, 'constructor') &&
//       !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
//     ) {
//       return false;
//     }
//   } catch (e) {
//     return false;
//   }

//   return true;
// }

// function isString(value: any) {
//   return Object.prototype.toString.call(value) === '[object String]';
// }

// function isWindow(value: any) {
//   const toString = Object.prototype.toString.call(value);
//   return (
//     toString === '[object global]' ||
//     toString === '[object Window]' ||
//     toString === '[object DOMWindow]'
//   );
// }
