import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../services/book/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Moment } from 'moment';

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

  private destroy$ = new Subject();
  public bookTable: MatTableDataSource<Book>;
  public displayedColumns: string[] = ['ID', 'Title', 'PageCount', 'PublishDate', 'Edit'];
  public filterBookControl = new FormControl();
  public books: Book[];
  public filteredBooks: Observable<Book[]>;
  public expandedElement: Book | null;
  public showSpinner = true;
  public ranges: {
    'This Month': Date[],
    'This Yearh': Date[],
    'Last Yearh': Date[],
  };
  public selected: { start: Moment, end: Moment };
  private filterValue: string = '';

  constructor(private bookService: BookService) { }

  private filterAutocomplete(value: string): Book[] {
    let updateValue;
    if (value === null) {
      updateValue = +new Date();
    } else if (value === '') {
      this.filterValue = value.trim().toLowerCase();
      updateValue = +new Date();
    } else {
      this.filterValue = value.trim().toLowerCase();
      updateValue = this.filterValue;
    }
    this.filterBookTable(updateValue);
    return this.books.filter(this.filterPredicate);
  }

  private filterBookTable(updateValue): void {
    if (this.bookTable) {
      this.bookTable.filter = updateValue;
      this.bookTable.paginator.firstPage();
    }
  }

  private filterPredicate(book: Book): boolean {
    let checkDate = true;
    let checkValue = true;
    if (this.selected && this.selected.start || this.selected.end) {
      let publishDate = Number(new Date(book.PublishDate));
      let startDate = this.selected.start.valueOf();
      let endDate = this.selected.end.valueOf();
      checkDate = publishDate >= startDate && publishDate <= endDate;
    }
    if (this.filterValue !== '') {
      checkValue = book.Title.toLowerCase().includes(this.filterValue);
    }
    return checkDate && checkValue;
  }

  public ngOnInit(): void {
    const [month, year] = new Date().toLocaleString('en-US', { year: 'numeric', month: 'numeric' }).split('/').map((value) => Number(value));
    this.ranges = {
      'This Month': [new Date(year, month - 1), new Date(year, month, 0)],
      'This Yearh': [new Date(year, 0), new Date(year + 1, 0, 0)],
      'Last Yearh': [new Date(year - 1, 0), new Date(year, 0, 0)]
    };
    this.filterAutocomplete = this.filterAutocomplete.bind(this);
    this.filterPredicate = this.filterPredicate.bind(this);
    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.bookTable = new MatTableDataSource(books);
        this.bookTable.filterPredicate = this.filterPredicate;
        this.bookTable.paginator = this.paginator;
        this.bookTable.sort = this.sort;
        this.books = books;
        this.filteredBooks = this.filterBookControl.valueChanges.pipe(
          startWith(''),
          map(this.filterAutocomplete)
        );
        this.showSpinner = false;
      });
  }

  public displayBook(value: string): string {
    return value;
  }

  public openDialog(event: Event): void {
    event.stopPropagation();
  }

  public choosedDate(): void {
    this.filterBookControl.updateValueAndValidity({ emitEvent: true });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
