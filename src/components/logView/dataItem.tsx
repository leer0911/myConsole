import React, { PureComponent } from 'react';
import { DataList } from './dataList';
import { Simple } from './simple';
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

export class DataItem extends PureComponent<Props, State> {
  state: State = { open: !!this.props.startOpen, loading: false };
  componentDidMount() {
    if (this.state.open && this.props.value) {
      this.setState({ loading: true, open: true });
    }
  }

  toggleOpen() {
    return () => {
      const data = this.props.value;
      const isArray = Array.isArray(data);

      if (this.state.loading) {
        return;
      }

      if (!isArray && !Object.keys(this.props.value).length) {
        return;
      }

      if (isArray && data.length === 0) {
        return;
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
          <DataList data={data} />
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
            {name ? `${name}:` : ''}
          </div>
          <div className="my-code-val">{preview}</div>
        </div>
        {children}
      </li>
    );
  }
}
