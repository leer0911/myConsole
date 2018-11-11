import * as React from "react";
import { Flex } from 'antd-mobile';

const FlexItem = Flex.Item

export class Element extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>
          html
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1 }} justify="center">Hide</Flex>
        </Flex>
      </Flex>
    );
  }
}
