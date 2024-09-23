import { Cell, CellValue, generateCell } from './cell';
import { generateTag } from './utils';

export type Row = Cell[] | CellValue[];

export function generateRow(row: Row, rowIdx: number): string {
  return generateTag(
    'row',
    formatRow(row)
      .map((cell) => generateCell(cell, rowIdx))
      .join(''),
    { r: (rowIdx + 1).toString() },
  );
}

function formatRow(row: Row): Cell[] {
  let index = 0;
  return row.map((item) => {
    const cell: Cell = item.value ? item : { value: item, columnIdx: index };
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
