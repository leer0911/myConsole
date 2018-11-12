import * as React from 'react';
import { DataView } from './DataView';
import { Simple } from './Simple';
import { previewComplex } from './previewComplex';

interface Props {
  startOpen?: boolean;
  noSort?: boolean;
  name: string;
  value: any;
}

interface State {
  open: boolean;
  loading: boolean;
}

export class DataItem extends React.Component<Props, State> {
  state: State = { open: !!this.props.startOpen, loading: false };
  componentDidMount() {
    if (this.state.open && this.props.value) {
      this.setState({ loading: true, open: true });
    }
  }

  toggleOpen() {
    return () => {
      if (this.state.loading) {
        return;
      }

      if (!Object.keys(this.props.value).length) {
        return
      }

      this.setState({
        open: !this.state.open
      });
    };
  }

  render() {
    const data = this.props.value;
    const otype = typeof data;
    let complex = true;
    let preview;
    if (
      otype === 'number' ||
      otype === 'string' ||
      data == null /* null or undefined */ ||
      otype === 'boolean'
    ) {
      preview = <Simple data={data} />;
      complex = false;
    } else {
      preview = previewComplex(data);
    }

    const open = this.state.open;
    let opener = null;

    if (complex && Object.keys(this.props.value).length) {
      opener = (
        <div onClick={this.toggleOpen()} className="my-opener">
          {open ? (
            <span className="my-opener-open" />
          ) : (
              <span className="my-opener-close" />
            )}
        </div>
      );
    }

    let children = null;

    if (complex && open) {
      children = (
        <div>
          <DataView data={data} />
        </div>
      );
    }

    let { name } = this.props;
    if (name.length > 50) {
      name = name.slice(0, 50) + '…';
    }

    return (
      <li className="my-code-wrap">
        <div className="my-code-box">
          {opener}
          <div onClick={this.toggleOpen()} className="my-code-key">
            {name}:
          </div>
          <div className="my-code-val">{preview}</div>
        </div>
        {children}
      </li>
    );
  }
}
