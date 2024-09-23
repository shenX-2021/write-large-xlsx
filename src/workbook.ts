import { ZlibOptions } from 'zlib';
import { Worksheet } from './worksheet';
import fs from 'fs';
import { XlsxZip } from 'xlsx-zip';
import {
  generateContentTypeXml,
  generateRels,
  generateWorkbookXml,
  generateWorkbookXmlRels,
} from './statics';

interface Options {
  zlib?: ZlibOptions;
}

export class Workbook {
  private options: Options;
  private outputPath: string;
  private xlsxZip: XlsxZip;

  private sheetList: Worksheet[] = [];
  private sheetIndex: number = 0;

  constructor(outputPath: string, options?: Options) {
    this.outputPath = outputPath;
    this.options = options || {};

    const ws = fs.createWriteStream(outputPath);
    this.xlsxZip = new XlsxZip({ stream: ws, zlib: this.options?.zlib });
  }

  async finish() {
    if (this.sheetList.some((sheet) => sheet.opening)) {
      throw new Error(
        'There are some worksheets is opening, please call `finish` method to close them.',
      );
    }
    await this.xlsxZip.add('_rels/.rels', Buffer.from(generateRels()));
    await this.xlsxZip.add(
      '[Content_Types].xml',
      Buffer.from(generateContentTypeXml()),
    );
    await this.xlsxZip.add(
      'xl/_rels/workbook.xml.rels',
      Buffer.from(generateWorkbookXmlRels(this.sheetList)),
    );
    await this.xlsxZip.add(
      'xl/workbook.xml',
      Buffer.from(generateWorkbookXml(this.sheetList)),
    );

    const buf = await this.xlsxZip.finish();
    console.log(buf);
  }

  createWorksheet(name?: string): Worksheet {
    const id = this.sheetList.length + 1;
    if (!name) name = `sheet${id}`;
    name = this.generateName(name);
    const worksheet = new Worksheet({ xlsxZip: this.xlsxZip, id, name });

    this.sheetList.push(worksheet);

    return worksheet;
  }

  private generateName(originName: string) {
    if (this.sheetList.every((item) => item.name !== originName)) {
      return originName;
    }
    let idx = 1;
    let name = `${originName}(${idx})`;
    while (this.sheetList.some((item) => item.name === name)) {
      idx++;
      name = `${originName}(${idx})`;
    }

    return name;
  }
}
