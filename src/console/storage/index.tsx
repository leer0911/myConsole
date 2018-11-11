import * as React from "react";
import { Flex, ActionSheet } from 'antd-mobile';
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'name', key: 'name', width: 100,
}, {
  title: 'Value', dataIndex: 'value', key: 'value', width: 100,
}];

const data = [
  { name: 'Jack', value: 28 },
  { name: 'Rose', value: 36 },
];

const FlexItem = Flex.Item

export class Storage extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
  }
  showFilter() {
    const BUTTONS = ['All', 'Log', 'Info', 'Warn', 'Error'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS
    })
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          <Table columns={columns} data={data} />
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
