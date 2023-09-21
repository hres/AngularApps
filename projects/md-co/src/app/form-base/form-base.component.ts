import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ConvertResults } from '@hpfb/sdk/ui/file-io/convert-results';
import { CompanyDataLoaderService } from './company-data-loader.service';
import { ICode } from '@hpfb/sdk/ui/data-loader/data';
import { AMEND, ContactStatus, FINAL, ROOT_TAG } from '../app.constants';
import { CompanyBaseService } from './company-base.service';
import { Address, GeneralInformation, Contact, PrimaryContact, AdministrativeChanges, Enrollment} from '../models/Enrollment';
import { FileConversionService, NO, UtilsService, YES } from '@hpfb/sdk/ui';


// import { VersionService } from '../shared/version.service';
// import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';

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
  // @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  
  private _genInfoErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _adminChangesErrors = [];
  // private _primContactErrors = [];
  public companyForm: FormGroup;
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  public isInternalSite = true;
  public loadFileIndicator = 0;
  public countryList: ICode[];
  public provinceList = [];
  public stateList = [];
  public adminChanges = [];
  public showAdminChanges: boolean;
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';

  public addressModel : Address;
  public genInfoModel : GeneralInformation; 
  public contactModel : Contact[];
  public adminChangesModel :AdministrativeChanges;
  public primContactModel : PrimaryContact; 
  public helpIndex = [] ; // todo CompanyBaseService.getHelpTextIndex();

  public saveXmlLabel = 'save.draft';
  public mailToLabel = 'mailto.label';
  public xslName = 'REP_MDS_CO_3_0.xsl';
  public showMailToHelpText: boolean;
  public mailToLink = '';
  public activeContacts = [];
  public hasContact = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private _formDataLoader: CompanyDataLoaderService,
    private _companyService: CompanyBaseService,
    private _fileService: FileConversionService, private _utilService: UtilsService
  ) {
    // _formDataLoader = new CompanyDataLoaderService(this.http);
    // this.countryList = [];
    this.showAdminChanges = false;
    this.showErrors = false;
    this.showMailToHelpText = false;
    // this.fileServices = new FileConversionService();

    this.genInfoModel = _companyService.getEmptyGenInfoModel();
    this.addressModel = _companyService.getEmptyAddressDetailsModel();
    this.contactModel = null;
    this.adminChangesModel = _companyService.getEmptyAdminChangesModel();
    this.primContactModel = _companyService.getEmptyPrimarycontactModel();

  }

  ngOnInit() {
    if (!this.companyForm) {
      this.companyForm = this._companyService.buildForm();
    }

    this._formDataLoader.getKeywordList().subscribe((data) => {
      console.log('form.base=>' + data);
      // this.countryList = data;
    });


    // .subscribe(
    //   (response) => {
    //     this.countries = response;
    //   },
    //   (error) => {
    //     console.error('Error fetching countries:', error);
    //   }
    // );

    // this.countryList = await this._formDataLoader.getCountries(
    //   this.translate.currentLang
    // );
    // this.provinceList = await this._formDataLoader.getProvinces(
    //   this.translate.currentLang
    // );
    // this.stateList = await this._formDataLoader.getStates(
    //   this.translate.currentLang
    // );
    console.log('isInternal in ngOnInit: ' + this.isInternal);
    if (this.isInternal === NO) {
      this.isInternalSite = false;
      // console.log('isInternalSite in ngOnInit: ' + this.isInternalSite);
    } else {
      this.saveXmlLabel = 'approve.final';
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
    document.location.href = '#main';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactModel']) {
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
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the error arrays
    this.errorList = this._genInfoErrors.concat(
      this._addressErrors.concat(
        this._contactErrors.concat(this._adminChangesErrors)
      )
    );
    this.cdr.detectChanges(); // doing our own change detection
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

  processAdminChangesUpdate(adminChanges) {
    // this.adminChanges = adminChanges;
    // if (adminChanges && adminChanges.length > 0) {
    // this.showAdminChanges = adminChanges[0];
    // } else {
    // this.showAdminChanges = false;
    // }
    // if (!this.showAdminChanges) {
    // // reset adminchanges model to empty and update its error list to empty if showAdminChanges is false
    // this.adminChangesModel = CompanyBaseService.getEmptyAdminChangesModel();
    // this.processAdminChangesErrors([]);
    // }
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
    // if (!this.errorList) {
    //   return false;
    // }
    // return this.errorList.length === 0;
  }

  public isExternalAndFinal() {
    return (!this.isInternalSite && this.genInfoModel.status === FINAL);
  }

  // disable the mailto link for internal, or when it is external Final or when there are errors for the external
  public disableMailtoLink() {
    // return (this.isInternalSite || this.genInfoModel.status === GlobalsService.FINAL ||
    // (this.errorList && this.errorList.length > 0) || !this.companyContacts.contactListForm.pristine);
  }

  public saveXmlFile() {
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      // if (this.companyContacts.contactListForm.pristine) {
      //   // .isPristine
      //   this._updatedAutoFields();
      //   if (this.isInternalSite) {
      //     this.genInfoModel.status = CompanyBaseService.setFinalStatus();
      //   }
      //   const result = {
      //     DEVICE_COMPANY_ENROL: {
      //       general_information: this.genInfoModel,
      //       address: this.addressModel,
      //       contacts: {},
      //       primary_contact: this.primContactModel,
      //       administrative_changes: this.adminChangesModel,
      //     },
      //   };
      //   if (this.contactModel && this.contactModel.length > 0) {
      //     const cm = this._removeHcStatus(this.contactModel);
      //     result.DEVICE_COMPANY_ENROL.contacts = { contact: cm };
      //   }
      //   const fileName = this._buildfileName();
      //   this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
      // } else {
      //   if (this.lang === GlobalsService.ENGLISH) {
      //     alert(
      //       'Please save the unsaved input data before generating XML file.'
      //     );
      //   } else {
      //     alert(
      //       "Veuillez sauvegarder les données d'entrée non enregistrées avant de générer le fichier XML."
      //     );
      //   }
      // }
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    let result : Enrollment= {
      DEVICE_COMPANY_ENROL: {
        general_information: this.genInfoModel,
        address: this.addressModel,
        contacts: this.contactModel, //{},
        primary_contact: this.primContactModel,
        administrative_changes: this.adminChangesModel,
      },
    };
    // if (this.contactModel && this.contactModel.length > 0) {       //todo what is the logic here?
    //   const cm = !this.isInternalSite
    //     ? this._removeHcStatus(this.contactModel)
    //     : this.contactModel;
    //   result.DEVICE_COMPANY_ENROL.contacts = { contact: cm };
    // }
    // result.DEVICE_COMPANY_ENROL.contacts =
    //   (this.contactModel && (this.contactModel).length > 0) ? {contact: this.contactModel} : {};
    // const version: Array<any> = this.genInfoModel.enrol_version.toString().split('.');
    const fileName = this._buildfileName();
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator++;
    // console.log('processing file.....');
    // console.log(fileData);
    // this.genInfoModel = fileData.data.DEVICE_COMPANY_ENROL.general_information;
    // // set amend reasons and admin changes section to null if status is Final
    // if (this.genInfoModel.status === GlobalsService.FINAL) {
    //   this.genInfoModel.amend_reasons = {
    //     manufacturer_name_change: '',
    //     manufacturer_address_change: '',
    //     facility_change: '',
    //     contact_change: '',
    //     other_change: '',
    //     other_details: '',
    //   };
    // this.genInfoModel.are_licenses_transfered = '';
    // }

    // this._updateAdminChanges();
    // if (fileData.data.DEVICE_COMPANY_ENROL.administrative_changes) {
    //   this.adminChangesModel =
    //     fileData.data.DEVICE_COMPANY_ENROL.administrative_changes;
    // }

    // this.addressModel = fileData.data.DEVICE_COMPANY_ENROL.address;
    // this.primContactModel = fileData.data.DEVICE_COMPANY_ENROL.primary_contact;
    // const cont = fileData.data.DEVICE_COMPANY_ENROL.contacts.contact;
    // if (cont) {
    //   this.contactModel = cont instanceof Array ? cont : [cont];
    //   this.contactModelUpdated(this.contactModel);
    // } else {
    //   this.contactModel = [];
    // }
    // if (this.isInternalSite) {
    //   // once load data files on internal site, lower components should update error list and push them up
    //   this.showErrors = true;
    // }
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternalSite) {
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
    // console.log("Calling updateChild")
  }

  private _buildfileName() {
    // const version: Array<any> = this.genInfoModel.enrol_version.split('.');
    const date_generated = this._utilService.getFormattedDate('yyyyMMddHHmm');
    if (this.isInternalSite) {
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
    this.adminChanges[1] = this.genInfoModel.amend_reasons.manufacturer_name_change === YES;
    this.adminChanges[2] = this.genInfoModel.amend_reasons.manufacturer_address_change === YES;
    this.adminChanges[3] = this.genInfoModel.amend_reasons.facility_change === YES;
    this.adminChanges[0] = this.genInfoModel.are_licenses_transfered  === YES ||
        this.adminChanges[1] || this.adminChanges[2] || this.adminChanges[3];
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  public mailto() {
    this.showMailToHelpText = true;
    // const emailSubject =
    //   'Draft CO XML - ' +
    //   this.addressModel.company_name +
    //   ' ' +
    //   (this.genInfoModel.company_id === null
    //     ? ''
    //     : this.genInfoModel.company_id);
    // let emailAddress;
    // let body =
    //   'NOTE: The Company XML file is not automatically attached. ATTACH THE DRAFT COMPANY XML PRIOR TO SUBMITTING.';
    // if (
    //   this.genInfoModel.are_licenses_transfered === GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.manufacturer_name_change ===
    //     GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.manufacturer_address_change ===
    //     GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.facility_change === GlobalsService.YES
    // ) {
    //   emailAddress = 'qs.mdb@hc-sc.gc.ca';
    // } else {
    //   emailAddress = 'devicelicensing-homologationinstruments@hc-sc.gc.ca';
    // }
    // todo: add more body text

    // this.mailToLink =
    //   'mailto:' + emailAddress + '?subject=' + emailSubject + '&body=' + body;
  }

  /*
   * update adminChanges to show the text info in the adminChanges component
   */
  public mailtoQS() {
    // return (
    //   this.genInfoModel.are_licenses_transfered === GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.manufacturer_name_change ===
    //     GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.manufacturer_address_change ===
    //     GlobalsService.YES ||
    //   this.genInfoModel.amend_reasons.facility_change === GlobalsService.YES
    // );
  }

  contactModelUpdated(contacts) {
    const cntList = contacts.filter(contact =>
      (contact.status._id === ContactStatus.NEW || contact.status._id === ContactStatus.REVISE || contact.status._id === ContactStatus.ACTIVE));
    this.activeContacts = [];
    if (cntList) {
      cntList.forEach((contact: any) => {
        this.activeContacts.push(contact.full_name);
      });
    }
    this.hasContact = (this.activeContacts && this.activeContacts.length > 0);
  }
}
