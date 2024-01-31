import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ControlMessagesComponent, ICode } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { TransactionFeeService } from './transaction.fee.service';

@Component({
  selector: 'transaction-fee',
  templateUrl: 'transaction.fee.component.html',
  encapsulation: ViewEncapsulation.None

})
export class TransactionFeeComponent implements OnInit, OnChanges, AfterViewInit{

  public transFeeFormLocalModel: FormGroup;
  // @Input('group') public transFeeFormRecord: FormGroup;
  // @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() transFeeModel;
  @Input() lang;
  @Output() feeErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public yesNoList: ICode[] = [];
  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, private _feeService:TransactionFeeService, private _globalService: GlobalService,
              private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.transFeeFormLocalModel) {
      this.transFeeFormLocalModel = this._feeService.getReactiveModel(this._fb);
    }
  }

  async ngOnInit() {
    // this.detailsChanged = 0;
    this.yesNoList = this._globalService.$yesnoList;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.feeErrorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) { // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.transFeeFormRecord) {
    //     this.setToLocalModel();

    //   } else {
    //     this.transFeeFormLocalModel = this._feeService.getReactiveModel(this._fb);
    //     this.transFeeFormLocalModel.markAsPristine();
    //   }
    // }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.feeErrorList.emit(temp);
    }
    // if (changes['transFeeFormLocalModel']) {
    //   console.log('**********the Transaction fees changed');
    //   this.transFeeFormRecord = this.transFeeFormLocalModel;
    // }
    if (changes['transFeeModel']) {
      const dataModel = changes['transFeeModel'].currentValue;
      if (!this.transFeeFormLocalModel) {
        this.transFeeFormLocalModel = this._feeService.getReactiveModel(this._fb);
        this.transFeeFormLocalModel.markAsPristine();
      }
      this._feeService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transFeeFormLocalModel));
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  // setToLocalModel() {
  //   this.transFeeFormLocalModel = this.transFeeFormRecord;
  //   if (!this.transFeeFormLocalModel.pristine) {
  //     this.transFeeFormLocalModel.markAsPristine();
  //   }
  // }

  onblur() {
    // console.log('input is typed');
    this._feeService.mapFormModelToDataModel((<FormGroup>this.transFeeFormLocalModel),
      this.transFeeModel);
  }


  hasFeeYes() {
    if (this.transFeeFormLocalModel.controls['hasFees'].value) {
      if (this.transFeeFormLocalModel.controls['hasFees'].value === "GlobalsService.YES") {
        return true;
      } else {
        this.transFeeFormLocalModel.controls['billCompanyId'].setValue(null);
        this.transFeeFormLocalModel.controls['billCompanyId'].markAsUntouched();
        this.transFeeFormLocalModel.controls['billContactId'].setValue(null);
        this.transFeeFormLocalModel.controls['billContactId'].markAsUntouched();
        // todo: add more fields under hasfees here ???
      }
    }
    return false;
  }
  
}
