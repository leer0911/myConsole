import React, { PureComponent } from 'react';
import { DataItem } from './dataItem';
import './style.css';

interface DataListProps {
  data: any;
  startOpen?: boolean;
  noSort?: boolean;
}

export class DataList extends PureComponent<DataListProps> {
  renderItem(name: string, key: string) {
    const data = this.props.data;
    return (
      <DataItem
        key={key}
        name={name}
        startOpen={this.props.startOpen}
        value={data[name]}
      />
    );
  }
  render() {
    const { data } = this.props;
    if (!data) {
      return;
    }

    const isArray = Array.isArray(data);
    const elements: any[] = [];

    if (isArray) {
      data.forEach((item: any, i: number) => {
        elements.push(this.renderItem(String(i), String(i)));
      });
    } else {
      const names = Object.keys(data);
      if (!this.props.noSort) {
        names.sort(alphanumericSort);
      }
      names.forEach((name, i) => {
        elements.push(this.renderItem(name, name));
      });
    }

    if (!elements.length) {
      return <div>{isArray ? 'Empty array' : 'Empty object'}</div>;
    }

    return <ul className="my-code-container">{elements}</ul>;
  }
}

function alphanumericSort(a: string, b: string): number {
  if ('' + +a === a) {
    if ('' + +b !== b) {
      return -1;
    }
    return +a < +b ? -1 : 1;
  }
  return a < b ? -1 : 1;
}
