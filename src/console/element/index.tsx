import * as React from 'react';
import { Flex } from 'antd-mobile';
import { HTMLTree } from '../../components/htmlView/htmlTree';

const FlexItem = Flex.Item;

export class Element extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem style={{ overflow: 'hidden' }}>
          <div style={{ padding: '10px', overflow: 'auto', height: '100%' }}>
            <HTMLTree
              source={document.documentElement}
              defaultExpandedTags={['html', 'body']}
            />
          </div>
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1 }} justify="center">
            Hide
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
