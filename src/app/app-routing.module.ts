import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'books', loadChildren: () => import('./books/books.module').then((mod) => mod.BooksModule) },
  { path: 'chart', loadChildren: () => import('./book-chart/book-chart.module').then((mod) => mod.BookChartModule) },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
