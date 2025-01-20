import {Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, HostListener, ViewChildren, QueryList, inject, ViewChild, signal, Signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, ControlMessagesComponent, ConvertResults, HelpSequence, CHECK_SUM_CONST } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FILE_OUTPUT_PREFIX, ENROLMENT_STATUS, ROOT_TAG, START_CHECKSUM_VERSION, VERSION_TAG_PATH, XSLT_PREFIX } from '../app.constants';
import { FormBaseService } from './form-base.service';
import { CompanyEnrol, Company, ContactRecord} from '../models/Company';
import { AppSignalService } from '../signal/app-signal.service';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { CompanyEnrolmentComponent } from '../company-enrolment/company-enrolment.component';
import { CompanyContactModule } from "../company-contact/company-contact.module";

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService, FormBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent, CompanyContactModule]
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

  
  private _companyEnrolmentErrors = [];
  private _contactListErrors = [];

  public coForm: FormGroup; 
  public errorList = [];
  public showErrors: boolean;

 
  public headingLevel = 'h2';

  public enrollModel: Company;
  public companyEnrolModel: CompanyEnrol;
  public contactModel: ContactRecord[];

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;

  isStatusFinal: boolean;

  private _signalService = inject(AppSignalService)

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private  _baseService: FormBaseService, private _globalService: GlobalService, private _utilsService: UtilsService,
    private fileServices: FileConversionService, private _versionService: VersionService, private _checkSumService: CheckSumService
  ) {
    this.showErrors = false;
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
    // let consentPrivacyTempError = [];
    // if (errorObjs) {
    //   errorObjs.forEach(
    //     error => {
    //       if (error.label === 'consent.privacy') {
    //         consentPrivacyTempError.push(error);
    //       }
    //     }
    //   );
    // }

    // this._consertPrivacyError = consentPrivacyTempError;
  }

  processErrors() {
    this.errorList = [];
    this.errorList = this.errorList.concat(this._companyEnrolmentErrors);

    this.cdr.detectChanges(); // doing our own change detection
  }

  // processProductInfoErrors(errorList) {
  //   this._productInfoErrors = errorList;
  //   this.processErrors();
  // }

  // // processContactErrors(errorList) {
  // //   this._contactErrors = errorList;
  // //   this.processErrors();
  // // }

  // processFeesErrors(errorList) {
  //   this._feesErrors = errorList;
  //   this.processErrors();
  // }

  processCompanyEnrolmentErrors(errorList) {
    this._companyEnrolmentErrors = errorList;
    this.processErrors();
  }

  processContactListErrors(errorList) {
    this._contactListErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  public saveXmlFile() {
    this.showErrors = true;
    this.processErrors();
    this._saveXML();
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
      this.isStatusFinal = this.companyEnrolModel.application_type._id == ENROLMENT_STATUS.FINAL;
      // this.setSelectedTxnDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);
      // this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.rtForm);
      // this.agentInfoOnChange();
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

  private _prepareForSaving(xmlFile: boolean): Company {

    const newcompanyEnrol: CompanyEnrol = this._baseService.getEmptyCompanyEnrol();

    // const productInfoFormGroupValue = this.productInfoComponent.getFormValue();
    // this._baseService.mapProductInfoFormToOutput(newDrugProductEnrol, productInfoFormGroupValue);

    newcompanyEnrol.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    newcompanyEnrol.software_version = this._globalService.appVersion;
    newcompanyEnrol.form_language = this._globalService.currLanguage;

    const companyEnrolmentFormGroupValue = this.companyEnrolmentComponent.getFormValue();
    this._baseService.mapCompanyEnrolmentToOutput(newcompanyEnrol, companyEnrolmentFormGroupValue, this.isInternal);

    const output: Company = {
      COMPANY_ENROL: newcompanyEnrol
    };

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.COMPANY_ENROL[CHECK_SUM_CONST]  = "";   // this is needed for generating the checksum value
      output.COMPANY_ENROL[CHECK_SUM_CONST]  = this._checkSumService.createHash(output);
    }

    console.log('_prepareForSaving ~ output', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(companyEnrol: CompanyEnrol): string {
    let fileName =
      FILE_OUTPUT_PREFIX + "-" +
      // companyEnrol.dossier_id +
      '-' +
      companyEnrol.date_saved;
    return fileName;
  }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.coForm.controls[controlName].reset();
    }
  }

}
