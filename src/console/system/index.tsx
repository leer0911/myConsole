import React, { PureComponent } from 'react';
import { Flex, List } from 'antd-mobile';

const FlexItem = Flex.Item;
const ListItem = List.Item;


export default class System extends PureComponent<any, any> {
  render() {
    const Ua = navigator.userAgent;
    const { href: Href } = window.location;
    const msg = {
      Href,
      Ua
    };
    const list: React.ReactNodeArray = [];
    for (const key in msg) {
      if (msg.hasOwnProperty(key)) {
        const val = msg[key];
        if (val) {
          list.push(
            <ListItem wrap key={key}>
              <span
                style={{ color: '#6a5acd', fontSize: 12 }}
              >{`[ ${key} ] : ${val}`}</span>
            </ListItem>
          );
        }
      }
    }

    return (
      <Flex direction="column" align="stretch" style={{ height: '100%' }}>
        <FlexItem>{list.length > 0 ? list : null}</FlexItem>
        <Flex align="stretch" style={{ height: '50px', background: '#efefef' }}>
          <Flex align="center" style={{ flex: 1 }} justify="center">
            Hide
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
