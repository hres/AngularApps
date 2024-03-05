import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactListComponent } from "../contacts/contact-list/contact-list.component";
import { ContactStatus, ConvertResults, FileConversionService, UtilsService } from '@hpfb/sdk/ui';
import { Enrollment, DeviceCompanyEnrol, DemoContact, GeneralInformation } from '../models/Enrollment';
import { GlobalService } from '../global/global.service';
import { PrimaryContactComponent } from "../primary-contact/primary.contact.component";
import { FormBaseService } from './form-base.service';
import { CompanyInfoComponent } from '../company-info/company.info.component';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrl: './form-base.component.css',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ContactListComponent, PrimaryContactComponent, CompanyInfoComponent],
    providers: [FormBaseService, UtilsService, FileConversionService],
    encapsulation: ViewEncapsulation.None    
})
export class FormBaseComponent implements OnInit, AfterViewInit {
 
  @ViewChild(CompanyInfoComponent) companyInfoComponent: CompanyInfoComponent;
  @ViewChild(ContactListComponent) contactListComponent: ContactListComponent;

  myForm: FormGroup;

  public enrollModel: Enrollment;
  genInfoModel: GeneralInformation;
  contactModel: DemoContact[]; 

  public errorList = [];
  
  public rootTagText = "TEST_ENROL";
  public loadFileIndicator: boolean = false;

  // public activeContacts: string[] = [];
  // private activeContactStatuses: string[] = [ContactStatus.New, ContactStatus.Revise , ContactStatus.Active];

  formBaseService = inject(FormBaseService)
  
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder,  private _fileService: FileConversionService, private _globalService: GlobalService, private _utilsService: UtilsService) {
    // this.myForm = this.formBaseService.createMyFormGroup(this.fb);
  }

  ngOnInit(): void {

    if (!this._globalService.getEnrollment()) {
      // this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
      this.enrollModel = this.formBaseService.getEmptyEnrol();
      this._globalService.setEnrollment(this.enrollModel);
    } else {
      this.enrollModel = this._globalService.getEnrollment();
      // console.log("onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
    }

    const companyEnroll: DeviceCompanyEnrol = this.enrollModel[this.rootTagText]
    this._init(companyEnroll);
  }

  ngAfterViewInit(): void {
    // this.updateActiveContactList(this.contactListComponent.getContactsFormArrValues());
    // // to avoid ExpressionChangedAfterItHasBeenCheckedError, manually trigger change detection after changing activeContacts
    // this.cdr.detectChanges();
  }

  private _init(companyEnroll: DeviceCompanyEnrol){
    this.genInfoModel = companyEnroll.general_information;
    const tContacts = companyEnroll.contacts['contact'];
    // if only one contact, convert it to an array
    this.contactModel = Array.isArray(tContacts) ? tContacts : [tContacts];
  }

  private _buildfileName() {
    const date_generated = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    // if (this.isInternal) {
    //   return 'final-com-' + this.genInfoModel.company_id + '-' + date_generated;
    // } else if (this.genInfoModel.status._id === EnrollmentStatus.Amend) {
    //   return 'draft-com-' + this.genInfoModel.company_id + '-' + date_generated;
    // } else {
      return 'draft-com-' + date_generated;
    // }
  }

  public saveXmlFile() {
    console.log("saveXmlFile", this.errorList.length)
    // set the showErrors flag
    this._globalService.setShowErrors(this.errorList && this.errorList.length > 0 ? true : false)

    if (this._globalService.showErrors()) {
      document.location.href = '#topErrorSummary';
    } else {
      const result: Enrollment = this._prepareForSaving(true);
    }
  }

  public saveWorkingCopyFile() {
    const result = this._prepareForSaving(false);
    const fileName = this._buildfileName();
    this._fileService.saveJsonToFile(result, fileName, null);
  }  

  private _prepareForSaving(xmlFile: boolean): Enrollment {

    const companyInfoFormGroupValue = this.companyInfoComponent.generalInfoForm.value;
    const contactsFormArrValue = this.contactListComponent.getContactsFormArrValues();

    let output: Enrollment = { 
      TEST_ENROL: {
        general_information: this.formBaseService.map1(companyInfoFormGroupValue),
        contacts: {contact: this.formBaseService.map2(contactsFormArrValue)},
      },
    };
    console.log(output);

    return output;
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator = true;
    // const enrollment : Enrollment = fileData.data;
    const enrollment : Enrollment = this.formBaseService.getMockData();
    // this._loggerService.log('form.base', 'processingFile', JSON.stringify(enrollment, null, 2));
    this._globalService.setEnrollment(enrollment);

    const companyEnroll: DeviceCompanyEnrol = enrollment[this.rootTagText];
    this._init(companyEnroll);

    // if (this.isInternal) {
    //   // once load data files on internal site, lower components should update error list and push them up
    //   this.showErrors = true;
    // }
    // console.log("processFile", "internal?", this.isInternal, "this.showErrors", this.showErrors) 
  }  
}


