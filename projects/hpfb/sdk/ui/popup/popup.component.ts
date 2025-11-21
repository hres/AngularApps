import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import $ from 'jquery';

@Component({
    selector: 'lib-popup',
    imports: [],
    templateUrl: './popup.component.html',
    styleUrl: './popup.component.css',
    encapsulation: ViewEncapsulation.None
})
export class PopupComponent {
  @Input() message: string ;
  @Input() title: string;
  @Input() id: string;
  @Input() close: string;
  @Output() closed = new EventEmitter();

  closePopup() {
    jQuery( ".wb-overlay").trigger( "close.wb-overlay" );
    this.closed.emit();
  }
}