export class SharedStrings {
  sharedStrings: string[] = [];
  sharedStringsIndex: Record<string, string> = {};
  count = 0;

  getSharedStringsXml(): string {
    let xml = '<?xml version="1.0"?>';
    xml += `<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${this.count}" uniqueCount="${this.sharedStrings.length}">`;
    for (const string of this.sharedStrings) {
      const attributes =
        string.trim().length === string.length ? '' : ' xml:space="preserve"';
      xml += `<si><t${attributes}>`;
      xml += string;
      xml += '</t></si>';
    }
    xml += '</sst>';
    return xml;
  }

  getSharedString(str: string): string {
    let id = this.sharedStringsIndex[str];
    if (id === undefined) {
      id = this.sharedStrings.length.toString();
      this.sharedStringsIndex[str] = id;
      this.sharedStrings.push(str);
    }
    this.count++;

    return id;
  }
}
