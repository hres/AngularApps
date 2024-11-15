import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, ICode, UtilsService, HelpSequence } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { NO } from '../app.constants';
import { RegulatoryContactService } from './regulatory-contact.service';
import { IContact, IContactInformation, INameAddress } from '../models/transaction';
import { AddressDetailsComponent } from '../address/address.details/address.details.component';
import { ContactDetailsComponent } from '../contact/contact.details/contact.details.component';
import { AppSignalService } from '../signal/app-signal.service';

@Component({
  selector: 'app-regulatory-contact',
  templateUrl: './regulatory-contact.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryContactComponent extends BaseComponent implements OnInit{
  lang:string;
  helpIndex: HelpSequence;
  
  public regulatoryContactInfoForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: IContactInformation;
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
    private _utilsService: UtilsService, private _globalService: GlobalService, private _signalService:AppSignalService) {
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
    // Organize the error list
    if (this._addressErrorList) {
      errors = [...errors, ...this._addressErrorList];
    }
    errors = [...errors, ...this._contactErrorList];
    errors = this._placeErrorLast(errors, this.placeErrorLast);
    this.errorList.emit(errors);
  }

  private _emitCombinedErrors(errors: any[]): void {
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
        const dataModelCurrentValue = changes['dataModel'].currentValue as IContactInformation;
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
    } else {
      this.showCompanyAndAddress = true;
      this._signed3rdPartyChanged = true;
    }
    this._signalService.setSigned3rdParty(isSigned);
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
    this._addressErrorList = childErrors;
    if (this._signed3rdPartyChanged) {
      this._appendChildAndParentErrors();
    }
  }

  processContactErrors(childErrors:any[]) {
    this._contactErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  private _appendChildAndParentErrors() {
    this._childrenErrors = [];
    this._childrenErrors = this._childrenErrors.concat(this._addressErrorList.concat(this._contactErrorList));
    const parentErrors = this.msgList.toArray();
    const combinedErrors = [...parentErrors, ...this._childrenErrors];
    this._emitCombinedErrors(combinedErrors);  // Call the abstract method
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
}
