import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EnrollmentStatus, XSLT_PREFIX, ROOT_TAG, AMEND_REASON_NAME_CHANGE, AMEND_REASON_ADDR_CHANGE, AMEND_REASON_FACILITY_CHANGE } from '../app.constants';
import { CompanyDataLoaderService } from './company-data-loader.service';
import { CompanyBaseService } from './company-base.service';
import { GeneralInformation, PrimaryContact, AdministrativeChanges, Enrollment, DeviceCompanyEnrol} from '../models/Enrollment';
import {  ICode, IKeyword, ConvertResults, FileConversionService, INameAddress, CheckSumService, LoggerService, UtilsService, CHECK_SUM_CONST, ContactListComponent, Contact, ContactStatus, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, AddressModule, ContactModule } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AddressModule, ContactModule, AppFormModule],
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
  
  public showAmendNote: boolean = false;

  public mailToLabel = 'mailto.label';
  public disableMailto: boolean = false;
  public showMailToHelpText: boolean = false;;
  public mailToLink = '';
  private mailtoQS: boolean;
  public submitToEmail: string = '';

  private activeContactStatuses: string[] = [ContactStatus.New, ContactStatus.Revise , ContactStatus.Active];
  private amendReasonCodesToShowAdminChanges:string[] = new Array(AMEND_REASON_NAME_CHANGE, AMEND_REASON_ADDR_CHANGE, AMEND_REASON_FACILITY_CHANGE) ;

  constructor(
    private cdr: ChangeDetectorRef,
    private _formDataLoader: CompanyDataLoaderService,
    private _companyService: CompanyBaseService,
    private _fileService: FileConversionService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _loggerService: LoggerService,
    private _checkSumService: CheckSumService,
    private _converterService: ConverterService
  ) {

    this.showAdminChanges = false;
    this.showErrors = false;

    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + '.xsl';
  }

  ngOnInit() {
    try {
      if (!this._globalService.getEnrollment()) {
        // this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._companyService.getEmptyEnrol();
        this._globalService.setEnrollment(this.enrollModel);
      } else {
        this.enrollModel = this._globalService.getEnrollment();
        // console.log("onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
      }

      const companyEnroll: DeviceCompanyEnrol = this.enrollModel[this.rootTagText];
      this._init(companyEnroll);

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

      this._formDataLoader.getCountryList(this.lang).subscribe((data) => {
        // this._loggerService.log("form.base", "onInit", JSON.stringify(data));
        this.countryList = data;
      });

      this._formDataLoader.getProvinceList(this.lang).subscribe((data) => {
        this.provinceList = data;
      });

      this._formDataLoader.getStateList(this.lang).subscribe((data) => {
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
      console.error(e);
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }

  ngOnChanges(changes: SimpleChanges) {
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
    // console.log('form.base', 'processErrors', 'this.errorList.length', this.errorList.length);
    // for (const e of this.errorList) {
    //   console.log(e)
    // }

    this.disableMailto = this.errorList.length > 0 || this._isFinal()|| this.isInternal;
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

  // called from company.info.component when "amend reasons" and/or "are licenses being transferred" are updated
  processGenInfoUpdates(changed: boolean) {  
    // the newly changed values are already saved in the genInfoModel in the company.info.component
    // so we can just get the needed values directly from genInfoModel
    this._setShowAdminChangesFlag();    

    // mailtoQS has the same business rule as showAdminChanges
    this.mailtoQS = this.showAdminChanges;

    if (this.showAdminChanges) {
      this.selectedAmendReasonCodes = this._utilsService.getIdsFromIdTextLabels(this.genInfoModel.amend_reasons.amend_reason) 
      // re-initiate the object in case showAdminChanges is flipped back and forth
      this.adminChangesModel = this._companyService.getEmptyAdminChangesModel();
    } else {
      this.selectedAmendReasonCodes = [];
      // reset adminchanges model to empty and update its error list to empty if showAdminChanges is false
      this.adminChangesModel = null; 
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
    return (!this.isInternal && this._isFinal());
  }

  public saveXmlFile() {
    console.log("saveXmlFile", "this.showErrors", this.showErrors, this.errorList.length)
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      if (this.companyContacts.contactListForm.pristine) {
        const result = this._prepareForSaving(true);
        const fileName = this._buildfileName();
        this._fileService.saveXmlToFile(result, fileName, true, this.xslName);
      } else {
        if (this._utilsService.isFrench(this.lang)) {
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
    const result = this._prepareForSaving(false);
    const fileName = this._buildfileName();
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
   
    let output: Enrollment = { 
      DEVICE_COMPANY_ENROL: {
        template_version: this._globalService.$appVersion,
        general_information: this.genInfoModel,
        address: this.addressModel,
        contacts: {contact: this.contactModel},
        primary_contact: this.primContactModel,
        administrative_changes: this.adminChangesModel,
      },
    };
    // console.log("_prepareForSaving, data in 'session' ", JSON.stringify(output, null, 2));

    // update the last_saved_date
    output.DEVICE_COMPANY_ENROL.general_information.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd')

    if (xmlFile) {
      this._updateEnrollmentVersion(output.DEVICE_COMPANY_ENROL.general_information);

      if (this.isInternal) {
        // update enrollment status for internal final saving
        output.DEVICE_COMPANY_ENROL.general_information.status = this._converterService.findAndConverCodeToIdTextLabel(this.enrollmentStatusList, EnrollmentStatus.Final, this.lang); // Set to final status
      }
      // add and calculate check_sum if it is xml
      output.DEVICE_COMPANY_ENROL.check_sum = "";   // this is needed for generating the checksum value
      output.DEVICE_COMPANY_ENROL.check_sum = this._checkSumService.createHash(output);
    }
    // console.log("_prepareForSaving, data after updates ", JSON.stringify(output, null, 2));

    return output;
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator++;
    const enrollment : Enrollment = fileData.data;
    // this._loggerService.log('form.base', 'processingFile', JSON.stringify(enrollment, null, 2));
    this._globalService.setEnrollment(enrollment);

    const companyEnroll: DeviceCompanyEnrol = enrollment[this.rootTagText];
    this._init(companyEnroll);

    if (this.isInternal) {
      // once load data files on internal site, lower components should update error list and push them up
      this.showErrors = true;
    }
    console.log("processFile", "internal?", this.isInternal, "this.showErrors", this.showErrors) 
  }

  private _updateEnrollmentVersion(genInfo: GeneralInformation) {
    let enrolVersion: string = "";
    if (this.isInternal) {
      enrolVersion = (Math.floor(Number(genInfo.enrol_version)) + 1).toString() + '.0';
    } else {
      const version: Array<any> = genInfo.enrol_version.split('.');
      version[1] = (Number(version[1]) + 1).toString();
      enrolVersion = version[0] + '.' + version[1];
    }
    genInfo.enrol_version = enrolVersion;
  }

  // private _removeHcStatus(contacts) {
  //   const cts = contacts.map(function (item) {
  //     delete item.hc_status;
  //     return item;
  //   });
  //   return cts;
  // }

  private _buildfileName() {
    const date_generated = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    if (this.isInternal) {
      return 'final-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else if (this.genInfoModel.status._id === EnrollmentStatus.Amend) {
      return 'draft-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else {
      return 'draft-com-' + date_generated;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  public mailto() {
    this.showMailToHelpText = true;

    let emailSubject = '';
    let body = '';

    if (this.mailtoQS) {
      this.submitToEmail = 'qs.mdb@hc-sc.gc.ca';
    } else {
      this.submitToEmail = 'devicelicensing-homologationinstruments@hc-sc.gc.ca';
    }

    if (this.lang == 'en') {
      emailSubject =
        'Draft CO XML - ' +
        ((this.addressModel.company_name === null || this.addressModel.company_name === '')
          ? '[company name]'
          : this.addressModel.company_name) +
        ' ' +
        ((this.genInfoModel.company_id === null || this.genInfoModel.company_id === '')
          ? '[company ID, if available]'
          : this.genInfoModel.company_id);
      body =
        'NOTE: The Company XML file is not automatically attached. ATTACH THE DRAFT COMPANY XML PRIOR TO SUBMITTING.';
    } 
    if (this.lang == 'fr') {
      emailSubject =
        ' Ébauche du fichier CO XML -  ' +
        ((this.addressModel.company_name === null || this.addressModel.company_name === '')
          ? '[insérer le nom de votre entreprise]'
          : this.addressModel.company_name) +
        ' ' +
        ((this.genInfoModel.company_id === null || this.genInfoModel.company_id === '')
          ? '[insérer votre code d’entreprise, le cas échéant]'
          : this.genInfoModel.company_id);
      body =
        "NOTE: Le fichier XML de l'entreprise n'est pas automatiquement joint. VEUILLEZ JOINDRE LE BROUILLON XML DE L'ENTREPRISE AVANT DE LE SOUMETTRE.";
    }

    this.mailToLink =
        'mailto:' + this.submitToEmail + '?subject=' + emailSubject + '&body=' + body;

  }

  mytest(contacts: Contact[]) {
    this.contactModel = [...contacts],
    console.log(Array.isArray(contacts), Array.isArray(this.contactModel), contacts===this.contactModel)
    this.updateActiveContactList(this.contactModel);
  }

  // update active contact list for Primary Contact component
  updateActiveContactList(contacts: Contact[]) {
    const activeCntList = contacts.filter(contact => this.activeContactStatuses.includes(contact.status._id));
    this.activeContacts = [];
    if (activeCntList) {
      activeCntList.forEach((contact: any) => {
        this.activeContacts.push(contact.full_name);
      });
    }
  }

  private _init(companyEnroll: DeviceCompanyEnrol){
    this.genInfoModel = companyEnroll.general_information;
    // set amend reasons and admin changes section to null if status is Final
    if (this._isFinal()) {   // ling todo review this
      this.genInfoModel.amend_reasons = null;
      // this.genInfoModel.are_licenses_transfered = '';
    }
    if (companyEnroll.administrative_changes) {
      this.adminChangesModel = companyEnroll.administrative_changes;
    }
    this.addressModel = companyEnroll.address;
    this.primContactModel = companyEnroll.primary_contact;
    const tContacts = companyEnroll.contacts['contact'];
    // if only one contact, convert it to an array
    this.contactModel = Array.isArray(tContacts) ? tContacts : [tContacts];
    if ( !this._utilsService.isEmpty(this.contactModel) ) {
      this.updateActiveContactList(this.contactModel);
    }else {
      this.contactModel = [];
    }
    this.showAmendNote = this._isFinal() && !this.isInternal;
    this._setShowAdminChangesFlag();    
  }

  private _isFinal(): boolean{
    return this.genInfoModel.status._id === EnrollmentStatus.Final;
  }

  private _setShowAdminChangesFlag(): void{

    this.selectedAmendReasonCodes = this._utilsService.getIdsFromIdTextLabels(this.genInfoModel.amend_reasons?.amend_reason);
    const areLicensesBeingTransfered =  this.genInfoModel.are_licenses_transfered;

    this.showAdminChanges = this._utilsService.isArray1ElementInArray2(this.selectedAmendReasonCodes, this.amendReasonCodesToShowAdminChanges) || areLicensesBeingTransfered === YES;
    
    // console.log("_setShowAdminChangesFlag()", "this.selectedAmendReasonCodes", this.selectedAmendReasonCodes, "areLicensesBeingTransfered", areLicensesBeingTransfered, "this.showAdminChanges", this.showAdminChanges);
  }
}
