import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Book } from 'src/app/shared/models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public filterBookControl = new FormControl();
  public books: Book[];
  public filteredBooks: Observable<Book[]>;

  constructor() { }

  ngOnInit() {
  }

}
