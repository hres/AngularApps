import { Component, computed, EventEmitter, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, CheckboxOption, ControlMessagesComponent, ConverterService, ErrorModule, FileIoModule, HelpSequence, ICode, ICodeDefinition, UtilsService, YES } from '@hpfb/sdk/ui';
import { DrugProductEnrol } from '../models/ProductInformation';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ProductInformationService } from './product-information.service';


@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,



})
export class ProductInformationComponent extends BaseComponent implements OnInit{

 helpIndex: HelpSequence;

  @Input() showErrors: boolean;
  @Input() dataModel: DrugProductEnrol;
  @Output() errorList = new EventEmitter(true);


  public showFieldErrors: boolean = false;
  public productInfoForm: FormGroup;
  public schedule_claim_group: FormGroup;
  dossierTypeOptions: ICodeDefinition[] = [];
  drugUseOptions: ICodeDefinition[] = [];
  public yesNoList: ICode[] = [];
  subTypeOptions: ICodeDefinition[] = [];
  scheduleClaimCodeList:ICode[] = [];
  scheduleClaimOptionList: CheckboxOption[] = [];
  disinfectantTypeOptionList: CheckboxOption[] = [];
  disinfectantTypeCodeList:ICode[] = [];


  private _specySubTypeErrors = [];

  adminSubSelected = signal('');
  isAdminSub: Signal<boolean> = computed(() => {
    return this.adminSubSelected() === 'Y';
  });
  selectedAdminSubTypeDefinition: string = '';
  protected showDisinfectantType = false;
  protected showSpeciesForVerterinary = false;

  lang = this._globalService.lang();
  constructor(private _utilsService: UtilsService, private _fb: FormBuilder, private _globalService: GlobalService, private _productInfoService: ProductInformationService,   private _converterService : ConverterService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.productInfoForm) {
      this.productInfoForm = ProductInformationService.getProductInfoForm(this._fb);

    }

    this.dossierTypeOptions = this._globalService.dossierTypes;
    this.yesNoList = this._globalService.yesnoList;
    this.subTypeOptions = this._globalService.subTypeList;
    this.drugUseOptions = this._globalService.drugUse;
    this.scheduleClaimCodeList = this._globalService.scheduleClaims;
    this.disinfectantTypeCodeList =  this._globalService.disinfectTypes;


  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as DrugProductEnrol;
        // this.lifecycleRecordModel = dataModelCurrentValue.ectd.lifecycle_record;
        this._updateScheduleClaimArray();
        this._updateDisinfectantTypeClaimArray();
        this._productInfoService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this.productInfoForm, this.scheduleClaimOptionList);

        // this.onDossierTypeSelected(this.regulartoryInfoForm.controls['dossierType'].value);
        this.onAdminSubSelected(this.productInfoForm.controls['isAdminSub'].value, true);
        this.onSubTypeSelected(this.productInfoForm.controls['subType'].value);


      }
    }

  }

  onAdminSubSelected(selectedAdminSubId: string, isProgrammaticUpdate: boolean) {
    this.adminSubSelected.set( selectedAdminSubId );
    if (!isProgrammaticUpdate){ // if the event is triggered from the UI
      const valuesToReset = ['subType'];
      this._resetControlValues(valuesToReset);
      this.selectedAdminSubTypeDefinition = '';
    }
  }

  onSubTypeSelected(selectedAdminSubTypeId: string) {
    this.selectedAdminSubTypeDefinition = this._getCodeDefinition(this.subTypeOptions, selectedAdminSubTypeId);
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    const productInfoFormValues = this.productInfoForm.value;

    return { ...productInfoFormValues};
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.productInfoForm.controls[controlNames[i]]);
    }
  }

  private _getCodeDefinition(codeDefinitionList: ICodeDefinition[], id: string){
    return this._utilsService.getCodeDefinitionByIdByLang(id, codeDefinitionList, this.lang)
  }


  getSelectedScheduleClaimCodes(seriousDiagnosisReasonList: CheckboxOption[], diagnosisReasonChkFormArray: FormArray) : string[] {
    return this._converterService.getCheckedCheckboxValues(seriousDiagnosisReasonList, diagnosisReasonChkFormArray);
  }

  get selectedScheduleClaimCodes(): string[] {
    return this.getSelectedScheduleClaimCodes(this.scheduleClaimOptionList, this.scheduleClaimChkFormArray);
  }

  getSelectedDisintectfectTypeCodes(seriousDiagnosisReasonList: CheckboxOption[], diagnosisReasonChkFormArray: FormArray) : string[] {
    return this._converterService.getCheckedCheckboxValues(seriousDiagnosisReasonList, diagnosisReasonChkFormArray);
  }

  get selectedDisinfectantTypeCodes(): string[] {
    return this.getSelectedDisintectfectTypeCodes(this.disinfectantTypeOptionList, this.scheduleClaimChkFormArray);
  }


showScheduleClaimApplied() {

  if (this.productInfoForm.controls['isNonPrescriptioScheduleApplied'].value &&
        this.productInfoForm.controls['isNonPrescriptioScheduleApplied'].value === true) {
       return true;
  }
  else {
    this._utilsService.resetControlsValues(this.productInfoForm.controls['scheduleClaims']);
  }
  return false;
}

showDisinfectantTypesOrSpecies(){
  this.showDisinfectantType = false;
  this.showSpeciesForVerterinary = false;

  if (this.productInfoForm.controls['drugUse'].value ){
        if (this.productInfoForm.controls['drugUse'].value === 'DISINFECT') {
          this.showDisinfectantType = true;
        }

        if (this.productInfoForm.controls['drugUse'].value === 'VET') {
          this.showSpeciesForVerterinary = true;
        }
  }
  else {
    this._utilsService.resetControlsValues(this.productInfoForm.controls['disinfectantTypes']);
  }

}


get scheduleClaimChkFormArray() {
  return this.productInfoForm.controls['scheduleClaims'] as FormArray
}

get disinfectantTypeChkFormArray() {
  return this.productInfoForm.controls['disinfectantTypes'] as FormArray
}


private _updateScheduleClaimArray() {
  const scheduleClaimList = this._globalService.scheduleClaims;
  this.scheduleClaimOptionList = scheduleClaimList.map((item) => {
    return this._converterService.convertCodeToCheckboxOption(item, this.lang);
  });

  this.scheduleClaimOptionList.forEach(() => this.scheduleClaimChkFormArray.push(new FormControl(false)));
}

private _updateDisinfectantTypeClaimArray() {
  const disinfectantList = this._globalService.disinfectTypes;
  this.disinfectantTypeOptionList = disinfectantList.map((item) => {
    return this._converterService.convertCodeToCheckboxOption(item, this.lang);
  });

  this.disinfectantTypeOptionList.forEach(() => this.disinfectantTypeChkFormArray.push(new FormControl(false)));
}

scheduleClaimOnChange() {
  this.productInfoForm.controls['selectedDisinfectantTypeCodes'].setValue(this.selectedDisinfectantTypeCodes);
}

disinfectantTypeOnChange() {
  this.productInfoForm.controls['selectedDisinfectTypeCodes'].setValue(this.selectedDisinfectantTypeCodes);
}


drugUseChangeRequestedOnChange() {

  this.showDisinfectantTypesOrSpecies();
  if(this.showDisinfectantType){
      this._updateDisinfectantTypeClaimArray();
  } else {
    this._utilsService.resetControlsValues(
      this.scheduleClaimChkFormArray,
      this.productInfoForm.controls['selectedDisinfectantTypeCodes'],
    );
  }


}


nonPrescriptioScheduleAppliedRequestedOnChange() {
  if (this.productInfoForm.controls['isNonPrescriptioScheduleApplied'].value &&
        this.productInfoForm.controls['isNonPrescriptioScheduleApplied'].value === true) {
    this._updateScheduleClaimArray();
  } else {
    this._utilsService.resetControlsValues(
      this.scheduleClaimChkFormArray,
      this.productInfoForm.controls['selectedScheduleClaimCodes'],
    );
  }
}


updateErrorList(errs) {
 // console.log("updateErrorList", errs)
 this.errorList = errs;
}

}

