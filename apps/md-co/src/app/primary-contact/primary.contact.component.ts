    import {
    Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
    AfterViewInit, ChangeDetectorRef, ViewEncapsulation
  } from '@angular/core';
  import {FormGroup, FormBuilder} from '@angular/forms';
  import { ControlMessagesComponent, UtilsService, LoggerService, ConverterService  } from '@hpfb/sdk/ui';
  import { Router } from '@angular/router';
  import {PrimaryContactService} from './primary.contact.service';

  @Component({
    selector: 'primary-contact',
    templateUrl: 'primary.contact.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: false
  })

  /**
   * Primary Contact component is used for company form
   */
  export class PrimaryContactComponent implements OnInit, OnChanges, AfterViewInit {

    public primContactFormLocalModel: FormGroup;
    @Input('group') public primContactFormRecord: FormGroup;
    @Input() detailsChanged: any; // TODO: Change type
    // @Input() showErrors: boolean;
    @Input() primContactModel;
    @Input() lang;
    @Input() activeContactList;
    @Input() helpTextSequences;
    @Input() disableForm: boolean;
    // @Output() primContactErrorList = new EventEmitter(true);

    @Output() errorList = new EventEmitter(true);
    @Output() showAdminChanges = new EventEmitter(true);

    @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

    public showFieldErrors = false;
    // public yesNoList: Array<any> = [];
    private detailsService: PrimaryContactService;

    constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef,  private router: Router, private _utilsService: UtilsService, private _converterService: ConverterService, private _loggerService: LoggerService) {
      this.showFieldErrors = false;
      // this.showErrors = false;
      this.detailsService = new PrimaryContactService();
      // this.yesNoList = this.detailsService.getYesNoList();
    }

    ngOnInit() {
      // console.log('ng on init');
      if (!this.primContactFormLocalModel) {
        this.primContactFormLocalModel = PrimaryContactService.getReactiveModel(this._fb);
      }
      this.detailsChanged = 0;
    }

    ngAfterViewInit() {
      this.msgList.changes.subscribe(errorObjs => {
        let temp = [];
        // this._updateErrorList(errorObjs);
      });
      this.msgList.notifyOnChanges();

    }

    // private _updateErrorList(errorObjs) {
    //   let temp = [];
    //   if (errorObjs) {
    //     errorObjs.forEach(
    //       error => {
    //         temp.push(error);
    //       }
    //     );
    //   }
    //   this.primContactErrorList.emit(temp);
    //
    // }

    ngDoCheck() {
      /*  this.isValid();
        this._syncCurrentExpandedRow();*/
    }

    ngOnChanges(changes: SimpleChanges) {
      const isFirstChange = this._utilsService.isFirstChange(changes);

      if (!isFirstChange) {
      // since we can't detect changes on objects, using a separate flag
      if (changes['detailsChanged']) { // used as a change indicator for the model
        // console.log("the details cbange");
        if (this.primContactFormRecord) {
          this.setToLocalModel();

        } else {
          this.primContactFormLocalModel = PrimaryContactService.getReactiveModel(this._fb);
          this.primContactFormLocalModel.markAsPristine();
        }
      }
      // if (changes['showErrors']) {
      //
      //   this.showFieldErrors = changes['showErrors'].currentValue;
      //   let temp = [];
      //   if (this.msgList) {
      //     this.msgList.forEach(item => {
      //       temp.push(item);
      //       // console.log(item);
      //     });
      //   }
      //   this.primContactErrorList.emit(temp);
      // }
      if (changes['primContactFormLocalModel']) {
        // console.log('**********the primary contact changed');
        this.primContactFormRecord = this.primContactFormLocalModel;
      }
      if (changes['primContactModel']) {
        this.primContactModel = changes['primContactModel'].currentValue;
        PrimaryContactService.mapDataModelToFormModel(this.primContactModel, (<FormGroup>this.primContactFormLocalModel));
      }
      if (changes['activeContactList']) {
        const renewalCtrl = this.primContactFormLocalModel.controls['renewalContactName'];
        const financeCtrl = this.primContactFormLocalModel.controls['financeContactName'];
      
        const currentList = changes['activeContactList'].currentValue || [];
        const hasContacts = currentList.length > 0;
      
        // Set dropdowns to default values
        const resetIfDeleted = (ctrl) => {
          const value = ctrl.value;

          if (!hasContacts) {
            // Case 1: There are no active contacts.
            // Always reset to null so dropdown shows 'des.default.option'
            ctrl.setValue(null);
          } 
          else if (!value) {
            // Case 2: Contacts exist, but nothing is currently selected.
            // Reset to null to make dropdown show 'select.option'
            ctrl.setValue(null);
          } 
          else if (!currentList.includes(value)) {
            // Case 3: The currently selected contact was deleted.
            // Reset to null to show 'select.option' again.
            ctrl.setValue(null);
          }
        };
      
        resetIfDeleted(renewalCtrl);
        resetIfDeleted(financeCtrl);
      
        this.onblur();
      }

      if (this.disableForm) {
        this.disableFormGroup();
    } else {
        this.enableFormGroup();
    }
    }
    }

    /**
     * Uses the updated reactive forms model locally
     */

    setToLocalModel() {
      this.primContactFormLocalModel = this.primContactFormRecord;
      if (!this.primContactFormLocalModel.pristine) {
        this.primContactFormLocalModel.markAsPristine();
      }
    }

    onblur() {
      // console.log('input is typed');
      PrimaryContactService.mapFormModelToDataModel((<FormGroup>this.primContactFormLocalModel),
        this.primContactModel);
    }

    disableFormGroup() {
      if (this.primContactFormLocalModel) {
        this.primContactFormLocalModel.disable();
      }
    }

    enableFormGroup() {
      if (this.primContactFormLocalModel) {
        this.primContactFormLocalModel.enable();
      }
    }

    activeContactListNotEmpty() {
      if (this.activeContactList && this.activeContactList.length > 0) {
        return true;
      }
      return false;
    }

  }

