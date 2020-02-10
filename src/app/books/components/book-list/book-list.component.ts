import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../services/book/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { DateRanges } from '../../../shared/models/date-ranges.model';

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

  public bookTable: MatTableDataSource<Book>;
  public displayedColumns: string[] = ['ID', 'Title', 'PageCount', 'PublishDate', 'Edit'];
  public expandedElement: Book | null;
  public showSpinner = true;

  private destroy$ = new Subject();
  private searchValue: string = '';
  private needUpdate: string = 'need update table';
  private selectDate: DateRanges;

  constructor(private bookService: BookService) { }

  public ngOnInit(): void {
    this.filterPredicate = this.filterPredicate.bind(this);
    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.bookTable = new MatTableDataSource(books);
        this.bookTable.filterPredicate = this.filterPredicate;
        this.bookTable.paginator = this.paginator;
        this.bookTable.sort = this.sort;
        this.showSpinner = false;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  public openDialog(event: Event): void {
    event.stopPropagation();
  }

  private filterPredicate(book: Book): boolean {
    let checkDate = true;
    let checkValue = true;
    if (this.selectDate && (this.selectDate.startDate || this.selectDate.endDate)) {
      let publishDate = Number(new Date(book.PublishDate));
      let startDate = this.selectDate.startDate.valueOf();
      let endDate = this.selectDate.endDate.valueOf();
      checkDate = publishDate >= startDate && publishDate <= endDate;
    }
    if (this.searchValue !== '') {
      checkValue = book.Title.toLowerCase().includes(this.searchValue);
    }
    return checkDate && checkValue;
  }
}
