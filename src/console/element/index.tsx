import React, { PureComponent } from 'react';
import { Flex } from 'antd-mobile';
import HTMLTree from '../../components/htmlView/htmlTree';

const FlexItem = Flex.Item;

interface Props {
  togglePane: () => void;
}

export default class Element extends PureComponent<Props, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem style={{ overflow: 'hidden' }}>
          <div style={{ padding: '10px', overflow: 'auto', height: '100%' }}>
            {document && document.documentElement ? <HTMLTree
              source={document.documentElement}
              defaultExpandedTags={['html', 'body']}
            /> : null}
          </div>
        </FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1 }} justify="center" onClick={this.props.togglePane}>
            Hide
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
