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
import { ApplicationInfo, Enrollment, DeviceApplicationEnrol, Devices, BiologicalMaterials, Device, BiologicalMaterialData, BiologicalMaterial, PriorityReview } from '../models/Enrollment';
import { ApplicationInfoDetailsComponent } from '../application-info-details/application-info.details.component';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { MaterialModule } from '../bio-material/material.module';
import { MaterialService } from '../bio-material/material.service';
import { DeviceModule } from '../inter-device/device.module';
import { DeviceService } from '../inter-device/device.service';
import { PopupComponent } from '@hpfb/sdk/ui/popup/popup.component';
import $ from 'jquery';
import { PriorityReviewComponent } from '../priority-review/priority-review.component';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, DeviceModule, MaterialModule, FilereaderInstructionComponent, PopupComponent],
  providers: [FileConversionService, ApplicationInfoBaseService, FormDataLoaderService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() helpTextSequences;
  @ViewChild(ApplicationInfoDetailsComponent) aiDetails: ApplicationInfoDetailsComponent;
  @ViewChild(PriorityReviewComponent) priorityReview: PriorityReviewComponent;

  private _appInfoDetailErrors = [];
  private _deviceErrors = [];
  private _materialInfoErrors = []; 
  private _materialListErrors = [];
  private _priorityRevErrors = [];
  
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
  public priorityRevModel : PriorityReview;

  public fileServices: FileConversionService;
  public helpIndex: { [key: string]: number };

  popupId = 'saveXmlPopup';
  processXmlCount : number = 0;

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
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.$appVersion) + XSL_EXTENSION;
    this.helpIndex = this._globalService.getHelpIndex();

    effect(() => {
      // console.log("[effect3] device", this._deviceService.errors());
      // console.log("[effect3] material", this._materialService.materialListErrors());
      this._materialListErrors = this._materialService.getListErrors();
      this._materialInfoErrors = this._materialService.getInfoErrors();
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
    this.errorList = this.errorList.concat(this._appInfoDetailErrors.concat(this._deviceErrors.concat(this._materialInfoErrors.concat(this._materialListErrors.concat(this._priorityRevErrors))))); // .concat(this._theraErrors);
    // console.log("process errors in form base", this.errorList);
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
  
  processPriorityRevErrors(errorList) {
    this._priorityRevErrors = errorList;
    this.processErrors()
  }

  /**
   * Resets material errors when device class is changed from Class IV
   * @param reset : flag if material errors need to be reset
   */
  resetMaterialErrors(reset : boolean) {
    if (reset) {
      this._materialListErrors = [];
      this._materialInfoErrors = [];
    }
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    this.processXmlCount++;
    console.log("saving xml...");
    this.showErrors = true;
    this._globalService.setShowErrors(true);
    this.showDeviceErrorSummary();
    this.showMaterialSummary();

    // console.log("saving xml file...material errs", this._materialService.materialErrors())
    // this._materialService.showSummary.set(true);
    // this._deviceService.showDeviceErrorSummary.set(true);
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

    const priorityRevFormGroupValue = this.priorityReview.priorityReviewLocalModel.value;

    const output: Enrollment = this._baseService.mapFormToOutput(aiDetailsFormGroupValue, devicesFormArrayValue, materialInfoFormGroupValue, materialsFormArrayValue, priorityRevFormGroupValue);

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
  if (fileData.data !== null) {
    // this.loadFileIndicator++;
    const enrollment : Enrollment = fileData.data;
    console.log('processing file.....');
    console.log(enrollment);
    const applicationEnroll: DeviceApplicationEnrol = enrollment[this.rootTagText];
    this._init(applicationEnroll);
  }
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
    this.priorityRevModel = applicationEnroll.priority_review;
  }

  openPopup(){
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }

  showDeviceErrorSummary() {
    if (this.aiDetails.aiDevices.devicesFormArr) {
      const devicesFormArrayControls = this.aiDetails.aiDevices.devicesFormArr.controls;

      // If there's more than one device records that are created, and the first one is valid, set showErrorSummary to false -> Do not show error summary for records
      // below the first one - This is for when a record is created after generating XML/error summary for form is shown
      if ((devicesFormArrayControls.length > 1 && !devicesFormArrayControls[0].invalid)) {
        this._deviceService.showDeviceErrorSummaryOneRec.set(false);
      } else {
        this._deviceService.showDeviceErrorSummaryOneRec.set(true);
      }

      for (let i = 0; i < devicesFormArrayControls.length; i++) {
        // if (devicesFormArrayControls[i].invalid) {
        //   this._deviceService.showDeviceErrorSummary.set(true);
        // } 

        // If Generate XML is clicked for the first time and if there are any empty/unsaved records, show error summary
        if (this.processXmlCount == 1 && devicesFormArrayControls[i].invalid) {
          this._deviceService.showDeviceErrorSummaryOneRec.set(true);
        }
      }
    }
  }

  showMaterialSummary() {
    if (this.aiDetails.bioMaterialInfo) {

      if (this.aiDetails.bioMaterialInfo.aiMaterials) {
        const materialsFormArrayControls = this.aiDetails.bioMaterialInfo.aiMaterials.materialsFormArr.controls;

        // If there's more than one device records that are created, and the first one is valid, set showErrorSummary to false -> Do not show error summary for records
        // below the first one - This is for when a record is created after generating XML/error summary for form is shown
        if ((materialsFormArrayControls.length > 1 && !materialsFormArrayControls[0].invalid)) {
          this._materialService.showMaterialErrorSummaryOneRec.set(false);
        } else {
          this._materialService.showMaterialErrorSummaryOneRec.set(true);
        }

        for (let i = 0; i < materialsFormArrayControls.length; i++) {
          // if (materialsFormArrayControls[i].invalid) {
            // this._materialService.showMaterialErrorSummary.set(true);
          // } 

          // If Generate XML is clicked for the first time and if there are any empty/unsaved records, show error summary
          if (this.processXmlCount == 1 && materialsFormArrayControls[i].invalid) {
            this._materialService.showMaterialErrorSummaryOneRec.set(true);
          }
        }
      }
    }
  }

}