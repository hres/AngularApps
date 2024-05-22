import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ContactDetailsService} from './contact.details.service';
import { ContactStatus } from '../../app.constants';
import { ICode, UtilsService, ControlMessagesComponent } from '@hpfb/sdk/ui';

@Component({
  selector: 'app-contact-details',
  templateUrl: 'contact.details.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Contact Details Component is used for Company form
 */
export class ContactDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('group') public contactDetailForm: FormGroup;    // contact detail form will use the reactive model passed in from the contact record component
  @Input() recordId: string; 
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() isInternal: boolean;
  @Input() languageList: ICode[];
  @Input() contactStatusList: ICode[];
  @Input() lang;
  @Input() helpTextSequences;
  @Input() translatedParentLabel: string;

  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public showFieldErrors: boolean = false;
  public disableEdit: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private _utilsService: UtilsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    // for external site, disable editing if the Contact Status is REMOVE
    this.disableEdit = (!this.isInternal && this.contactDetailForm.get('status').value === ContactStatus.Remove)
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));
    
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.errorList.emit(temp);
    }
  }

}
