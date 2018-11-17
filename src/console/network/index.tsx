import React, { Component } from 'react';
import { Flex } from 'antd-mobile';
import Table from 'rc-table';
import "./index.css";

const columns = [
  {
    title: 'Url',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  }
];

const FlexItem = Flex.Item;

interface ReqData {
  url: string;
  method: string;
  status: string;
  header: string;
  time: string;
  response: any;
  request: any;
}

interface State {
  reqList: { [propName: string]: ReqData; };
}

export default class Network extends Component<any, State> {
  open: any = null;
  send: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      reqList: {}
    };
  }
  componentDidMount() {
    this.mockAjax();
    this.sendXHR();
  }
  sendXHR() {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', 'http://localhost:3000/sockjs-node/info?t=1542431358944');
    XHR.send("requestData");
  }
  expandedRowRender = (record: ReqData) => {
    return (
      <div>
        <p>{`[ header ]`} <br /> {record.header}</p>
        <p>{`[ request ]`}<br /> {record.request}</p>
        <p>{`[ response ]`} <br />{record.response}</p>
      </div>
    )
  }
  getReqList() {
    return Object.keys(this.state.reqList).map(key => {
      return this.state.reqList[key]
    })
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table expandRowByClick expandIconAsCell useFixedHeader expandedRowRender={this.expandedRowRender} columns={columns} data={this.getReqList()} />
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
    const that = this;
    const XHRnativeOpen = XMLHttpRequest.prototype.open;
    const XHRnativeSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (...args: any) {
      const [method, url] = args;
      const id = `XHR${that.getUniqueID()}`;
      const userOnreadystatechange = this.onreadystatechange;
      this.XHRID = id;
      this.XHRDATA = {
        url,
        method
      };
      this.onreadystatechange = function (...stateArgs: any) {
        switch (this.readyState) {
          case 0:
            if (!this.startTime) {
              this.startTime = (+new Date());
            }
            break;
          case 1:
            if (!this.startTime) {
              this.startTime = (+new Date());
            }
            break;
          case 2:
            this.XHRDATA = {
              ...this.XHRDATA,
              header: this.getAllResponseHeaders()
            }
            that.updateRequest(this.XHRID, this.XHRDATA)
            break;
          case 4:
            if (!this.endTime) {
              this.endTime = (+new Date());
            }
            const { status, response } = this
            this.XHRDATA = {
              ...this.XHRDATA,
              response,
              status,
              time: `${this.endTime - this.startTime} ms`
            };
            that.updateRequest(this.XHRID, this.XHRDATA)
            break;
          default:
            break;
        }

        return (
          userOnreadystatechange &&
          userOnreadystatechange.apply(this, stateArgs)
        );
      };

      return XHRnativeOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function (...args: any) {
      this.XHRDATA = {
        ...this.XHRDATA,
        request: args[0]
      };
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
  updateRequest(id: string, reqData: ReqData) {
    this.setState({
      reqList: {
        ...this.state.reqList,
        [id]: {
          ...this.state.reqList[id],
          ...reqData
        }
      }
    })
  }
}
