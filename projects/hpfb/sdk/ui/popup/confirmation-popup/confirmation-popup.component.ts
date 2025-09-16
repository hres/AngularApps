import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import $ from 'jquery';

@Component({
    selector: 'lib-confirmation-popup',
    imports: [TranslateModule],
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
  @Input() heading: string;

  @Output() confirmed = new EventEmitter();

  closePopup() {
    jQuery( ".wb-overlay").trigger( "close.wb-overlay" );
  }

  onConfirm() {
    this.closePopup();
    this.confirmed.emit(true);
  }
}
