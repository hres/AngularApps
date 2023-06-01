/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[only-digits]'
})
export class NumbersOnlyDirective {

  private regex: RegExp = new RegExp('^[0-9]*$');
  // Allow key codes for special events. Reflect :
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  // Backspace, tab, end, home

  // @Input() maxlength: number;
  // @Input() min: number;
  // @Input() max: number;

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let e = <KeyboardEvent>event;

  if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      ((e.key === 'a' || e.code === 'KeyA') && e.ctrlKey === true) || // Allow: Ctrl+A
      ((e.key === 'c' || e.code === 'KeyC') && e.ctrlKey === true) || // Allow: Ctrl+C
      ((e.key === 'v' || e.code === 'KeyV') && e.ctrlKey === true) || // Allow: Ctrl+V
      ((e.key === 'x' || e.code === 'KeyX') && e.ctrlKey === true) || // Allow: Ctrl+X
      ((e.key === 'a' || e.code === 'KeyA') && e.metaKey === true) || // Allow: Cmd+A (Mac)
      ((e.key === 'c' || e.code === 'KeyC') && e.metaKey === true) || // Allow: Cmd+C (Mac)
      ((e.key === 'v' || e.code === 'KeyV') && e.metaKey === true) || // Allow: Cmd+V (Mac)
      ((e.key === 'x' || e.code === 'KeyX') && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }
  if (// to allow numbers
    e.code.startsWith("Digit") ||
    // to allow numpad number
    e.code.startsWith("Numpad") ) {
    } else {
      event.preventDefault();
    }

    let current: string = this.el.nativeElement.value;

    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex) ) {
      event.preventDefault();
    }

  }
}
