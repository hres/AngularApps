import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, ICode, NO, UtilsService, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { RegulatoryContactService } from './regulatory-contact.service';
import { IContact, IContactInformation, INameAddress } from '../models/transaction';

@Component({
  selector: 'app-regulatory-contact',
  templateUrl: './regulatory-contact.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryContactComponent extends BaseComponent implements OnInit{
  lang:string;
  helpIndex: HelpIndex;
  
  public regulatoryContactInfoForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: IContactInformation;
  @Input() addressModel: INameAddress;
  @Input() contactModel: IContact;
  @Output() errorList = new EventEmitter(true);
  @Output() contactErrorList = new EventEmitter(true);
  @Output() addressErrorList = new EventEmitter(true);

  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;

  showThirdPartyNote : boolean = false;

  constructor(private _regulatoryContactService: RegulatoryContactService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    if (!this.regulatoryContactInfoForm) {
      this.regulatoryContactInfoForm = RegulatoryContactService.getContactForm(this._fb);
    }
    this.yesNoList = this._globalService.yesnoList;
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // console.log("RegulatoryInformationComponent ~ ngOnChanges ~ isFirstChange:", isFirstChange);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as IContactInformation;
        this._regulatoryContactService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulatoryContactInfoForm);

        // this.onMfTypeSelected(null);
        // this.onTxDescriptionSelected(null);
        // this.reqRevisionChanged(null);
      }
    }
  }

  showCompanyNameFieldAndAddressDetails() {
    if (this.regulatoryContactInfoForm['isSigned3rdParty']) {
      if (this.regulatoryContactInfoForm['isSigned3rdParty'].value == NO) {
        return false;
      }
      return true;
    }
    return true;
  }

  getFormValue() {
    return this.regulatoryContactInfoForm.value;
  }

  processAddressErrors(errorList) {
    this.addressErrorList.emit(errorList);
  }

  processContactErrors(errorList) {
    this.contactErrorList.emit(errorList);
  }
}
