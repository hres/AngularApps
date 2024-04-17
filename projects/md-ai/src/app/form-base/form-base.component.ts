import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG, XSL_EXTENSION } from '../app.constants';
import {  ICode, ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, YES, NO } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { ApplicationInfoBaseService } from './application-info-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, Enrollment, DeviceApplicationEnrol, Devices, BiologicalMaterials, Device } from '../models/Enrollment';
import { ApplicationInfoDetailsComponent } from '../application-info-details/application-info.details.component';
import { DeviceModule } from '../device/device.module';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, DeviceModule],
  providers: [FileConversionService, ApplicationInfoBaseService, FormDataLoaderService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() lang;
  @Input() helpTextSequences;
  // @ViewChild(ApplicationInfoDetailsComponent, {static: false}) aiDetails: ApplicationInfoDetailsComponent;

  private _appInfoDetailErrors = [];
  private _deviceErrors = [];
  private _materialErrors = [];
  public applicationForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  private xslName: string;

  public loadFileIndicator = 0;

  public countryList = [];

  public userList = [];
  public showErrors: boolean;
  public isSolicitedFlag: boolean;
  public title = '';
  public headingLevel = 'h2';
  

  public enrollModel : Enrollment;
  public appInfoModel : ApplicationInfo; 
  public transactionModel: Enrollment;
  public deviceModel: Device[];
  public materialModel: BiologicalMaterials;

  public fileServices: FileConversionService;
  public helpIndex: { [key: string]: number };
  //public disableSaveXml = true;


  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private cdr: ChangeDetectorRef,
    private _baseService: ApplicationInfoBaseService,
    private _fileService: FileConversionService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService,
    private _converterService: ConverterService,
    private fb: FormBuilder
  ) {
    this.userList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + XSL_EXTENSION;
    this.helpIndex = this._globalService.getHelpIndex();
  }

  ngOnInit() {
    // this means it's associated with a reactive form, and Angular automatically prevents the default form submission behavior
    this.applicationForm = this.fb.group({}); 

    try {
      if (!this._globalService.getEnrollment()) {
        // this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.setEnrollment(this.enrollModel);
      } else {
        this.enrollModel = this._globalService.getEnrollment();
        // console.log("onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
      }

      const transactionEnroll: DeviceApplicationEnrol = this.enrollModel[this.rootTagText];
      this._init(transactionEnroll);

      //this.helpIndex = this._globalService.getHelpIndex();

    } catch (e) {
      console.error(e);
    }      
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._appInfoDetailErrors.concat(this._deviceErrors.concat(this._materialErrors)); // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processDetailErrors(errorList) {
    this._appInfoDetailErrors = errorList;
    this.processErrors();
  }

  processDeviceErrors(errorList) {
    this._deviceErrors = errorList;
    this.processErrors();
  }

  processMaterialtErrors(errorList) {
    this._materialErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      const result: Enrollment = this._prepareForSaving(true);
      const fileName: string = this._buildfileName(result);
      this._fileService.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    const result: Enrollment = this._prepareForSaving(false);
    const fileName: string = this._buildfileName(result);
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
    const output: Enrollment = {
       'DEVICE_APPLICATION_INFO': {
         'template_version': this._globalService.$appVersion,
         'form_language': this._globalService.getCurrLanguage(),
         'application_info': this.appInfoModel,
         'devices': {device: this.deviceModel},
         'biological_materials': this.materialModel
        }
    };

    // update the last_saved_date
    output.DEVICE_APPLICATION_INFO.application_info.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm')

    return output;
  }

  private _buildfileName(output: Enrollment): string {
    return 'ai-' + output.DEVICE_APPLICATION_INFO.application_info.dossier_id + '-' + output.DEVICE_APPLICATION_INFO.application_info.last_saved_date;

  }

 public processFile(fileData : ConvertResults) {
  this.loadFileIndicator++;
  const enrollment : Enrollment = fileData.data;
  console.log('processing file.....');
  console.log(enrollment);
  const applicationEnroll: DeviceApplicationEnrol = enrollment[this.rootTagText];
  this._init(applicationEnroll);
 }

  public preload() {
    // console.log("Calling preload")
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  private _init(applicationEnroll: DeviceApplicationEnrol) {
    this.appInfoModel = applicationEnroll.application_info;
    const tDevices = applicationEnroll.devices['device'];
    this.deviceModel = Array.isArray(tDevices) ? tDevices : [tDevices];
    if (this._utilsService.isEmpty(this.deviceModel)) {
      this.deviceModel = [];
    }
    this.materialModel = applicationEnroll.biological_materials;
  }

}