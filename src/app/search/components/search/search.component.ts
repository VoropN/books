import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() public books: Book[];
  @Output() public search = new EventEmitter<string>();
  public searchBooks = new FormControl();
  private destroy$ = new Subject();

  public ngOnInit(): void {
    this.searchBooks.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
      const searchValue = value.trim().toLowerCase();
      this.search.emit(searchValue);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public trackByBooks(index: number, book: Book): number {
    return book.ID;
  }
}
