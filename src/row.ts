import { Cell, CellValue, generateCell } from './cell';
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

function formatRow(row: Row, sharedStrings: SharedStrings): Cell[] {
  let index = 0;
  return row.map((item) => {
    const cell: Cell = item.value
      ? {
          value: sharedStrings.getSharedString(item.value),
          columnIdx: item.columnIdx,
        }
      : { value: sharedStrings.getSharedString(item), columnIdx: index };
    if (typeof cell.columnIdx !== 'number') {
      cell.columnIdx = index;
    }
    if (cell.columnIdx < index) {
      throw new Error('Illegal value of columnIdx attribute.');
    }
    index = cell.columnIdx + 1;

    return cell;
  });
}
