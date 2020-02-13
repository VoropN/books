import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from 'src/app/shared/models/book.model';
import { Observable } from 'rxjs';
import { Api } from 'src/app/shared/environment/api.enum';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(Api.books).pipe(
      retry(2),
      catchError((error) => this.errorHandler.handleResponceError(error, 'Can\'t load books!'))
    );
  }

  public putBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${Api.books}/${book.ID}`, book, this.httpOptions).pipe(
      catchError((error) => this.errorHandler.handleResponceError(error, `Can\'t update book: "${book.Title}!"`))
    );
  }

  public postBook(book: Book): Observable<Book> {
    return this.http.post<Book>(Api.books, book, this.httpOptions).pipe(
      catchError((error) => this.errorHandler.handleResponceError(error, `Can\'t create book: "${book.Title}!"`))
    );
  }
}
