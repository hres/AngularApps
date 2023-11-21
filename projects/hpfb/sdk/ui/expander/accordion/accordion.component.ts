import { Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormArray} from '@angular/forms';

@Component({
  selector: 'lib-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccordionComponent {

  @Input() rowsFormArray: FormArray;
  @Input() accordionHeadingMsgKey: string;
  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  // https://stackoverflow.com/questions/41510470/pass-scope-data-into-ng-content-in-angular2
  @ContentChild('tmpl') tmplRef: TemplateRef<any>;

  toggleExpand(index:number,  expanded: boolean) {
    this.rowClicked.emit({ index: index, state: expanded }) 
  }

  constructor() {}
}