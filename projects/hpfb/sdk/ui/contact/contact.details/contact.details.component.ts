import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import { ControlMessagesComponent } from '../../error-msg/control-messages/control-messages.component';
import {ContactDetailsService} from './contact.details.service';
import { ICode } from '../../data-loader/data';

@Component({
  selector: 'contact-details',
  templateUrl: 'contact.details.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Contact Details Component is used for Company form
 */
export class ContactDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() contactRow: FormGroup;

  public contactFormLocalModel: FormGroup;
  @Input('group') public contactRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() isInternal: boolean;
  @Input() languageList: ICode[];
  @Input() contactStatusList: ICode[];
  @Input() lang;
  @Input() helpTextSequences;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public showFieldErrors: boolean = false;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private _detailsService: ContactDetailsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    if (!this.contactFormLocalModel) {
      this.contactFormLocalModel = this._detailsService.getReactiveModel(this._fb, this.isInternal);
    }
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      // let temp = [];
      this._updateErrorList(errorObjs);

      /* errorObjs.forEach(
         error => {
           temp.push(error);
         }
       );
       this.errorList.emit(temp);*/
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
    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.contactRecord) {
        this.setToLocalModel();

      } else {
        this.contactFormLocalModel = this._detailsService.getReactiveModel(this._fb, this.isInternal);
        this.contactFormLocalModel.markAsPristine();
      }
    }

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

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.contactFormLocalModel = this.contactRecord;
    if (!this.contactFormLocalModel.pristine) {
      this.contactFormLocalModel.markAsPristine();
    }
  }

  removed(rec) {
    console.log(rec);
    // this.contactFormLocalModel.controls.country.setValue(null)
  }

  recordPrcsOnblur() {
    // console.log('');
    if (!this.contactFormLocalModel.controls['recordProcessed'].value) {
      this.contactFormLocalModel.controls['recordProcessed'].setValue('');
    }
  }
}

