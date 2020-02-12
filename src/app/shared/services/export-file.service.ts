import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class ExportFileService {
  public exportAsExcelFile(books: Book[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(books);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const extension = '.xlsx';
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const date = new Date().toLocaleString('en-US', { month: 'numeric', year: 'numeric', day: 'numeric' }).replace(/\//g, '.');
    const data: Blob = new Blob([buffer], { type: contentType });
    FileSaver.saveAs(data, `${fileName}_export_${date}${extension}`);
  }
}
