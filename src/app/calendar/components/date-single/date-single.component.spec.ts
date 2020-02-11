import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSingleComponent } from './date-single.component';

describe('DateSingleComponent', () => {
  let component: DateSingleComponent;
  let fixture: ComponentFixture<DateSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
