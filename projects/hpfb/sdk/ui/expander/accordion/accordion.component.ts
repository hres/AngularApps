import { Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation, ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormGroup} from '@angular/forms';

@Component({
    selector: 'lib-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AccordionComponent {

  @Input() rowsFormArray: FormArray;
  @Input() recordListName: string;
  @Input() accordionHeadingMsgKey: string;
  // if we want to display an extra formcontrol value in the accordion header, pass in the nested formcontrol names using this field
  // eg. to display the contactDetails' fullName in the accordion header, pass in ['contactDetails', 'fullName']" to the accordion component
  @Input() accordionHeadingSupp: any;   

  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  // https://stackoverflow.com/questions/41510470/pass-scope-data-into-ng-content-in-angular2
  @ContentChild('tmpl') tmplRef: TemplateRef<any>;
  @ViewChildren('headerEl') headerEls!: QueryList<ElementRef>;

  accordionState: string = 'collapsed';

  toggleExpand(index:number,  expanded: boolean) {
    this.rowClicked.emit({ index: index, state: expanded }); 
    this.accordionState = expanded ? "collapsed" : "expanded";
  }

  constructor() {}

  getNestedFormValue(recordRow, keys: string[]): any {
    return keys.reduce((acc, key) => acc?.get(key), recordRow)?.value ?? null;
  }
  
  focusHeader(index: number) {
    const el = this.headerEls.toArray()[index]?.nativeElement;
    if (el) {
      setTimeout(() => el.focus(), 0);
    }
  }
  
}