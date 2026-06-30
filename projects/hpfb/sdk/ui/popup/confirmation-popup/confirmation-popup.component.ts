import { Component, EventEmitter, Input, Output, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import $ from 'jquery';

@Component({
    selector: 'lib-confirmation-popup',
    imports: [TranslateModule],
    templateUrl: './confirmation-popup.component.html',
    styleUrl: './confirmation-popup.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
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
  @Output() closed = new EventEmitter();

  closePopup() {
    jQuery( ".wb-overlay").trigger( "close.wb-overlay" );
    this.closed.emit();
  }

  onConfirm() {
    this.closePopup();
    this.confirmed.emit(true);
  }
}
