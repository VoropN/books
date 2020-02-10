import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [DateRangeComponent],
  imports: [
    CommonModule,
    MatInputModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [DateRangeComponent]
})
export class DateRangeModule { }
