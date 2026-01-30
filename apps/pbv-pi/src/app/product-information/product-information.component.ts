import { Component, computed, EventEmitter, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, HelpSequence, ICode, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { DrugProductEnrol } from '../models/ProductInformation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ProductInformationService } from './product-information.service';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ProductInformationComponent extends BaseComponent implements OnInit{

  lang: string;
  helpIndex: HelpSequence;

  @Input() showErrors: boolean;
  @Input() dataModel: DrugProductEnrol;
  @Output() errorList = new EventEmitter(true);


  public showFieldErrors: boolean = false;
  public productInfoForm: FormGroup;
  dossierTypeOptions: ICodeDefinition[] = [];
  drugUseOptions: ICodeDefinition[] = [];
  public yesNoList: ICode[] = [];
  subTypeOptions: ICodeDefinition[] = [];

  adminSubSelected = signal('');
  isAdminSub: Signal<boolean> = computed(() => {
    return this.adminSubSelected() === 'Y';
  });
  selectedAdminSubTypeDefinition: string = '';

  constructor(private _utilsService: UtilsService, private _fb: FormBuilder, private _globalService: GlobalService, private _productInfoService: ProductInformationService) {
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
        this._productInfoService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this.productInfoForm);

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
}


