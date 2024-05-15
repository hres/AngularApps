import { Component, Input, ViewEncapsulation } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'lib-popup',
  standalone: true,
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

  closePopup() {
    jQuery( ".wb-overlay").trigger( "close.wb-overlay" );
  }
}
