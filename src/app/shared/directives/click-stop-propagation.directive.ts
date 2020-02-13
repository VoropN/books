import {Directive, AfterViewInit, ElementRef} from '@angular/core';
import {fromEvent} from 'rxjs';

@Directive({
  selector: '[appClickStopPropagation]',
})
export class ClickStopPropagationDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) { }

  public ngAfterViewInit(): void {
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click', {
      capture: true,
    }).subscribe((event) => {
      event.stopPropagation();
    });
  }
}
