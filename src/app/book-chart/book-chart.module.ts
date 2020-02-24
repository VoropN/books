import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookChartRoutingModule } from './book-chart-routing.module';
import { ChartsModule } from 'ng2-charts';
import { BookChartComponent } from './component/book-chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [BookChartComponent],
  imports: [
    CommonModule,
    BookChartRoutingModule,
    ChartsModule,
    MatProgressSpinnerModule,
  ]
})
export class BookChartModule { }
