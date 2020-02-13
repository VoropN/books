import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from 'src/app/shared/models/book.model';
import { Observable } from 'rxjs';
import { Api } from 'src/app/shared/environment/api.enum';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(Api.books).pipe(
      retry(2),
      catchError((error) => this.errorHandler.handleResponceError(error, 'Can\'t load books!'))
    );
  }
}
