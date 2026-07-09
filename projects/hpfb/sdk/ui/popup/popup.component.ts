import { Component, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import $ from 'jquery';

@Component({
    selector: 'lib-popup',
    imports: [],
    templateUrl: './popup.component.html',
    styleUrl: './popup.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class PopupComponent {
  @Input() message: string ;
  @Input() title: string;
  @Input() id: string;
  @Input() close: string;
  @Output() closed = new EventEmitter();

  closePopup() {
    jQuery("#" + this.id).trigger("close.wb-overlay");
    this.closed.emit();
  }
}