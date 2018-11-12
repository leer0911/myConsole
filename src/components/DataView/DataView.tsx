import * as React from 'react';
import { DataItem } from './DataItem';
import './style.css';

interface DataViewProps {
  data: any;
  startOpen?: boolean;
  noSort?: boolean;
}

export class DataView extends React.PureComponent<DataViewProps> {
  renderSparseArrayHole(count: number, key: string) {
    return (
      <li key={key} className="my-code-box">
        <div>
          <div>undefined × {count}</div>
        </div>
      </li>
    );
  }
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
      let lastIndex = -1;

      data.forEach((item: any, i: number) => {
        if (lastIndex < i - 1) {
          const holeCount = i - 1 - lastIndex;
          elements.push(this.renderSparseArrayHole(holeCount, i + '-hole'));
        }
        elements.push(this.renderItem(String(i), String(i)));
        lastIndex = i;
      });

      if (lastIndex < data.length - 1) {
        const holeCount = data.length - 1 - lastIndex;
        elements.push(
          this.renderSparseArrayHole(holeCount, lastIndex + '-hole')
        );
      }
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

    return (
      <ul className="my-code-container">
        {data.__proto__ && (
          <DataItem
            key={'__proto__'}
            name={'__proto__'}
            startOpen={this.props.startOpen}
            value={data.__proto__}
          />
        )}
        {elements}
      </ul>
    );
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
