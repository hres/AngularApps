import {Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { ROOT_TAG } from '../app.constants';
import { RegulatoryInformationComponent } from "../regulatory-information/regulatory-information.component";
import { RegulatoryInformation } from '../models/transaction';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
processFile($event: any) {
throw new Error('Method not implemented.');
}
  public errors;
  @Input() lang;
  @Input() helpTextSequences;

  public helpIndex: { [key: string]: number }; // todo CompanyBaseService.getHelpTextIndex();
  public masterFileForm: FormGroup;
  public rootTagText = ROOT_TAG; 
  public showErrors: boolean;
  public errorList = [];
  public headingLevel = 'h2';

  private _regulatoryInfoErrors = [];

  public regulatoryInfoModel: RegulatoryInformation;

  @ViewChild(RegulatoryInformationComponent) regulatoryInfoComponent: RegulatoryInformationComponent;
 
  constructor(private _globalService: GlobalService, private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {

  }
  
  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }
  ngOnInit(): void {
    try {

      this.helpIndex = this._globalService.getHelpIndex();
      this.masterFileForm = this.fb.group({}); 

    } catch (e) {
      console.error(e);
    }
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    // concat the error arrays
    this.errorList = this.errorList.concat(this._regulatoryInfoErrors);

    this.cdr.detectChanges(); // doing our own change detection
  }

  processRegulatoryInfoErrors(errorList) {
    this._regulatoryInfoErrors = errorList;
    this.processErrors();
  }

  public saveXmlFile() {
	  this.showErrors = true;
    this.processErrors();

    if (this.errorList && this.errorList.length > 0) {
      document.location.href = '#topErrorSummary';
    } else {
      // const result: Enrollment = this._prepareForSaving(true);
      // const fileName: string = this._buildfileName(result);
      // const xslName: string = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.$appVersion) + '.xsl';
      // this._fileService.saveXmlToFile(result, fileName, true, xslName);
    }
  }

  public saveWorkingCopyFile() {
    // const result: Enrollment = this._prepareForSaving(false);
    // const fileName: string = this._buildfileName(result);
    // this._fileService.saveJsonToFile(result, fileName, null);
  }
}