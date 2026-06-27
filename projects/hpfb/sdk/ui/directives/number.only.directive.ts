/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[data-only-digits]'
})
export class NumbersOnlyDirective {

  constructor(
    private control: NgControl,
    private el: ElementRef<HTMLInputElement>
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterValue(input.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text/plain') ?? '';
    this.filterValue(pastedText);
  }

  private filterValue(value: string): void {
    // Allow only digits.
    let newValue = value.replace(/[^\d]/g, '');

    const input = this.el.nativeElement;

    if (input.maxLength > 0) {
      newValue = newValue.substring(0, input.maxLength);
    }

    // Keep the input element and Angular form control synchronized.
    if (input.value !== newValue) {
      input.value = newValue;
    }

    this.control.control?.setValue(newValue, {
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false
    });
  }
}
