import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ConvertResults } from '@hpfb/sdk/ui/file-io/convert-results';
import { ICode, IKeyword } from '@hpfb/sdk/ui/data-loader/data';
import { AMEND, ContactStatus, FINAL, XSLT_PREFIX, ROOT_TAG } from '../app.constants';
import { CompanyDataLoaderService } from './company-data-loader.service';
import { CompanyBaseService } from './company-base.service';
import { GeneralInformation, Contact, PrimaryContact, AdministrativeChanges, Enrollment, DeviceCompanyEnrol} from '../models/Enrollment';
import { ContactListComponent, ControlMessagesComponent, FileConversionService, IIdTextLabel, INameAddress, CheckSumService, LoggerService, NO, UtilsService, YES, CHECK_SUM_CONST } from '@hpfb/sdk/ui';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '../global/global.service';


@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @Input() helpTextSequences;
  @ViewChild(ContactListComponent, {static: true}) companyContacts: ContactListComponent;
  
  private _genInfoErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _adminChangesErrors = [];
  // private _primContactErrors = [];
  public companyForm: FormGroup;
  public errorList = [];
  
  public rootTagText = ROOT_TAG; 
  private xslName: string;

  public loadFileIndicator = 0;
  public keywordList: IKeyword[] = [];
  public languageList: ICode[] = [];
  public contactStatusList: ICode[] = [];
  public countryList: ICode[];
  public provinceList: ICode[];
  public stateList: ICode[];
  public enrollmentStatusList: ICode[]
  public selectedAmendReasonCodes: string[] = [];
  public showAdminChanges: boolean;
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';

  public enrollModel : Enrollment;

  public addressModel : INameAddress;
  public genInfoModel : GeneralInformation; 
  public contactModel : Contact[];
  public adminChangesModel :AdministrativeChanges;
  public primContactModel : PrimaryContact; 
  public helpIndex: { [key: string]: number }; // todo CompanyBaseService.getHelpTextIndex();

  public saveXmlLabel = 'save.draft';

  public activeContacts = [];
  public hasContact = false;

  public showAmendNote: boolean = false;

  public mailToLabel = 'mailto.label';
  public disableMailto: boolean = false;
  public showMailToHelpText: boolean;
  public mailToLink = '';
  private mailtoQS: boolean;
  public submitToEmail: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private _formDataLoader: CompanyDataLoaderService,
    private _companyService: CompanyBaseService,
    private _fileService: FileConversionService, private _utilService: UtilsService, private router: Router, private _globalService: GlobalService,
    private _loggerService: LoggerService,
    private _checkSumService: CheckSumService
  ) {

    this._loggerService.log("form.base", "constructor", "");

    this.showAdminChanges = false;
    this.showErrors = false;
    this.showMailToHelpText = false;

    this.xslName = XSLT_PREFIX.toUpperCase() + this._utilService.getApplicationMajorVersion(this._globalService.getAppVersion()) + '.xsl';
  }

  ngOnInit() {
    try {
      if (!this._globalService.getEnrollment()) {
        this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._companyService.getEmptyEnrol();
        this._globalService.setEnrollment(this.enrollModel);
      } else {
        this.enrollModel = this._globalService.getEnrollment();
        this._loggerService.log("form.base", "onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
      }

      const companyEnroll: DeviceCompanyEnrol = this.enrollModel[this.rootTagText];
      this.init(companyEnroll);

      if (!this.companyForm) {
        this.companyForm = this._companyService.buildForm();
      }

      // to cache the data
      this._formDataLoader.getKeywordList().subscribe((data) => {
        // this._loggerService.log("form.base", "onInit", JSON.stringify(data));
        this.keywordList = data;
        this.languageList = data.find(x => (x.name === 'languages')).data;
        // this._loggerService.log("form.base", "onInit", JSON.stringify(this.languageList));
      });

      this._formDataLoader.getContactStatusesList().subscribe((data) => {
        this.contactStatusList = data;
      });

      console.log('contactStatusList');
      console.log(this.contactStatusList);

      this._formDataLoader.getCountryList().subscribe((data) => {
        // this._loggerService.log("form.base", "onInit", JSON.stringify(data));
        this.countryList = data;
      });

      this._formDataLoader.getProvinceList().subscribe((data) => {
        this.provinceList = data;
      });

      this._formDataLoader.getStateList().subscribe((data) => {
        this.stateList = data;
      });

      this._formDataLoader.getEnrollmentStatusesList().subscribe((data) => {
        this.enrollmentStatusList = data;
      });

      if (this.isInternal) {
        this.saveXmlLabel = 'approve.final';
      }

      this.helpIndex = this._globalService.getHelpIndex();

    } catch (e) {
      this._loggerService.error("formbase", e);
      this.gotoErrorPage()
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
    document.location.href = '#main';
  }

  ngOnChanges(changes: SimpleChanges) {
    this._loggerService.log("form.base", "ngOnChanges", this._utilService.checkComponentChanges(changes));
    if (changes['contactModel']) {
      this._loggerService.log("form.base", "ngOnChanges", "contactModel");
      this._updateContactList(changes['primContactModel'].currentValue);
    }
  }

  private _updateContactList(contacts) {
    this.activeContacts = contacts.filter(
      (contact) =>
        contact[status] === 'NEW' ||
        contact[status] === 'REVISE' ||
        contact[status] === 'ACTIVE'
    );
    this.hasContact = this.activeContacts && this.activeContacts.length > 0;
  }

  processErrors() {
    this.errorList = [];
    // concat the error arrays
    this.errorList = this._genInfoErrors.concat(
      this._addressErrors.concat(
        this._contactErrors.concat(this._adminChangesErrors)
      )
    );
    this.cdr.detectChanges(); // doing our own change detection
    // this._loggerService.log('form.base', 'processErrors', 'this.errorList.length', this.errorList.length);
    // for (const e of this.errorList) {
    //   console.log(e)
    // }

    this.disableMailto = this.errorList.length > 0;
    this.showMailToHelpText = false;
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processGenInfoErrors(errorList) {
    this._genInfoErrors = errorList;
    this.processErrors();
  }

  processContactErrors(errorList) {
    this._contactErrors = errorList;
    this.processErrors();
  }

  // processPrimContactErrors(errorList) {
  //   this._primContactErrors = errorList;
  //   this.processErrors();
  // }

  processAdminChangesErrors(errorList) {
    this._adminChangesErrors = this.showAdminChanges ? errorList : [];
    this.processErrors();
  }

  // triggered when amend reasons and/or licenses being transferred in company info are updated
  processGenInfoUpdates(toggleFlag: boolean) {
    console.log("toggleFlag", toggleFlag);
    this.showAdminChanges = toggleFlag;
    this.mailtoQS = toggleFlag;

    if (toggleFlag) {
      this.selectedAmendReasonCodes = this._utilService.getIdsFromIdTextLabels(this.genInfoModel.amend_reasons.amend_reason) 
    } else {
      this.selectedAmendReasonCodes = [];
      // reset adminchanges model to empty and update its error list to empty if showAdminChanges is false
      this.adminChangesModel = null; //CompanyBaseService.getEmptyAdminChangesModel();
      this.processAdminChangesErrors([]);
    }
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
    // if (!this.errorList) {
    //   return false;
    // }
    // return this.errorList.length === 0;
  }

  public isExternalAndFinal() {
    return (!this.isInternal && this.genInfoModel.status === FINAL);
  }

  public saveXmlFile() {
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      if (this.companyContacts.contactListForm.pristine) {
        // .isPristine
        this._updatedAutoFields();
        if (this.isInternal) {
          this.genInfoModel.status = this._companyService.setFinalStatus();
        }
        const result = {      // todo use the enrollement obj saved in GlobalService??, consolidate this with saveWorkingCopyFile()
          DEVICE_COMPANY_ENROL: {
            general_information: this.genInfoModel,
            [CHECK_SUM_CONST]: "",
            address: this.addressModel,
            contacts: {},
            primary_contact: this.primContactModel,
            administrative_changes: this.adminChangesModel,
          },
        };
        if (this.contactModel && this.contactModel.length > 0) {
          const cm = this._removeHcStatus(this.contactModel);
          result.DEVICE_COMPANY_ENROL.contacts = { contact: cm };
        }

        result.DEVICE_COMPANY_ENROL[CHECK_SUM_CONST] = this._checkSumService.createHash(result);

        const fileName = this._buildfileName();
        this._fileService.saveXmlToFile(result, fileName, true, this.xslName);
      } else {
        if (this._utilService.isFrench(this.lang)) {
          alert(
            "Veuillez sauvegarder les données d'entrée non enregistrées avant de générer le fichier XML."
          );
        } else {
          alert(
            'Please save the unsaved input data before generating XML file.'
          );
        }
      }
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();     // todo use the enrollement obj saved in GlobalService??
    let result = {'DEVICE_COMPANY_ENROL': {
      'general_information': this.genInfoModel,
      'address': this.addressModel,
      'contacts': {},
      'primary_contact': this.primContactModel,
      'administrative_changes': this.adminChangesModel
    }};
    if (this.contactModel && (this.contactModel).length > 0) {
      const cm = !this.isInternal ? this._removeHcStatus(this.contactModel) : this.contactModel;
      result.DEVICE_COMPANY_ENROL.contacts = {contact: cm};
    }
    if (this.contactModel && this.contactModel.length > 0) {
      const cm = !this.isInternal
        ? this._removeHcStatus(this.contactModel)
        : this.contactModel;
      result.DEVICE_COMPANY_ENROL.contacts = { contact: cm };
    }
    // result.DEVICE_COMPANY_ENROL.contacts =
    //   (this.contactModel && (this.contactModel).length > 0) ? {contact: this.contactModel} : {};
    // const version: Array<any> = this.genInfoModel.enrol_version.toString().split('.');
    const fileName = this._buildfileName();
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator++;
    const enrollment : Enrollment = fileData.data;
    this._globalService.setEnrollment(enrollment);
    this._loggerService.log('form.base', 'processingFile', JSON.stringify(enrollment, null, 2));

    const companyEnroll: DeviceCompanyEnrol = enrollment[this.rootTagText];
    this.init(companyEnroll);
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternal) {
      this.genInfoModel.status = this._companyService.setFinalStatus();
      this.genInfoModel.enrol_version =
        (Math.floor(Number(this.genInfoModel.enrol_version)) + 1).toString() +
        '.0';
    } else {
      const version: Array<any> = this.genInfoModel.enrol_version.split('.');
      version[1] = (Number(version[1]) + 1).toString();
      this.genInfoModel.enrol_version = version[0] + '.' + version[1];
    }
  }

  private _updatedSavedDate() {
    this.genInfoModel.last_saved_date = this._utilService.getFormattedDate('yyyy-MM-dd')
  }

  private _removeHcStatus(contacts) {
    const cts = contacts.map(function (item) {
      delete item.hc_status;
      return item;
    });
    return cts;
  }

  public updateChild() {
    // this._loggerService.log("Calling updateChild")
  }

  private _buildfileName() {
    // const version: Array<any> = this.genInfoModel.enrol_version.split('.');
    const date_generated = this._utilService.getFormattedDate('yyyyMMddHHmm');
    if (this.isInternal) {
      return 'final-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else if (this.genInfoModel.status === AMEND) {
      return 'draft-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else {
      return 'draft-com-' + date_generated;
    }
  }

  /*
   * update adminChanges to show the text info in the adminChanges component
   */
  private _updateAdminChanges() {
    // ling todo
    // this.adminChanges[1] = this.genInfoModel.amend_reasons.manufacturer_name_change === YES;
    // this.adminChanges[2] = this.genInfoModel.amend_reasons.manufacturer_address_change === YES;
    // this.adminChanges[3] = this.genInfoModel.amend_reasons.facility_change === YES;
    // this.adminChanges[0] = this.genInfoModel.are_licenses_transfered  === YES ||
    //     this.adminChanges[1] || this.adminChanges[2] || this.adminChanges[3];
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  public mailto() {
    this.showMailToHelpText = true;
    const emailSubject =
      'Draft CO XML - ' +
      this.addressModel.company_name +
      ' ' +
      (this.genInfoModel.company_id === null
        ? ''
        : this.genInfoModel.company_id);
    // let emailAddress;
    let body =
      'NOTE: The Company XML file is not automatically attached. ATTACH THE DRAFT COMPANY XML PRIOR TO SUBMITTING.';
    if (this.mailtoQS) {
      this.submitToEmail = 'qs.mdb@hc-sc.gc.ca';
    } else {
      this.submitToEmail = 'devicelicensing-homologationinstruments@hc-sc.gc.ca';
    }

    this.mailToLink =
      'mailto:' + this.submitToEmail + '?subject=' + emailSubject + '&body=' + body;
  }

  contactModelUpdated(contacts) {
    const cntList = contacts.filter(contact =>
      (contact.status === ContactStatus.NEW || contact.status === ContactStatus.REVISE || contact.status === ContactStatus.ACTIVE));
    this.activeContacts = [];
    if (cntList) {
      cntList.forEach((contact: any) => {
        this.activeContacts.push(contact.full_name);
      });
    }
    this.hasContact = (this.activeContacts && this.activeContacts.length > 0);
  }

  gotoErrorPage(): void {
    this.router.navigate(['/error']);
  }


  private init(companyEnroll: DeviceCompanyEnrol){
    this.genInfoModel = companyEnroll.general_information;
    // set amend reasons and admin changes section to null if status is Final
    if (this.genInfoModel.status === FINAL) {   // ling todo review this
      // this.genInfoModel.amend_reasons = {
      //   manufacturer_name_change: '',
      //   manufacturer_address_change: '',
      //   facility_change: '',
      //   contact_change: '',
      //   other_change: '',
      //   rationale: '',
      // };
      this.genInfoModel.amend_reasons = null;
      // this.genInfoModel.are_licenses_transfered = '';
    }

    this._updateAdminChanges();
    if (companyEnroll.administrative_changes) {
      this.adminChangesModel = companyEnroll.administrative_changes;
    }

    this.addressModel = companyEnroll.address;
    this.primContactModel = companyEnroll.primary_contact;

    const cont = companyEnroll.contacts['contact'];
    if (cont) {
      this.contactModel = cont instanceof Array ? cont : [cont];
      this.contactModelUpdated(this.contactModel);
    } else {
      this.contactModel = [];
    }

    if (this.isInternal) {
      // once load data files on internal site, lower components should update error list and push them up
      this.showErrors = true;
    }

    this.showAmendNote = ( this.genInfoModel.status === FINAL);
  }

}
