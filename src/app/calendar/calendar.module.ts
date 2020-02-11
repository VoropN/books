import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MatInputModule } from '@angular/material/input';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DateSingleComponent } from './components/date-single/date-single.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [DateRangeComponent, DateSingleComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [DateRangeComponent, DateSingleComponent]
})
export class CalendarModule { }
