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
    // if the row record has INVALID state, don't allow the click event
    let hasInvalidControl:boolean = false;

    for (let control of this.rowsFormArray.controls) {
      if (control.invalid) {
        hasInvalidControl = true;
        break;
      }
    }

    if (!hasInvalidControl) {
      this.rowClicked.emit({ index: index, state: expanded }) 
    }
  }

  constructor() {}
}