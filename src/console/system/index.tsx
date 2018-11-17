import * as React from 'react';
import { Flex, List } from 'antd-mobile';
import { ReactNodeArray } from 'prop-types';

const FlexItem = Flex.Item;
const ListItem = List.Item;

interface State {
  infos: string[];
}

export class System extends React.Component<any, State> {
  getMsg() {
    const Ua = navigator.userAgent;
    const msg = {
      Href: window.location.href,
      Ua
    };

    return msg;
  }

  render() {
    const msg = this.getMsg();
    const list: ReactNodeArray = [];
    for (const key in msg) {
      if (msg.hasOwnProperty(key)) {
        const val = msg[key];
        if (val) {
          list.push(
            <ListItem wrap key={key + 1}>
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
