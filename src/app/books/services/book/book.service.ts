import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from 'src/app/shared/models/book.model';
import { Observable } from 'rxjs';
import { Api } from 'src/app/shared/environment/api.enum';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(Api.books);
  }
}
