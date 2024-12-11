import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {  UtilsService,  HelpIndex,  BaseComponent, ICode,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ApplicantService } from './applicant-service';
import { IContact, INameAddress } from '@hpfb/pbv';

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

  @Input() showErrors: boolean;
  @Input() addressModel: INameAddress;
  @Input() contactModel: IContact;
  @Output() errorList = new EventEmitter(true);
  public applicantInformationForm: FormGroup;

  private _addressErrorList: any[];
  private _contactErrorList: any[];
  private _childrenErrors: any[] = [];

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
    this.languageList = this._globalService.languageList;
    this.provinceList = this._globalService.provinceList;
    this.countryList = this._globalService.countryList;

    if (!this.applicantInformationForm) {
      this.applicantInformationForm = ApplicantService.getApplicantInformationForm(
        this._fb
      );
    }
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

  private _appendChildAndParentErrors() {
    this._childrenErrors = [];
    this._childrenErrors = this._childrenErrors.concat(this._addressErrorList.concat(this._contactErrorList));
    const parentErrors = this.msgList.toArray();
    const combinedErrors = [...parentErrors, ...this._childrenErrors];
    this._emitCombinedErrors(combinedErrors);  // Call the abstract method
  }

  private _emitCombinedErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.applicantInformationForm.value;
  }
}
