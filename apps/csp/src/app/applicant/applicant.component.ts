import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {  UtilsService,  HelpSequence,  BaseComponent, ICode,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ApplicantService } from './applicant-service';
import { AddressDetailsComponent, ContactDetailsComponent } from '@hpfb/pbv';
import { IContact, INameAddress } from '@hpfb/pbv'
import { ADDR_CONT_TYPE } from '../app.constants';
import { IApplicant } from '../models/transaction';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ApplicantComponent extends BaseComponent implements OnInit {
  public showFieldErrors: boolean = false;
  lang: string;
  languageList: ICode[] = [];
  provinceList: ICode[] = [];
  countryList: ICode[] = [];

  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Input() applicantModel: IApplicant;
  @Input() billingModel: IApplicant;
  @Input() applicantAddressModel: INameAddress;
  @Input() applicantContactModel: IContact;
  @Input() billingAddressModel: INameAddress;
  @Input() billingContactModel: IContact;
  @Output() errorList = new EventEmitter(true);
  public applicantInformationForm: FormGroup;
  public applicant: string = ADDR_CONT_TYPE.APPLICANT;
  public billing: string = ADDR_CONT_TYPE.BILLING;

  private _addressErrorList: any[];
  private _contactErrorList: any[];
  private _billingAddressErrorList: any[] = [];
  private _billingContactErrorList: any[] = [];
  private _childrenErrors: any[] = [];

  @ViewChildren(ContactDetailsComponent) contactComponents: QueryList<ContactDetailsComponent>;
  @ViewChildren(AddressDetailsComponent) addressComponents: QueryList<AddressDetailsComponent>;

  // Fields to store individual component instances
  applicantContact: ContactDetailsComponent;
  billingContact: ContactDetailsComponent;
  applicantAddress: AddressDetailsComponent;
  billingAddress: AddressDetailsComponent;

  constructor(
    private _fb: FormBuilder,
    private _globalService: GlobalService,
    private _utilsService: UtilsService,
    private _applicantService: ApplicantService
  ) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.languageList = this._globalService.languageList;
    this.provinceList = this._globalService.provinceList;
    this.countryList = this._globalService.countryList;

    if (!this.applicantInformationForm) {
      this.applicantInformationForm = ApplicantService.getApplicantInformationForm(
        this._fb
      );
    }
  }

  ngAfterViewChecked() {
    // Trigger change detection to ensure @ViewChildren is populated after view initialization
    if (this.contactComponents && this.contactComponents.length > 0) {
      const contactArray = this.contactComponents.toArray();
      this.applicantContact = contactArray[0];
      if (contactArray.length > 1) {
        this.billingContact = contactArray[1];
      }
    }

    if (this.addressComponents && this.addressComponents.length > 0) {
      const addressArray = this.addressComponents.toArray();
      this.applicantAddress = addressArray[0];
      if (addressArray.length > 1) {
        this.billingAddress = addressArray[1];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (!isFirstChange) {
      if (changes['applicantModel']) {
        const applicantModel = changes['applicantModel'].currentValue as IApplicant;
        const billingModel = changes['billingModel'].currentValue as IApplicant;

        console.log(applicantModel, billingModel)

        this._applicantService.mapDataModelToFormModel(applicantModel, billingModel, (<FormGroup>this.applicantInformationForm))
      }
    }
  }

  showBilling() {
    return this.applicantInformationForm.controls['isBillingDifferent'].value == true;
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  processAddressErrors(childErrors:any[]) {
    this._addressErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  processContactErrors(childErrors:any[]) {
    this._contactErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  processBillingAddressErrors(childErrors: any[]): void {
    this._billingAddressErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  processBillingContactErrors(childErrors: any[]): void {
    this._billingContactErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  private _appendChildAndParentErrors() {
    this._childrenErrors = [];
    this._childrenErrors = this._childrenErrors.concat(
      (this._contactErrorList ?? []).concat(
        (this._addressErrorList ?? []).concat(
          (this._billingContactErrorList ?? []).concat(this._billingAddressErrorList ?? [])
        )
      )
    );
  
    const parentErrors = this.msgList?.toArray() ?? [];
    const combinedErrors = [...parentErrors, ...this._childrenErrors];
    this._emitCombinedErrors(combinedErrors); 
  }

  private _emitCombinedErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.applicantInformationForm.value;
  }

  getApplicantAddressFormValue() {
    return this.applicantAddress.getFormValue();
  }

  getApplicantContactFormValue() {
    return this.applicantContact.getFormValue();
  }

  getBillingAddressFormValue() {
    return this.billingAddress? this.billingAddress.getFormValue() : null;
  }

  getBillingContactFormValue() {
    return this.billingContact? this.billingContact.getFormValue() : null;
  }
}
