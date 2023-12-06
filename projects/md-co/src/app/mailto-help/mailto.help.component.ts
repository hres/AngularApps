import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '@hpfb/sdk/ui';

@Component({
  selector: 'app-mailto-help',
  templateUrl: './mailto.help.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class MailtoHelpComponent implements OnChanges{
  @Input() email;
  @Input() lang;
  
  paramValue: string = '';

  constructor(private _utilsService: UtilsService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.paramValue = this.email;
  }
}
