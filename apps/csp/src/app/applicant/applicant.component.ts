import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {  UtilsService,  HelpSequence,  BaseComponent, ICode,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ApplicantService } from './applicant-service';
import { AddressDetailsComponent, ContactDetailsComponent } from '@hpfb/pbv';
import { IContactCSP, INameAddressCSP } from '../models/transaction';
import { ADDR_CONT_TYPE } from '../app.constants';

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
  @Input() applicantAddressModel: INameAddressCSP;
  @Input() applicantContactModel: IContactCSP;
  @Input() billingAddressModel: INameAddressCSP;
  @Input() billingContactModel: IContactCSP;
  @Output() errorList = new EventEmitter(true);
  public applicantInformationForm: FormGroup;
  public applicant: string = ADDR_CONT_TYPE.APPLICANT;
  public billing: string = ADDR_CONT_TYPE.BILLING;

  private _addressErrorList: any[];
  private _contactErrorList: any[];
  private _billingAddressErrorList: any[] = [];
  private _billingContactErrorList: any[] = [];
  private _childrenErrors: any[] = [];

  @ViewChild(AddressDetailsComponent) addressDetailsComponent: AddressDetailsComponent;
  @ViewChild(ContactDetailsComponent) contactDetailsComponent: ContactDetailsComponent;

  constructor(
    private _fb: FormBuilder,
    private _globalService: GlobalService,
       private _utilsService: UtilsService
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

  ngOnChange(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
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

  getAddressFormValue() {
    return this.addressDetailsComponent.getFormValue();
  }

  getContactFormValue() {
    return this.contactDetailsComponent.getFormValue();
  }
}
