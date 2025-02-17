import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, CheckboxOption, ICodeDefinition, UtilsService, HelpSequence, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppSignalService } from '../signal/app-signal.service';
import { CompanyEnrolmentService } from './company-enrolment.service';
import { CompanyEnrol } from '../models/Company';
import { ENROLMENT_STATUS } from '../app.constants';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-company-enrolment',
  templateUrl: './company-enrolment.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompanyEnrolmentComponent extends BaseComponent implements OnInit{

  public lang: string;
  helpIndex: HelpSequence; 
  public showFieldErrors: boolean = false;

  public companyEnrolmentForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Input() isInternal: boolean;
  @Output() errorList = new EventEmitter(true);
  @Output() productUpdated = new EventEmitter<CheckboxOption[]>();

  private _signalService = inject(AppSignalService)

  public disableAmendButton: boolean = true;
  public showAmendNote: boolean = false;

  public productLineOptionList: CheckboxOption[] = [];
  public productLineCodeList: ICode[] = [];

  constructor(private _companyEnrolmentService: CompanyEnrolmentService, 
              private _fb: FormBuilder, 
              private _utilsService: UtilsService, 
              private _globalService: GlobalService,
              private _converterService : ConverterService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;
    this.productLineCodeList = this._globalService.productLineList;
    console.log(this.productLineCodeList);
    console.log(this.productLineOptionList);

    this._getCompanyEnrolmentForm();
    this._companyEnrolmentService.setEnrolmentStatus(this.companyEnrolmentForm, this.companyEnrolmentForm.controls['enrolmentStatus'].value, enrolmentStatusesList, this.lang, false);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }

    console.log('ngOnChanges triggered:', changes);  
    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;
      this.dataModel = dataModelCurrentValue;

      if (!isFirstChange) {
        this._companyEnrolmentService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this._getCompanyEnrolmentForm());
        this._companyEnrolmentService.mapProductModelToFormModel(dataModelCurrentValue, this.companyEnrolmentForm, this.productLineCodeList,  this.productLineOptionList, this.lang);
      }
      
      this.activateAmendButton();
    }
  }

  private _getCompanyEnrolmentForm(){
    if (!this.companyEnrolmentForm) {
      this.companyEnrolmentForm = CompanyEnrolmentService.getEnrolmentForm(this._fb);
    }
    this._updateProductLineArray();
    
    return this.companyEnrolmentForm;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  activateAmendButton() {
    if (this.companyEnrolmentForm) {
      if (!this.isInternal && 
        this.companyEnrolmentForm.controls['enrolmentStatus'].value == ENROLMENT_STATUS.FINAL) {
        this.disableAmendButton = false;
      } 
    }
    this.disableAmendButton = true;
  }

  setAmendState() {
    this.showAmendNote = true;
    this.companyEnrolmentForm.controls['enrolmentStatus'].setValue(ENROLMENT_STATUS.AMEND);
  }

  getFormValue() {
    return this.companyEnrolmentForm.value;
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.companyEnrolmentForm.controls[controlNames[i]]);
    }
  }

  get productLineChkFormArray() {
    return this.companyEnrolmentForm.get('productLine') as FormArray
  }

  get selectedProductLineCodes(): string[] {
    return this._companyEnrolmentService.getProductLineCodes(this.productLineOptionList, this.productLineChkFormArray);
  }

  get productLine(): FormArray {
    return this.companyEnrolmentForm.get('productLine') as FormArray;
  }

  productLineOnChange(e: any, selectedProductLine : any) {
    // console.log(this.selectedProductLineCodes);
    this.companyEnrolmentForm.controls['selectedProductLines'].setValue(this.selectedProductLineCodes);
    const isChecked = (e.target as HTMLInputElement).checked;

    if (isChecked) {
      this._signalService.updateProductLine(selectedProductLine);
    } else {
      this._signalService.removeProductLine(selectedProductLine);
    }
  }

  private _updateProductLineArray() {
    const productLineList = this._globalService.productLineList;
    this.productLineOptionList = productLineList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    if (this.productLineChkFormArray.length === 0) {
      this.productLineOptionList.forEach(() => {
        this.productLineChkFormArray.push(new FormControl(false));
      });
    }
    
    this.productUpdated.emit(this.productLineOptionList);
  }
}
