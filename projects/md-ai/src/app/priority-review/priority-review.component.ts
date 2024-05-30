import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ICode, UtilsService, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { PriorityReviewService } from './priority-review.service';

@Component({
  selector: 'app-priority-review',
  templateUrl: './priority-review.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PriorityReviewComponent {
  public priorityReviewLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() priorityRevModel;

  @Input() helpTextSequences;
  @Output() priorityRevErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  
  public yesNoList: ICode[] = [];
  public seriousDiagnosisReasonOptionList: CheckboxOption[] = [];
  public diagnosisReasonCodeList: ICode[] = [];

  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private _fb : FormBuilder,
              private _globalService : GlobalService,
              private _priorityRevService : PriorityReviewService,
              private _converterService : ConverterService,
              private _utilsService : UtilsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
    if (!this.priorityReviewLocalModel) {
      this.priorityReviewLocalModel = this._priorityRevService.getReactiveModel(this._fb);
    }
  }

  async ngOnInit() {
    this.yesNoList = this._globalService.$yesNoList;
    this.diagnosisReasonCodeList = this._globalService.$diagnosisReasonList;
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
    this.priorityRevErrorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.priorityRevErrorList.emit(temp);
    }
    if (changes['priorityRevModel']) {
      const dataModel = changes['priorityRevModel'].currentValue;
      if (!this.priorityReviewLocalModel) {
        this.priorityReviewLocalModel = this._priorityRevService.getReactiveModel(this._fb);
        this.priorityReviewLocalModel.markAsPristine();
      }
      this._priorityRevService.mapDataModelToFormModel(dataModel, this.priorityReviewLocalModel, this.diagnosisReasonCodeList,  this.seriousDiagnosisReasonOptionList, this.lang);
    }
  }

  priorityRequestedOnChange() {
    if (this.priorityReviewLocalModel.controls['isPriorityReq'].value &&
          this.priorityReviewLocalModel.controls['isPriorityReq'].value === YES) {
      this._updateDiagnosisReasonArray();
    } else {
      this._utilsService.resetControlsValues(
        this.diagnosisReasonChkFormArray,
        this.priorityReviewLocalModel.controls['selectedDiagnosisCodes'],
      );
    }
  }

  showDiagnosisReasons() {
    if (this.priorityReviewLocalModel.controls['isPriorityReq'].value &&
          this.priorityReviewLocalModel.controls['isPriorityReq'].value === YES) {
         return true;
    }
    else {
      this._utilsService.resetControlsValues(this.priorityReviewLocalModel.controls['diagnosisReasons']);
    }
    return false;
  }

  seriousDiagnosisOnChange() {
    this.priorityReviewLocalModel.controls['selectedDiagnosisCodes'].setValue(this.selectedDiagnosisCodes);
  }

  private _updateDiagnosisReasonArray() {
    const diagnosisReasonList = this._globalService.$diagnosisReasonList;
    this.seriousDiagnosisReasonOptionList = diagnosisReasonList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    this.seriousDiagnosisReasonOptionList.forEach(() => this.diagnosisReasonChkFormArray.push(new FormControl(false)));
  } 

  get diagnosisReasonChkFormArray() {
    return this.priorityReviewLocalModel.controls['diagnosisReasons'] as FormArray

  }

  get selectedDiagnosisCodes(): string[] {
    return this._priorityRevService.getSelectedDiagnosisCodes(this.seriousDiagnosisReasonOptionList, this.diagnosisReasonChkFormArray);
  }
}
