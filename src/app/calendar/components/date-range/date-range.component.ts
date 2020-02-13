import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PeriodRanges } from 'src/app/shared/models/period-ranges.model';
import { DateRanges } from 'src/app/shared/models/date-ranges.model';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {
  @Output() public selectDate = new EventEmitter<DateRanges>();
  public ranges: PeriodRanges;

  public ngOnInit(): void {
    this.initRangesDate();
  }

  private initRangesDate(): void {
    const [month, year] = new Date()
      .toLocaleString('en-US', { month: 'numeric', year: 'numeric' })
      .split('/')
      .map((value) => Number(value));
    this.ranges = {
      'This Month': [new Date(year, month - 1), new Date(year, month, 0)],
      'This Yearh': [new Date(year, 0), new Date(year + 1, 0, 0)],
      'Last Yearh': [new Date(year - 1, 0), new Date(year, 0, 0)]
    };
  }

  public updateDateRange(date: DateRanges): void {
    this.selectDate.emit(date);
  }
}
