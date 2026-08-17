import {Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, HostListener, ViewChildren, QueryList, inject, ViewChild, signal, Signal, computed, effect, viewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, ControlMessagesComponent, ConvertResults, HelpSequence, CHECK_SUM_CONST, PopupComponent } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FILE_OUTPUT_PREFIX, ENROLMENT_STATUS, ROOT_TAG, START_CHECKSUM_VERSION, VERSION_TAG_PATH, XSLT_PREFIX, YES, REVERSE_ROLE_MAPPING, ROLE_CODES, EXTERNAL_OUTPUT_PREFIX, INTERNAL_OUTPUT_PREFIX } from '../app.constants';
import { FormBaseService } from './form-base.service';
import { CompanyEnrol, Company, ContactRecord, AddressRecord} from '../models/Company';
import { AppSignalService } from '../signal/app-signal.service';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { CompanyEnrolmentComponent } from '../company-enrolment/company-enrolment.component';
import { ProductLineComponent } from '../product-line/product-line.component';
import { CompanyContactModule } from "../company-contact/company-contact.module";
import { CompanyContactListComponent } from '../company-contact/company-contact-list/company-contact-list.component';
import { CompanyContactService } from '../company-contact/company-contact.service';
import { CompanyAddressModule } from "../company-address/company-address.module";
import { CompanyAddressListComponent } from '../company-address/company-address-list/company-address-list.component';
import { CompanyAddressService } from '../company-address/company-address.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService, FormBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent, CompanyContactModule, CompanyAddressModule, PopupComponent]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  lang: string;
  helpIndex: HelpSequence;
  devEnv: boolean;
  byPassCheckSum: boolean;
  isInternal: boolean;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  @ViewChild(CompanyEnrolmentComponent) companyEnrolmentComponent: CompanyEnrolmentComponent;
  @ViewChild(CompanyContactListComponent) companyContactListComponent: CompanyContactListComponent;
  @ViewChild(CompanyAddressListComponent) companyAddressListComponent: CompanyAddressListComponent;
  @ViewChild(ProductLineComponent) productLineComponent: ProductLineComponent;


  private _companyEnrolmentErrors = [];
  private _contactListErrors = [];
  private _contactCompanyRoleErrors = [];
  private _addressListErrors = [];
  private _addressCompanyRoleErrors = [];
  private _productLineErrors = [];
  private _consentPrivacyError = [];

  public coForm: FormGroup;
  public errorList = [];
  public showErrors: boolean;

  public headingLevel = 'h2';

  public enrollModel: Company;
  public companyEnrolModel: CompanyEnrol;
  public contactListModel: ContactRecord[];
  public addressListModel: AddressRecord[];

  public outputModel: CompanyEnrol;

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;

  isStatusFinal: boolean = false;
  disableForm: boolean = false;

  public mailToLabel = 'mailto.label';
  public showMailToHelpText: boolean = false;;
  public mailToLink = '';
  public submitToEmail: string = '';
  public submitToSubject: string = '';

  popupId = 'saveXmlPopup';
  popupMessage: string = '';
  popupTitle: string = '';

  private _signalService = inject(AppSignalService)

  private selectedContactCompanyRoles : Signal<string[]> = this._signalService.getSelectedContactCompanyRoles();
  private selectedAddressCompanyRoles : Signal<string[]> = this._signalService.getSelectedAddressCompanyRoles();

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private  _baseService: FormBaseService, private _globalService: GlobalService, private _utilsService: UtilsService,
    private fileServices: FileConversionService, private _versionService: VersionService, private _checkSumService: CheckSumService,
    private _companyContactService: CompanyContactService, private _companyAddressService: CompanyAddressService, private _translateService: TranslateService
  ) {
    this.showErrors = false;
    effect(() => {
      this.processAddressCompanyRolesErrors();
    });
    effect(() => {
      this.processContactCompanyRolesErrors();
    })

  }

  ngOnInit() {
    if (!this.coForm) {
      this.coForm = this._baseService.getReactiveModel(this._fb);
    }
    try {

      if (!this._globalService.enrollment) {
        // console.log("onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.enrollment = this.enrollModel;
      } else {
        this.enrollModel = this._globalService.enrollment;
      }

      this.companyEnrolModel = this.enrollModel[this.rootTagText];

      this._initModels(this.companyEnrolModel);

      this.lang = this._globalService.currLanguage;
      this.helpIndex = this._globalService.helpIndex;
      this.devEnv = this._globalService.devEnv;
      this.byPassCheckSum = this._globalService.byPassChecksum;
      this.isInternal = this._globalService.isInternal;
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';

    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
      this.processErrors();
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
       this._consentPrivacyError = errorObjs
  .filter(e =>
    e.controlId === 'certifyPrivacy' ||
    e.controlId === 'certifyPrivacyOnEmail'
  );
  }

  processErrors() {
    this.errorList = [].concat(
      this._companyEnrolmentErrors,
      this._addressListErrors,
      this._addressCompanyRoleErrors,
      this._contactListErrors,
      this._contactCompanyRoleErrors,
      this._productLineErrors,
      this._consentPrivacyError
    );

    this.showMailToHelpText = false;
    this.cdr.detectChanges(); // doing our own change detection
  }

  processCompanyEnrolmentErrors(errorList) {
    this._companyEnrolmentErrors = errorList;
    this.processErrors();
  }

  processProductLineErrors(errorList) {
    this._productLineErrors = errorList;
    this.processErrors();
  }

  processContactListErrors(errorList) {
    this._contactListErrors = errorList;
    this.processErrors();
  }

  processAddressListErrors(errorList) {
    this._addressListErrors = errorList;
    this.processErrors();
  }

  processContactCompanyRolesErrors() {
    let errorList = [];

    if (this.isRolesMissing(this.selectedContactCompanyRoles())) {
      errorList.push(this._companyContactService.makeMissingRoleError());
    }

    this._contactCompanyRoleErrors = errorList;
    this.processErrors();
  }

  processAddressCompanyRolesErrors() {
    let errorList = [];

    if (this.isRolesMissing(this.selectedAddressCompanyRoles())) {
      errorList.push(this._companyAddressService.makeMissingRoleError());
    }

    this._addressCompanyRoleErrors = errorList;
    this.processErrors();
  }

  isRolesMissing(selectedRoles : string[]) {
    const companyRolesList = this._globalService.companyRolesList.map(role => role.id); // Required roles
    const cleanSelectedRoles = selectedRoles.map(role => role.replace(/^\d+/, '')); // Remove number prefixes
    return cleanSelectedRoles .some(role => ! companyRolesList.includes(role));
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  public saveXmlFile() {
    this.showErrors = true;
    this.processErrors();
    if (this.errorList && this.errorList.length > 0) {
      document.location.href = '#topErrorSummaryId';
    } else {
        if (!this.companyAddressListComponent.hasNoRolesSelected() && !this.companyContactListComponent.hasNoRolesSelected() && this.companyAddressListComponent.recordFormGroup.pristine && this.companyContactListComponent.recordFormGroup.pristine
        && this.companyAddressListComponent.recordFormArray.valid && this.companyContactListComponent.recordFormArray.valid) {
        this._saveXML();
      } else {
        this.companyAddressListComponent.expandAllInvalidRecords();
        this.companyContactListComponent.expandAllInvalidRecords();
            // set popup text based on context
            const actionKey = this.isInternal
            ? 'msg.generating.xml.popup'
            : 'msg.saving.xml.popup' ;

       this.popupMessage = this._translateService.instant(actionKey);
        this.openPopup();
      }
    }
  }

  openPopup(){
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }

  public saveWorkingCopyFile() {
    const result: Company = this._prepareForSaving(false);
    const fileName = this._generateFileName(result[ROOT_TAG]);
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    // console.log(fileData);
    if (fileData.data !== null) {
      this.companyEnrolModel = fileData.data.COMPANY_ENROL;
      this._initModels(this.companyEnrolModel);
      if(this.companyEnrolModel.software_version < this._globalService.appVersion){
        const appType = String(this.companyEnrolModel.application_type)?.toUpperCase();
        this.isStatusFinal = appType === ENROLMENT_STATUS.FINAL || appType === ENROLMENT_STATUS.APPROVED;
      } else {
        this.isStatusFinal = this.companyEnrolModel.application_type._id == ENROLMENT_STATUS.FINAL;
      }
      this._disableForm();
      // this.setSelectedTxnDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);
      // this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.rtForm);
      // this.agentInfoOnChange();
    }
  }

  private _disableForm() {
    if (this.isStatusFinal) {
      this.disableForm = true;
      this.coForm.disable();
    }
  }

  enableForm(e : any) {
    if (e) {
      this.disableForm = false;
      this.coForm.enable();
    }
  }

  private _initModels(companyEnrol: CompanyEnrol) {
    // this.ectdModel = trans.ectd;
    // // if (trans.contact_info != null) {
    // //   this.holderAddressModel = trans.contact_info.holder_name_address;
    // //   this.holderContactModel = trans.contact_info.holder_contact;
    // //   this.agentAddressModel = trans.contact_info.agent_name_address;
    // //   this.agentContactModel = trans.contact_info.agent_contact;
    // // }
    // if (trans.fee_details != null) {
    //   this.feesModel = trans.fee_details;
    // }
    // this.addressModel = trans.regulatory_activity_address;
    // this.contactModel = trans.regulatory_activity_contact;
    const tAddresses = companyEnrol.address_record;
    const tAddressesArray = Array.isArray(tAddresses) ? tAddresses : [tAddresses];
    this.addressListModel = companyEnrol.software_version < this._globalService.appVersion? this._mapAddressIdToId(tAddressesArray) : tAddressesArray;
    if (this._utilsService.isEmpty(tAddresses)) {
      this.addressListModel = [];
    }
    const tContacts = companyEnrol.contact_record;
    const tContactsArray = Array.isArray(tContacts) ? tContacts : [tContacts];
    this.contactListModel = companyEnrol.software_version < this._globalService.appVersion? this._mapContactIdToId(tContactsArray) : tContactsArray;
    if (this._utilsService.isEmpty(tContacts)) {
      this.contactListModel = [];
    }
  }

  _mapAddressIdToId(addressArray: any): AddressRecord[] {
    return addressArray.map(({ address_id, ...rest }) => ({
      id: address_id,  // Rename address_id to id
      ...rest          // Keep the remaining properties
    }));
  }

  _mapContactIdToId(contactArray : any): ContactRecord[] {
    return contactArray.map(({ contact_id, ...rest }) => ({
      id: contact_id,  // Rename contact_id to id
      ...rest          // Keep the remaining properties
    }));
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  _saveXML() {
    if (this.errorList && this.errorList.length < 1) {
      const result: Company = this._prepareForSaving(true);
      const fileName = this._generateFileName(result[ROOT_TAG]);
      const xsltVersion = this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.appVersion)
      const xslName = XSLT_PREFIX.toUpperCase() + '_CO_' + xsltVersion + '.xsl';

      this.fileServices.saveXmlToFile(result, fileName, true, xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';

  }

  public isAmend() {
    if (this.companyEnrolModel.application_type._id === ENROLMENT_STATUS.FINAL) {
      return (!this.isInternal && this.isStatusFinal);
    } else if (this.companyEnrolModel.software_version < this._globalService.appVersion) {
      const appType = String(this.companyEnrolModel.application_type)?.toUpperCase();
      if (appType === ENROLMENT_STATUS.FINAL || appType === ENROLMENT_STATUS.APPROVED) {
        return (!this.isInternal && this.isStatusFinal);
      }
      return false;
    }
    return false;
  }

  public isDisableSubmitToHC() {
    if(this.companyEnrolModel.application_type._id === '' || this.errorList.length > 0){
     return true;
    }
    return this.isAmend();
  }

  private _prepareForSaving(xmlFile: boolean): Company {
    let contactsFormArrayValue = null;
    let addressFormArrayValue = null;

    const newcompanyEnrol: CompanyEnrol = this._baseService.getEmptyCompanyEnrol();

    newcompanyEnrol.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-HHmm');
    newcompanyEnrol.software_version = this._globalService.appVersion;
    newcompanyEnrol.form_language = this._globalService.currLanguage;

    const companyEnrolmentFormGroupValue = this.companyEnrolmentComponent.getFormValue();
    const productLineValue = this.productLineComponent.getFormValue();

    if (this.companyAddressListComponent.recordFormArray) {
      addressFormArrayValue = this.companyAddressListComponent.recordFormArray.value;
    }

    if (this.companyContactListComponent.recordFormArray) {
      contactsFormArrayValue = this.companyContactListComponent.recordFormArray.value;
    }

    this._baseService.mapCompanyEnrolmentToOutput(newcompanyEnrol, companyEnrolmentFormGroupValue, this.isInternal, xmlFile);
    this._baseService.mapProductLineToOutput(newcompanyEnrol, productLineValue);
    this._baseService.mapContactsFormToOutput(newcompanyEnrol, contactsFormArrayValue);
    this._baseService.mapAddressesFormToOutput(newcompanyEnrol, addressFormArrayValue)

    this.outputModel = newcompanyEnrol;

    const output: Company = {
      COMPANY_ENROL: newcompanyEnrol
    };

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.COMPANY_ENROL[CHECK_SUM_CONST]  = "";   // this is needed for generating the checksum value
      output.COMPANY_ENROL[CHECK_SUM_CONST]  = this._checkSumService.createHash(output);
    }

    //console.log('_prepareForSaving ~ output', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(companyEnrol: CompanyEnrol): string {
    const companyId = companyEnrol.company_id;
    const formattedVersion = companyEnrol.enrolment_version.replace(/\./g, "-");

    const prefix = this.isInternal ? INTERNAL_OUTPUT_PREFIX : EXTERNAL_OUTPUT_PREFIX;

    return companyId
    ? `${prefix}-${companyId}-${formattedVersion}`
    : `${prefix}-${formattedVersion}`;
  }

  public async mailto() {
    this.showMailToHelpText = true;

    let emailSubject = '';
    let body = '';

    let addressFormArrayValue = null;
    if (this.companyAddressListComponent.recordFormArray) {
      addressFormArrayValue = this.companyAddressListComponent.recordFormArray.value;
    }

    const companyName = this._findCompanyNameMFRrole(addressFormArrayValue);
    this.submitToSubject = await lastValueFrom(this._translateService.get('email.subject'));
    this.submitToEmail = await lastValueFrom(this._translateService.get('email.to'));
    const emailDraft = await lastValueFrom(this._translateService.get('email.draft'));
    body = await lastValueFrom(this._translateService.get('email.body'));
    let email = this.submitToEmail.replace(/[()]/g, '').trim();

    emailSubject = emailDraft + ((companyName === null || companyName === '') ? '[company name]' : companyName) + ' ' + ((this.companyEnrolModel.company_id === '') ? ' ' : ' - ' + this.companyEnrolModel.company_id); body = body;

    this.mailToLink = `mailto:${email}?subject=${emailSubject}&body=${body}`;
    window.location.href=this.mailToLink;
  }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.coForm.controls[controlName].reset();
    }
  }

  private _findCompanyNameMFRrole(addressFormArray) {
    const manufacturerRecord = addressFormArray.find(
        (record) => record.addressInfo.selectedAddressCompanyRoles.includes(ROLE_CODES.MFR)
    );

    return manufacturerRecord ? manufacturerRecord.addressInfo.companyName : null;
  }

  isEarlyVersion() : boolean{
    return this._versionService.getMajorVersion(this.companyEnrolModel.software_version) < START_CHECKSUM_VERSION
  }

}
