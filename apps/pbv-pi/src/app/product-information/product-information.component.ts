import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, HelpSequence, ICode, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { ProductInformation } from '../models/ProductInformation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ProductInformationService } from './product-information.service';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductInformationComponent extends BaseComponent implements OnInit{

  lang: string;
  helpIndex: HelpSequence; 

  @Input() showErrors: boolean;
  @Input() dataModel: ProductInformation;
  @Output() errorList = new EventEmitter(true);


  public showFieldErrors: boolean = false;
  public productInfoForm: FormGroup;
  dossierTypeOptions: ICodeDefinition[] = [];
  public yesNoList: ICode[] = [];
  
  constructor(private _utilsService: UtilsService, private _fb: FormBuilder, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.productInfoForm) {
      this.productInfoForm = ProductInformationService.getRegularInfoForm(this._fb);
    }

    this.dossierTypeOptions = this._globalService.dossierTypes;
    this.yesNoList = this._globalService.yesnoList;
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        // const dataModelCurrentValue = changes['dataModel'].currentValue as TransactionEnrol;
        // this.lifecycleRecordModel = dataModelCurrentValue.ectd.lifecycle_record;
        // this._regulatoryInfoService.mapDataModelToFormModel(
        //   dataModelCurrentValue,
        //   <FormGroup>this.regulartoryInfoForm);

        // this.onDossierTypeSelected(this.regulartoryInfoForm.controls['dossierType'].value); 
        // this.onAdminSubmissionSelected(this.regulartoryInfoForm.controls['isAdminSubmission'].value, true);
        // this.onAdminSubTypeSelected(this.regulartoryInfoForm.controls['adminSubType'].value);
      }
    }
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }
}
