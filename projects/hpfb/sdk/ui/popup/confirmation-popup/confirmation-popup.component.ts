import { Component, EventEmitter, Input, Output, ViewEncapsulation, ChangeDetectionStrategy, viewChild, ElementRef, ViewChild } from '@angular/core';
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


  @ViewChild('dialogHeading') dialogHeading: ElementRef<HTMLElement>;
  @ViewChild('dialogBody') dialogBody: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    jQuery('#' + this.id).on('wb-overlay-open',()=> {
      this.dialogHeading?.nativeElement.focus();
    })
  }

  closePopup() {
    jQuery("#" + this.id).trigger("close.wb-overlay");
    this.closed.emit();
  }

  onConfirm() {
    this.closePopup();
    this.confirmed.emit(true);
  }
}
