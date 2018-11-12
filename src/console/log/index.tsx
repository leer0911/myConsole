import * as React from "react";
import { Flex, ActionSheet, List, SearchBar } from 'antd-mobile';
import { DataView } from '../../components/DataView/DataView'

const FlexItem = Flex.Item
const ListItem = List.Item

export class Log extends React.Component<any, any>{
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
          <List>
            <ListItem>
              <DataView data={this} />
            </ListItem>
          </List>
        </FlexItem>
        <SearchBar placeholder="输入要查询的变量" showCancelButton cancelText="OK"/>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef', borderTop: '1px solid #ddd' }}>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Clear</Flex>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center" onClick={this.showFilter}>Filter</Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
