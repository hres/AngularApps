import { Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccordionComponent {

  @Input() rowsFormArray: FormArray;
  @Input() accordionHeadingMsgKey: string;
  // if we want to display an extra formcontrol value in the accordion header, pass in the nested formcontrol names using this field
  // eg. to display the contactDetails' fullName in the accordion header, pass in ['contactDetails', 'fullName']" to the accordion component
  @Input() accordionHeadingSupp: any;   

  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  // https://stackoverflow.com/questions/41510470/pass-scope-data-into-ng-content-in-angular2
  @ContentChild('tmpl') tmplRef: TemplateRef<any>;

  toggleExpand(index:number,  expanded: boolean) {
    this.rowClicked.emit({ index: index, state: expanded }) 
  }

  constructor() {}
}