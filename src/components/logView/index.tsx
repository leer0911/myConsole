import * as React from 'react';
import { DataList } from './dataList';
import './style.css';

interface DataViewProps {
  data: any;
  startOpen?: boolean;
}

interface State {
  open: boolean;
}

export class DataView extends React.PureComponent<DataViewProps, State> {
  state: State = { open: !!this.props.startOpen };
  toggleOpen() {
    return () => {
      this.setState({
        open: !this.state.open
      });
    };
  }

  render() {
    const { data } = this.props;
    const { open } = this.state;
    if (!data) {
      return;
    }

    let preview = null;
    let children = null;

    const isArray = Array.isArray(data);

    children = open ? <DataList data={data} /> : null;
    if (isArray) {
      preview = '[...]';
    } else {
      preview = '{...}';
    }

    return (
      <ul className="my-code-container">
        <li className="my-code-wrap">
          <div className="my-code-box">
            <div onClick={this.toggleOpen()} className="my-opener">
              {open ? (
                <span className="my-opener-open" />
              ) : (
                <span className="my-opener-close" />
              )}
            </div>
            <div className="my-code-val">{preview}</div>
          </div>
          {children}
        </li>
      </ul>
    );
  }
}
