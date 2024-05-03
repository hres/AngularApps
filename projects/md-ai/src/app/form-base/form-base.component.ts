import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG, XSL_EXTENSION } from '../app.constants';
import {  ICode, ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, YES, NO } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { ApplicationInfoBaseService } from './application-info-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, Enrollment, DeviceApplicationEnrol, Devices, BiologicalMaterials, Device, BiologicalMaterialData, BiologicalMaterial } from '../models/Enrollment';
import { ApplicationInfoDetailsComponent } from '../application-info-details/application-info.details.component';
// import { DeviceModule } from '../device/device.module';
import { MaterialModule } from '../bio-material/material.module';
import { MaterialService } from '../bio-material/material.service';
import { DeviceModule } from '../inter-device/device.module';
import { DeviceService } from '../inter-device/device.service';
import { PopupComponent } from '@hpfb/sdk/ui/popup/popup.component';
import $ from 'jquery';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, DeviceModule, MaterialModule, PopupComponent],
  providers: [FileConversionService, ApplicationInfoBaseService, FormDataLoaderService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() helpTextSequences;
  @ViewChild(ApplicationInfoDetailsComponent) aiDetails: ApplicationInfoDetailsComponent;

  private _appInfoDetailErrors = [];
  private _deviceErrors = [];
  private _materialErrors = []; // Combines material info and material list errors
  
  //computed(() => {
    // console.log("computed", this._materialService.errors());
    // this._materialErrors = this._materialService.errors();
    // this.processErrors(); });
  public applicationForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  private xslName: string;

  public countryList = [];

  public userList = [];
  public showErrors: boolean;
  public isSolicitedFlag: boolean;
  public title = '';
  public headingLevel = 'h2';

  lang = this._globalService.lang();
  

  public enrollModel : Enrollment;
  public appInfoModel : ApplicationInfo; 
  public transactionModel: Enrollment;
  public deviceModel: Device[];
  public materialInfo: BiologicalMaterialData;

  public fileServices: FileConversionService;
  public helpIndex: { [key: string]: number };

  popupId = 'saveXmlPopup';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private cdr: ChangeDetectorRef,
    private _baseService: ApplicationInfoBaseService,
    private _fileService: FileConversionService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService,
    private _converterService: ConverterService,
    private _materialService: MaterialService,
    private _deviceService: DeviceService,
    private fb: FormBuilder
  ) {
    this.userList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + XSL_EXTENSION;
    this.helpIndex = this._globalService.getHelpIndex();

    effect(() => {
      // console.log("[effect3] device", this._deviceService.errors());
      // console.log("[effect3] material", this._materialService.errors());
      this._materialErrors = this._materialService.materialErrors();
      this.processErrors();
    });
    effect(() => {
      this._deviceErrors = this._deviceService.deviceErrors();
      this.processErrors();
    })
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

      const applicationEnroll: DeviceApplicationEnrol = this.enrollModel[this.rootTagText];
      this._init(applicationEnroll);

      //this.helpIndex = this._globalService.getHelpIndex();

    } catch (e) {
      console.error(e);
    }      
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base comp');
    this.errorList = [];
    // concat the two array
    this.errorList = this.errorList.concat(this._appInfoDetailErrors.concat(this._deviceErrors.concat(this._materialErrors))); // .concat(this._theraErrors);
    // console.log("process errors in form base", this.errorList);
    this.errorList.sort((a, b) => a.errorNumber - b.errorNumber);
    // console.log(this.errorList);
    // console.log("printing material errors", this._materialErrors);
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

  /**
   * Resets material errors when device class is changed from Class IV
   * @param reset : flag if material errors need to be reset
   */
  resetMaterialErrors(reset : boolean) {
    if (reset) {
      this._materialErrors = [];
      this._materialService.showSummary.set(false);
    }
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    console.log("saving xml...");
    this.showErrors = true;
    this._globalService.setShowErrors(true);
    this._materialService.showSummary.set(true);
    this._deviceService.showDeviceErrorSummary.set(true);
    this.processErrors();
    if (this.errorList && this.errorList.length > 0) {
      document.location.href = '#topErrorSummary';
    } else {
      const aiDevices = this.aiDetails.aiDevices;
      
      let aiMaterials;
      if (this.aiDetails.bioMaterialInfo) {
        aiMaterials = this.aiDetails.bioMaterialInfo.aiMaterials;
      }

      if (aiMaterials && !aiDevices) {
        if (this.aiDetails.bioMaterialInfo.aiMaterials.materialListForm.pristine) {
          this.prepareXml();
        } else {
            this.openPopup();
        }
      } 

      if (!aiMaterials && aiDevices) {
        if (this.aiDetails.aiDevices.deviceListForm.pristine) {
          this.prepareXml();
        } else {
            this.openPopup();
        }
      }

      if (aiMaterials && aiDevices) {
        if (this.aiDetails.aiDevices.deviceListForm.pristine && this.aiDetails.bioMaterialInfo.aiMaterials.materialListForm.pristine) {
          this.prepareXml();
        } else {
            this.openPopup();
        }
      }
    }
  }

  public prepareXml() {
    const result: Enrollment = this._prepareForSaving(true);
    const fileName: string = this._buildfileName(result);
    this._fileService.saveXmlToFile(result, fileName, true, this.xslName);
  }

  public saveWorkingCopyFile() {
    const result: Enrollment = this._prepareForSaving(false);
    const fileName: string = this._buildfileName(result);
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
    let devicesFormArrayValue = null;
    let materialInfoFormGroupValue = null;
    let materialsFormArrayValue = null;

    const aiDetailsFormGroupValue = this.aiDetails.appInfoFormLocalModel.value;

    if (this.aiDetails.aiDevices.devicesFormArr) {
      devicesFormArrayValue = this.aiDetails.aiDevices.devicesFormArr.value
    }

    if (this.aiDetails.bioMaterialInfo) {
      materialInfoFormGroupValue = this.aiDetails.bioMaterialInfo.materialInfoForm.value;

      if (this.aiDetails.bioMaterialInfo.aiMaterials) {
        materialsFormArrayValue = this.aiDetails.bioMaterialInfo.aiMaterials.materialsFormArr.value;
      }
    }

    const output: Enrollment = this._baseService.mapFormToOutput(aiDetailsFormGroupValue, devicesFormArrayValue, materialInfoFormGroupValue, materialsFormArrayValue);

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.DEVICE_APPLICATION_INFO[CHECK_SUM_CONST] = "";   // this is needed for generating the checksum value
      output.DEVICE_APPLICATION_INFO[CHECK_SUM_CONST] = this._checkSumService.createHash(output);
    }

    return output;
  }

  private _buildfileName(output: Enrollment): string {
    return 'ai-' + output.DEVICE_APPLICATION_INFO.application_info.dossier_id + '-' + output.DEVICE_APPLICATION_INFO.application_info.last_saved_date;

  }

 public processFile(fileData : ConvertResults) {
  // this.loadFileIndicator++;
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
    this.materialInfo = applicationEnroll.material_info;
  }

  openPopup(){
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }

}