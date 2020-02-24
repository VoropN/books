import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './components/book-list/book-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { SearchModule } from '../search/search.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CalendarModule } from '../calendar/calendar.module';
import { MatIconModule } from '@angular/material/icon';
import { ClickStopPropagationDirective } from '../shared/directives/click-stop-propagation.directive';
import { BooksRoutingModule } from './books-routing.module';

@NgModule({
  declarations: [
    BookListComponent,
    EditBookComponent,
    ClickStopPropagationDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    SearchModule,
    CalendarModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    BooksRoutingModule,
  ],
  entryComponents: [EditBookComponent]
})
export class BooksModule { }
