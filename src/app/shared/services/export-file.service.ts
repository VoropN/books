import { Injectable } from '@angular/core';
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

  public async exportAsExcelFile(books: Book[], fileName: string): Promise<void> {
    const { utils, write } = await import('xlsx');
    const worksheet = utils.json_to_sheet(books);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const options: SaveFileOptions = {
      fileName,
      extension: '.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    };
    this.saveFile(excelBuffer, options);
  }

  public exportAsPdfFile(books: Book[], fileName: string): void {
    const head = [
      'ID',
      'Title',
      'Description',
      'PageCount',
      'PublishDate'
    ];
    const body = this.createBodyPdf(books, head);
    const doc = new jsPDF();
    doc.autoTable({
      head: [head],
      body,
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 85 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
      }
    });
    const options: SaveFileOptions = { fileName, extension: '.pdf' };
    doc.save(this.createFileName(options));
  }

  private createBodyPdf(books: Book[], head: string[]): any {
    return books.map((book) => Object.values(head.reduce((acc, key) => ({ ...acc, [key]: this.formatField(book, key) }), {})));
  }

  private formatField(book: Book, key: string): number|string {
    let field = book[key];
    if (key === 'PublishDate') {
      field = new Date(field).toLocaleString('en-US', this.dateOptions);
    } else if (key === 'Description' || key === 'Title') {
      field = { content: field, contentWidth: 50  };
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
