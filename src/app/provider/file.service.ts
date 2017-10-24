import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i !== s.length; ++i) {
		view[i] = s.charCodeAt(i) & 0xFF;
	};
	return buf;
}

@Injectable()
export class FileService {

  constructor() { }

  async uploadExcel(file: File): Promise<AOA> {
    return new Promise<AOA>((resolve, reject) => {
      let data: AOA = [];
      
      /* wire up file reader */
      const reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
  
        /* grab first sheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
  
        /* save data */
        data = <AOA>(XLSX.utils.sheet_to_json(ws, {header:1}));
        resolve(data);
      };
      reader.readAsBinaryString(file);
    });
  }
  
  export(fileName: string, excelData: Array<Array<any>>, wopts?: XLSX.WritingOptions): void {
    
      if(wopts == null) {
        wopts = { bookType:'xlsx', type:'binary' };
      }
  
      /* generate worksheet */
      const ws = XLSX.utils.aoa_to_sheet(excelData);
  
      /* generate workbook and add the worksheet */
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      /* save to file */
      const wbout = XLSX.write(wb, wopts);
      saveAs(new Blob([s2ab(wbout)]), fileName);
    }

}
