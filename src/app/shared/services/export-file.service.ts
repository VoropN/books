import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Book } from '../models/book.model';
import { SaveFileOptions } from '../models/save-file-options';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportFileService {
  private dateOptions = { month: '2-digit', year: 'numeric', day: '2-digit' };

  public exportAsExcelFile(books: Book[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(books);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const options: SaveFileOptions = {
      fileName,
      extension: '.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    };
    this.saveFile(excelBuffer, options);
  }

  public exportAsPdfFile(books: Book[], fileName: string): void {
    const head = ['ID', 'Title', 'Description', 'PageCount', 'PublishDate'];
    const body = this.createBodyPdf(books, head);
    const doc = new jsPDF();
    doc.autoTable({
      head: [head],
      body,
    });
    const options: SaveFileOptions = { fileName, extension: '.pdf' };
    doc.save(this.createFileName(options));
  }

  private createBodyPdf(books, head): (string|number)[] {
    return books.map((book) => Object.values(head.reduce((acc, key) => ({ ...acc, [key]: this.formatField(book, key) }), {})));
  }

  private formatField(book, key): number|string {
    let field = book[key];
    if (key === 'PublishDate') {
      field = new Date(field).toLocaleString('en-US', this.dateOptions);
    }
    return field;
  }

  private saveFile(buffer: any, options: SaveFileOptions): void {
    const data: Blob = new Blob([buffer], { type: options.contentType });
    FileSaver.saveAs(data, this.createFileName(options));
  }

  private createFileName(options: SaveFileOptions): string {
    const date = new Date().toLocaleString('en-US', this.dateOptions).replace(/\//g, '.');
    return `${options.fileName}_export_${date}${options.extension}`;
  }
}
