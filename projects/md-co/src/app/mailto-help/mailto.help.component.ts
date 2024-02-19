import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mailto-help',
  templateUrl: 'mailto.help.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MailtoHelpComponent implements OnChanges{
  @Input() email : string;
  @Input() subject : string;
  @Input() lang : string;
  
  public subjectParam: string = '';
  public emailParam: string = '';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.subject);
    console.log(this.email);
    this.subjectParam = this.subject;
    this.emailParam = this.email;
  }
}
