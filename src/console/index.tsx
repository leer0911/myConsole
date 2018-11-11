import * as React from "react";
import { Modal, Button, Tabs } from 'antd-mobile';
import { Log } from './log'
import { Element } from './element'
import { Network } from './network'
import { Storage } from './storage'
import { System } from './system'

const tabs = [
  { title: 'Log' },
  { title: 'System' },
  { title: 'Network' },
  { title: 'Element' },
  { title: 'Storage' },
];

export class MyConsole extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      paneShow: false
    };
  }
  showModal = (key: any) => (e: any) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      ...this.state,
      [key]: true,
    });
  }
  onClose = (key: any) => () => {
    this.setState({
      ...this.state,
      [key]: false,
    });
  }
  render() {
    return (
      <div>
        <Button onClick={this.showModal('paneShow')} type="primary" style={{ width: '150px', position: 'fixed', bottom: '20px', right: '20px' }}>myConsole</Button>
        <Modal
          popup
          visible={this.state.paneShow}
          onClose={this.onClose('paneShow')}
          animationType="slide-up"
        >
          <div style={{ height: '80vh' }}>
            <Tabs tabs={tabs} animated={false} tabBarBackgroundColor="#efefef">
              <Log />
              <System/>
              <Network/>
              <Element/>
              <Storage/>
              <System/>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}
