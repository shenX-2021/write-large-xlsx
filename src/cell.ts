import { generateTag } from './utils';

export function generateCell(cell: Cell, rowIdx: number) {
  const attrs = {
    r: formatAttr_r(rowIdx, cell.columnIdx),
    // TODO: support more type
    t: 's',
  };

  return generateTag('c', generateTag('v', cell.value), attrs);
}

export function formatAttr_r(rowIdx: number, columnIdx: number) {
  return `${formatColumnIndex(columnIdx)}${rowIdx + 1}`;
}

export function formatColumnIndex(
  columnIdx: number,
  suffix: string = '',
): string {
  const currentIdx = columnIdx % 26;
  const prefixColumnIdx = Math.floor(columnIdx / 26);
  suffix = String.fromCharCode(65 + currentIdx) + suffix;

  if (prefixColumnIdx) {
    return formatColumnIndex(prefixColumnIdx - 1, suffix);
  } else {
    return suffix;
  }
}

export interface Cell {
  value: any;
  columnIdx: number;
}

export type CellValue = string | number | Date;
