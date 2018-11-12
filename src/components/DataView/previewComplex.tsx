import * as React from 'react';

export function previewComplex(data: any) {
  if (Array.isArray(data)) {
    return <span>Array[{data.length}]</span>;
  }
  switch (typeof data) {
    case 'function':
      return <span>{data.name || 'fn'}()</span>;
    case 'object':
    case 'undefined':
    case null:
      return '{…}';
  }
  return null;
}
