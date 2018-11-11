import * as React from "react";
import { Flex, ActionSheet, List } from 'antd-mobile';

const FlexItem = Flex.Item
const ListItem = List.Item

export class System extends React.Component<any, any>{
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
            <ListItem>SystemInfo</ListItem>
          </List>
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center">Clear</Flex>
          <Flex align="center" style={{ flex: 1, borderRight: '1px solid #ddd' }} justify="center" onClick={this.showFilter}>Filter</Flex>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
