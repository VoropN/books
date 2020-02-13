import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../services/book/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { DateRanges } from '../../../shared/models/date-ranges.model';
import { MatDialog } from '@angular/material/dialog';
import { EditBookComponent } from '../edit-book/edit-book.component';
import { ExportFileService } from 'src/app/shared/services/export-file.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class BookListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;
  @ViewChild('table', { static: true }) public table: MatTable<Book>;

  public bookTable: MatTableDataSource<Book>;
  public displayedColumns: string[] = ['ID', 'Title', 'PageCount', 'PublishDate', 'Edit'];
  public expandedElement: Book | null;
  public showSpinner = true;
  public initialBookCache = new Map<number, Book>();

  private destroy$ = new Subject();
  private searchValue = '';
  private needUpdate = 'need update table';
  private selectDate: DateRanges;

  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private exportFile: ExportFileService) { }

  public ngOnInit(): void {
    this.filterPredicate = this.filterPredicate.bind(this);
    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((books) => {
        this.bookTable = new MatTableDataSource(books);
        this.bookTable.filterPredicate = this.filterPredicate;
        this.bookTable.paginator = this.paginator;
        this.bookTable.sort = this.sort;
        this.showSpinner = false;
        this.table.trackBy = this.trackByBooks;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public exportToExcel(): void {
    const fileName = this.createFileName();
    this.exportFile.exportAsExcelFile(this.bookTable.filteredData, fileName);
  }

  public exportToPdf(): void {
    const fileName = this.createFileName();
    this.exportFile.exportAsPdfFile(this.bookTable.filteredData, fileName);
  }

  public updateSearchValue(searchValue: string): void {
    this.searchValue = searchValue;
    const updateTable = searchValue === '' ? this.needUpdate : searchValue;
    this.filterBookTable(updateTable);
  }

  public updateDateRange(date: DateRanges): void {
    this.selectDate = date;
    if (this.bookTable) {
      this.filterBookTable(this.needUpdate);
    }
  }

  public filterBookTable(value: string): void {
    this.bookTable.filter = value;
    this.bookTable.paginator.firstPage();
  }

  public openDialog(book?: Book): void {
    const dialogRef = this.dialog.open(EditBookComponent, {
      data: book || new Book(),
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((result) => {
        if (result) {
          if (book) {
            this.tryAddBookToCache(book);
            this.updateBookOnServer(book, result);
          } else {
            this.createBookOnServer(result);
          }
        }
      });
  }

  public hasBookCache(book: Book): boolean {
    return this.initialBookCache.has(book.ID);
  }

  public undoLastEditBook(book: Book): void {
    const bookCache = this.initialBookCache.get(book.ID);
    this.updateBookOnServer(book, bookCache);
    this.initialBookCache.delete(book.ID);
  }

  private updateBookOnServer(book: Book, changedBook: Book): void {
    this.bookService.putBook(changedBook)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((updatedBook: Book) => {
        const message = `Book "${updatedBook.Title}" updated successfully!`;
        this.messageService.showNotification(message, 'success', 'Ok');
        Object.assign(book, changedBook);
      });
  }

  private createBookOnServer(book: Book): void {
    this.bookService.postBook(book)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((newBook: Book) => {
        const message = `Book "${newBook.Title}" created successfully!`;
        this.messageService.showNotification(message, 'success', 'Ok');
        this.bookTable.data.push(newBook);
        this.filterBookTable(this.needUpdate);
        this.table.renderRows();
      });
  }

  private createFileName(): string {
    return `Books ${this.searchValue ? `[filter=${this.searchValue}]` : ''}`;
  }

  private tryAddBookToCache(book: Book): void {
    if (!this.hasBookCache(book)) {
      this.initialBookCache.set(book.ID, { ...book });
    }
  }

  private filterPredicate(book: Book): boolean {
    let checkDate = true;
    let checkValue = true;
    if (this.selectDate && (this.selectDate.startDate || this.selectDate.endDate)) {
      const publishDate = Number(new Date(book.PublishDate));
      const startDate = this.selectDate.startDate.valueOf();
      const endDate = this.selectDate.endDate.valueOf();
      checkDate = publishDate >= startDate && publishDate <= endDate;
    }
    if (this.searchValue !== '') {
      checkValue = book.Title.toLowerCase().includes(this.searchValue);
    }
    return checkDate && checkValue;
  }

  private trackByBooks(index: number, book: Book): number {
    return book.ID;
  }
}
