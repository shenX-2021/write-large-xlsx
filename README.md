# write-large-xlsx

[![NPM](https://nodei.co/npm/write-large-xlsx.png)](https://nodei.co/npm/write-large-xlsx)

write-large-xlsx is a simple and fast library of writing xlsx file, it is low memory and could write many large data.

this library is inspired by [write-excel-file](https://gitlab.com/catamphetamine/write-excel-file) and [exceljs](https://github.com/exceljs/exceljs).

## Feature

- low memory
- streaming

## Install

```sh
npm i write-large-xlsx
```

## Usage

```javascript
const { Workbook } = require('write-large-xlsx');

async function bootstrap() {
  const workbook = new Workbook(`./output.xlsx`);
  const worksheet = workbook.createWorksheet();

  worksheet.addRow(['string', true, new Date(), 10001]);
  // or
  worksheet.addRow([{ columnIdx: 10, value: 'string' }]);

  worksheet.finish();
  await workbook.finish();
}

bootstrap();
```
