import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { BookService } from '../../services/book/book.service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.scss']
})
export class BookChartComponent implements OnInit, OnDestroy {
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];

  private destroy$ = new Subject();

  constructor(private bookService: BookService) { }

  public ngOnInit(): void {
    this.barChartOptions = {
      responsive: true,
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.getBooks();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getBooks(): void {
    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((books) => {
        const bookMapByYears = {};

        books.forEach((book) => {
          const year = new Date(book.PublishDate).getFullYear().toString();
          bookMapByYears[year] = bookMapByYears[year] ? ++bookMapByYears[year] : 1;
        });

        this.barChartLabels = [];
        this.barChartData = [{ data: [], label: 'Books' }];

        Object.entries(bookMapByYears).map(([year, count]) => {
          this.barChartLabels.push(year);
          this.barChartData[0].data.push(count as number);
        });
    });
  }
}
