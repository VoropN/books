import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService) { }

  public showErrorNotification(errorMessage): void {
    this.messageService.showNotification(errorMessage, 'error', 'Close');
  }

  public handleResponceError(error: HttpErrorResponse, userErrorMessage: string): Observable<never> {
    this.showErrorNotification(userErrorMessage);
    return throwError(error);
  }
}
