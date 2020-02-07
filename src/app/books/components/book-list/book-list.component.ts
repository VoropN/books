import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../services/book/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { trigger, style, animate, transition, state } from '@angular/animations';

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
  public showTable = false;

  constructor(private bookService: BookService) { }

  private filterAutocomplete(value: string): Book[] {
    const filterValue = value.trim().toLowerCase();
    this.filterBookTable(filterValue);
    if (filterValue === '') {
      return this.books.slice();
    }
    return this.books.filter(option => option.Title.toLowerCase().includes(filterValue));
  }

  private filterBookTable(filterValue: string): void {
    this.bookTable.filter = filterValue;
    if (this.bookTable.paginator) {
      this.bookTable.paginator.firstPage();
    }
  }

  private filterPredicate(book: Book, filterValue: string): boolean {
    return book.Title.toLowerCase().includes(filterValue);
  }

  public ngOnInit(): void {
    this.filterAutocomplete = this.filterAutocomplete.bind(this);
    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.bookTable = new MatTableDataSource(books);
        this.bookTable.filterPredicate = this.filterPredicate;
        this.bookTable.paginator = this.paginator;
        this.bookTable.sort = this.sort;
        this.books = books;
        this.filteredBooks = this.filterBookControl.valueChanges.pipe(
          map(this.filterAutocomplete)
        );
        this.showTable = true;
      });
  }

  public displayBook(value: string): string {
    return value;
  }

  public openDialog(event: Event): void {
    event.stopPropagation();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
