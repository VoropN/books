import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DateRanges } from 'src/app/shared/models/date-ranges.model';

@Component({
  selector: 'app-date-single',
  templateUrl: './date-single.component.html',
  styleUrls: ['./date-single.component.scss']
})
export class DateSingleComponent implements OnInit {
  @Input() public date: Date | string;
  @Output() public selectDate = new EventEmitter<string>();
  public selected: DateRanges;

  public ngOnInit(): void {
    this.initDate();
  }

  public updateDate(date: DateRanges): void {
    if (date && date.startDate) {
      this.selectDate.emit(date.startDate.toJSON());
    }
  }

  private initDate(): void {
    this.selected = {
      startDate: new Date(this.date),
      endDate: new Date(this.date),
    }
  }
}
