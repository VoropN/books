import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() public books: Book[];
  @Output() public search = new EventEmitter<string>();
  @ViewChild(MatAutocompleteTrigger, {static: false}) public autocomplete: MatAutocompleteTrigger;
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

  public onClousePanel(): void {
    this.autocomplete.closePanel();
  }
}
