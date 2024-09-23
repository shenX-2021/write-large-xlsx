import { XlsxZip } from 'xlsx-zip';
import { Readable } from 'stream';
import { generateRow, Row } from './row';

interface WorksheetOptions {
  xlsxZip: XlsxZip;
  id: number;
  name: string;
}

export class Worksheet {
  private options: WorksheetOptions;
  private xlsxZip: XlsxZip;

  public id: number;
  public name: string;
  private stream: Readable;

  private _opening = false;
  get opening() {
    return this._opening;
  }

  private rowIdx = 0;

  constructor(options: WorksheetOptions) {
    this.options = options;
    this.xlsxZip = this.options.xlsxZip;
    this.id = this.options.id;
    this.name = this.options.name;

    this.openStream();
  }

  finish() {
    if (!this._opening) return;
    this.stream.push(this.closeTag('sheetData'));
    this.stream.push(this.closeTag('worksheet'));

    this.stream.push(null);
    this._opening = false;
  }

  private openStream() {
    this.stream = new Readable({
      read() {
        this.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
      },
    });
    this.xlsxZip.add(`xl/worksheets/sheet${this.id}.xml`, this.stream);
    this.stream.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    this.stream.push(
      this.openTag('worksheet', {
        xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
        'xmlns:mc':
          'http://schemas.openxmlformats.org/markup-compatibility/2006',
        'xmlns:mv': 'urn:schemas-microsoft-com:mac:vml',
        'xmlns:mx': 'http://schemas.microsoft.com/office/mac/excel/2008/main',
        'xmlns:r':
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'xmlns:x14':
          'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main',
        'xmlns:x14ac':
          'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac',
        'xmlns:xm': 'http://schemas.microsoft.com/office/excel/2006/main',
      }),
    );
    this.stream.push(this.openTag('sheetData'));
    this._opening = true;
  }

  addRow(row: Row): Worksheet {
    if (!this._opening) {
      throw new Error("This worksheet is closed, can't not add data now.");
    }
    const rowStr = generateRow(row, this.rowIdx++);
    this.stream.push(rowStr);
    return this;
  }

  private openTag(tag: string, attrs?: Record<string, string>) {
    let str = '';
    if (attrs) {
      const attrsStr = Object.entries(attrs)
        .map((item) => `${item[0]}="${item[1]}"`)
        .join(' ');
      str = ` ${attrsStr}`;
    }
    return `<${tag}${str}>`;
  }

  private closeTag(tag: string) {
    return `</${tag}>`;
  }
}
