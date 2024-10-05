import { Cell, CellValue, FormatCell, generateCell } from './cell';
import { SharedStrings } from './shared-strings';
import { generateTag } from './utils';

export type Row = Cell[] | CellValue[];

export function generateRow(
  row: Row,
  rowIdx: number,
  sharedStrings: SharedStrings,
): string {
  return generateTag(
    'row',
    formatRow(row, sharedStrings)
      .map((cell) => generateCell(cell, rowIdx))
      .join(''),
    { r: (rowIdx + 1).toString() },
  );
}

function formatRow(row: Row, sharedStrings: SharedStrings): FormatCell[] {
  let index = 0;
  return row.map((item) => {
    const value: unknown = item?.value ?? item;
    const cell: FormatCell = item.value
      ? {
          value: '',
          columnIdx: item.columnIdx,
          t: '',
        }
      : { value: '', columnIdx: index, t: '' };
    if (typeof cell.columnIdx !== 'number') {
      cell.columnIdx = index;
    }
    if (cell.columnIdx < index) {
      throw new Error('Illegal value of columnIdx attribute.');
    }
    index = cell.columnIdx + 1;

    switch (typeof value) {
      case 'boolean': {
        cell.value = value.toString();
        cell.t = 'b';
        break;
      }
      case 'number': {
        cell.value = value.toString();
        cell.t = 'n';
        break;
      }
      case 'string': {
        cell.t = 's';
        cell.value = sharedStrings.getSharedString(value);
        break;
      }
      default: {
        if (value instanceof Date) {
          cell.t = 'd';
          cell.value = value.toISOString();
        } else if (value) {
          cell.t = 's';
          cell.value = value.toString();
        }
      }
    }

    return cell;
  });
}
