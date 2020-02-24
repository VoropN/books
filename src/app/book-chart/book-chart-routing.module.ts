import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookChartComponent } from './component/book-chart.component';


const routes: Routes = [
  { path: '', component: BookChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookChartRoutingModule { }
