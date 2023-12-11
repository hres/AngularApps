import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mailto-help',
  templateUrl: 'mailto.help.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MailtoHelpComponent implements OnChanges{
  @Input() email : string;
  @Input() lang : string;
  
  public paramValue: string = '';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.paramValue = this.email;
  }
}
