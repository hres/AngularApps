import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG, XSL_EXTENSION } from '../app.constants';
import {  ICode, ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, YES, NO } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { ApplicationInfoBaseService } from './application-info-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, Enrollment, Device, BiologicalMaterial } from '../models/Enrollment';
import { ApplicationInfoDetailsComponent } from '../application-info-details/application-info.details.component';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule],
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
  public transactionForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  private xslName: string;

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
  public materialModel: BiologicalMaterial[];

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
    private _converterService: ConverterService
  ) {
    this.userList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + XSL_EXTENSION;
  }

  ngOnInit() {
    console.log(this._globalService.$deviceClassesList)
    // if (!this.transactionForm) {
    //   this.transactionForm = this._baseService.getReactiveModel();
    // }
    // this.userList = await (this.dataLoader.getRequesters(this.translate.currentLang));
    this.helpIndex = this._globalService.getHelpIndex();
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

  private _checkMaterialModel() {
    if (this.appInfoModel.is_animal_human_sourced !== YES) {
      this.materialModel = [];
    }
  }

  disableSaveXmlButton(declarationConformity) {
  //   console.log('declarationConformity' + declarationConformity);
  //   this.disableSaveXml = !(declarationConformity === YES);
  }

  public saveXmlFile() {
    // this._updatedAutoFields();
    // this.showErrors = false;
    // if (this.errorList && this.errorList.length > 0) {
    //   this.showErrors = true;
    //   document.location.href = '#topErrorSummary';
    // } else {
    //   if (this._isInputsSaved()) {
    //     this._checkMaterialModel();
    //     const result = {
    //       'DEVICE_APPLICATION_INFO': {
    //         'application_info': this.appInfoModel,
    //         'devices': {},
    //         'materials': {}
    //       }
    //     };
    //     if (this.deviceModel && (this.deviceModel).length > 0) {
    //       result.DEVICE_APPLICATION_INFO.devices = {device: this.deviceModel};
    //     }
    //     if (this.materialModel && (this.materialModel).length > 0) {
    //       result.DEVICE_APPLICATION_INFO.materials = {material: this.materialModel};
    //     }
    //     const fileName = 'ai-' + this.appInfoModel.dossier_id + '-' + this.appInfoModel.last_saved_date;
    //     this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    //   } else {
    //     if (this.lang === GlobalsService.ENGLISH) {
    //       alert('Please save the unsaved input data before generating XML file.');
    //     } else {
    //       alert('Veuillez sauvegarder les données d\'entrée non enregistrées avant de générer le fichier XML.');
    //     }
    //   }
    // }
  }

  private _isInputsSaved() {
    // if (this.aiDetails.bioMaterials) {
    //   return (this.aiDetails.aiDevices.deviceListForm.pristine &&
    //     (this.aiDetails.bioMaterials.materialListForm ? this.aiDetails.bioMaterials.materialListForm.pristine : true) &&
    //     (this.aiDetails.bioMaterials.newMaterialForm ? this.aiDetails.bioMaterials.newMaterialForm.pristine : true));
    // } else {
    //   return this.aiDetails.aiDevices.deviceListForm.pristine;
    // }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    this._checkMaterialModel();
    const result = {'DEVICE_APPLICATION_INFO': {
      'application_info': this.appInfoModel,
      'devices': {
        'device': this.deviceModel
      },
      'materials': {
        'material': this.materialModel
      }
    }};
    const fileName = 'ai-' + this.appInfoModel.dossier_id + '-' + this.appInfoModel.last_saved_date;
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.appInfoModel = fileData.data.DEVICE_APPLICATION_INFO.application_info;
    const dev = fileData.data.DEVICE_APPLICATION_INFO.devices.device;
    if (dev) {
      this.deviceModel = (dev instanceof Array) ? dev : [dev];
    }
    const mat = fileData.data.DEVICE_APPLICATION_INFO.materials.material;
    if (mat) {
      this.materialModel = (mat instanceof Array) ? mat : [mat];
    }
  }

  private _updatedSavedDate() {
    // const today = new Date();
    // const pipe = new DatePipe('en-US');
    // this.appInfoModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd-hhmm');
  }

  private _updatedAutoFields() {
    // this._updatedSavedDate();
    // const version: Array<any> = this.appInfoModel.enrol_version.split('.');
    // version[0] = (Number(version[0]) + 1).toString();
    // this.appInfoModel.enrol_version = version[0] + '.' + version[1];
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

}