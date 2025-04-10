/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone:true,
  selector: '[data-number-letter]'
})
export class NumbersLettersDirective {

  constructor(private control: NgControl, private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.filterValue(value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData.getData('text/plain');
    this.filterValue(pastedText);
    event.preventDefault(); // Prevent default paste behavior
  }

  private filterValue(value: string) {
    // Allow only letters and numbers, remove all other characters
    let newValue = value.replace(/[^a-zA-Z0-9]/g, '');

    if (this.el.nativeElement.maxLength != null && this.el.nativeElement.maxLength > 0) {
      const maxLength = this.el.nativeElement.maxLength;
      newValue = newValue.substring(0, maxLength);
    }
    this.control.control.setValue(newValue);
  }
}
