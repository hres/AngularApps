import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'lib-confirmation-popup',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationPopupComponent {
  @Input() message: string ;
  @Input() title: string;
  @Input() id: string;
  @Input() cancel: string;
  @Input() confirm: string;

  @Output() confirmed = new EventEmitter();

  closePopup() {
    jQuery( ".wb-overlay").trigger( "close.wb-overlay" );
  }

  onConfirm() {
    this.closePopup();
    this.confirmed.emit(true);
  }
}
