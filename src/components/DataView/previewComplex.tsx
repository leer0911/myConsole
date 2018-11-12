import * as React from 'react';

export function previewComplex(data: any) {
  if (Array.isArray(data)) {
    return <span>Array[{data.length}]</span>;
  }
  switch (typeof data) {
    case 'function':
      return <span>{data.name || 'fn'}()</span>;
    case 'object':
      return <span>{data.name + '{…}'}</span>;
    // case 'date':
    //   return <span>{data.name}</span>;
    // case 'symbol':
    //   return <span>{data.name}</span>;
    // case 'iterator':
    //   return <span>{data.name + '(…)'}</span>;

    // case 'array_buffer':
    // case 'data_view':
    // case 'array':
    case undefined:
    case null:
      return '{…}';
  }
  return null;
}
