import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, ICode, UtilsService, HelpSequence } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { NO, YES } from '../app.constants';
import { RegulatoryContactService } from './regulatory-contact.service';
import { AppSignalService } from '../signal/app-signal.service';
import { TransactionEnrol } from '../models/transaction';
import { AddressDetailsComponent, ContactDetailsComponent, IContact, INameAddress } from '@hpfb/pbv';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-regulatory-contact',
  templateUrl: './regulatory-contact.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class RegulatoryContactComponent extends BaseComponent implements OnInit{
  lang:string;
  languageList: ICode[] = [];
  countryList: ICode[] = [];
  provinceList: ICode[] = [];
  stateList: ICode[] = [];
  helpIndex: HelpSequence;

  public regulatoryContactInfoForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: TransactionEnrol;
  @Input() addressModel: INameAddress;
  @Input() contactModel: IContact;
  @Output() errorList = new EventEmitter(true);

  @ViewChild(AddressDetailsComponent) addressDetailsComponent: AddressDetailsComponent;
  @ViewChild(ContactDetailsComponent) contactDetailsComponent: ContactDetailsComponent;

  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;
  private _addressErrorList: any[];
  private _contactErrorList: any[];
  private _childrenErrors: any[] = [];

  showThirdPartyNote : boolean = false;
  placeErrorLast = "confirmContactValid";
  showCompanyAndAddress : boolean = true;
  private _signed3rdPartyChanged : boolean = false;

  constructor(private _regulatoryContactService: RegulatoryContactService, private _fb: FormBuilder,
    private _utilsService: UtilsService, private _globalService: GlobalService, private _signalService:AppSignalService, private _translateService : TranslateService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    if (!this.regulatoryContactInfoForm) {
      this.regulatoryContactInfoForm = RegulatoryContactService.getContactForm(this._fb);
    }
    this.lang = this._globalService.currLanguage;
    this.languageList = this._globalService.languageList;
    this.countryList = this._globalService.countryList;
    this.provinceList = this._globalService.provinceList;
    this.stateList = this._globalService.stateList;

    this.yesNoList = this._globalService.yesnoList;
  }

  protected override emitErrors(errors: any[]): void {
    errors = this.msgList.toArray();
    errors = errors.concat(this._addressErrorList);
    errors = errors.concat(this._contactErrorList)
    errors = this._placeErrorLast(errors, this.placeErrorLast);
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
        const dataModelCurrentValue = changes['dataModel'].currentValue as TransactionEnrol;
        this._regulatoryContactService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulatoryContactInfoForm);

          this.isSigned3rdPartyOnChange();
        // this.onMfTypeSelected(null);
        // this.onTxDescriptionSelected(null);
        // this.reqRevisionChanged(null);
      }
    }
  }

  isSigned3rdPartyOnChange() {
    const isSigned = this.regulatoryContactInfoForm.get('isSigned3rdParty').value;
    if (isSigned == NO) {
      this.showCompanyAndAddress = false;
      this._addressErrorList = [];
      this._signed3rdPartyChanged = false;
      this._utilsService.resetControlsValues(this.regulatoryContactInfoForm.controls['companyName']);
    } else {
      this.showCompanyAndAddress = true;
      this._signed3rdPartyChanged = true;
    }
    this._signalService.setSigned3rdParty(isSigned);
  }

  showAutLetterNote() {
    const isSigned = this.regulatoryContactInfoForm.get('isSigned3rdParty');

    if (isSigned.value) {
      if (isSigned.value == YES) {
        return true;
      }
    }
    return false;
  }

  getFormValue() {
    return this.regulatoryContactInfoForm.value;
  }

  getAddressFormValue() {
    return this.addressDetailsComponent.getFormValue();
  }

  getContactFormValue() {
    return this.contactDetailsComponent.getFormValue();
  }

  processAddressErrors(childErrors:any[]) {
    // this._addressErrorList = childErrors;
    this._addressErrorList = (childErrors || []).map(error => {
      const translationKey = error?.label || '';
      const fieldLabel = this.getFieldLabel(translationKey);

      // Set both label and currentError
      error.label = fieldLabel;
      error.currentError = 'This field is required';

      return error;
  });
    this._appendErrorsFromChild(this._addressErrorList);
  }

  processContactErrors(childErrors:any[]) {
   // this._contactErrorList = childErrors;

    this._contactErrorList = (childErrors || []).map(error => {
      const translationKey = error?.label || '';
      const fieldLabel = this.getFieldLabel(translationKey);

      // Set both label and currentError
      error.label = fieldLabel;
      error.currentError = 'This field is required';

      return error;
  });
    this._appendErrorsFromChild(this._contactErrorList);
  }

    /**
   * Override _appendErrorsFromChild to ensure all errors have messages
   */
    protected override _appendErrorsFromChild(errorsList: any[]) {
      const allErrors =errorsList.map(error => {
          const translationKey = error?.label || '';
          const fieldLabel = this.getFieldLabel(translationKey);
          error.label = fieldLabel;
          error.currentError = 'This field is required';
          return error;
      });

      this.emitErrors(allErrors);
    }


  private _placeErrorLast(errors, controlIdToMove) : any[] {
    const index = errors.findIndex(error => error.controlId === controlIdToMove);

    // If the element is found and it's not already at the last position
    if (index !== -1 && index !== errors.length - 1) {
      // Remove the element from its current position
      const [removedElement] = errors.splice(index, 1);

      // Add the element back at the end of the array
      errors.push(removedElement);
    }

    return errors;
  }

    // ==================== THE FIX when using angular 22====================

    private getFieldLabel(translationKey: string): string {
      if (!translationKey) return 'This field';

      // Use the translation service to get the actual label
      const translated = this._translateService.instant(translationKey);

      // If translation returns the key itself, it means translation is not available
      if (translated === translationKey) {
          // Fallback: extract from key
          let cleanLabel = translationKey;
          if (cleanLabel.includes('.')) {
              const parts = cleanLabel.split('.');
              let lastPart = parts[parts.length - 1];
              lastPart = lastPart.replace(/([A-Z])/g, ' $1').trim();
              cleanLabel = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
          }
          return cleanLabel || 'This field';
      }

      return translated;
  }
}
