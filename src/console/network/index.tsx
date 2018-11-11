import * as React from "react";
import { Flex } from 'antd-mobile';
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'name', key: 'name', width: 100,
}, {
  title: 'Method', dataIndex: 'method', key: 'method', width: 100,
},
{
  title: 'Status', dataIndex: 'status', key: 'status', width: 100,
},
{
  title: 'Time', dataIndex: 'time', key: 'time', width: 100,
}];

const data = [
  { name: 'http://api.com', method: 'Get', status: 'status', time: 200 },
];

const FlexItem = Flex.Item

export class Network extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table columns={columns} data={data} />
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Clear</Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
