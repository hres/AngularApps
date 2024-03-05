import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CompanyInfoService} from './company.info.service';
import { ControlMessagesComponent, FINAL, UtilsService, LoggerService, YES, ICode, ConverterService, CheckboxOption, ICodeDefinition, IIdTextLabel, ErrorModule, PipesModule } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from '../../../../md-co/src/app/form-base/company-data-loader.service';
// import { EnrollmentStatus} from '../app.constants';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../global/global.service';
import { GeneralInformation } from '../models/Enrollment';

@Component({
  selector: 'com-gen-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorModule, PipesModule],
  providers: [CompanyInfoService, CompanyDataLoaderService],
  templateUrl: 'company.info.component.html',
  encapsulation: ViewEncapsulation.None
})

export class CompanyInfoComponent implements OnInit, OnChanges, AfterViewInit {

  public generalInfoForm: FormGroup;
  lang: string;
  
  @Input() genInfoModel: GeneralInformation;

  @Input() showErrors: boolean;


  @Output() errorList = new EventEmitter(true);
  @Output() updatedGenInfo = new EventEmitter(true);

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public showFieldErrors: boolean;

  public yesNoList: ICode[] = [];

  constructor(private cdr: ChangeDetectorRef, private _companyInfoService: CompanyInfoService, private _formDataLoader: CompanyDataLoaderService, private _globalService: GlobalService,
    private _utilsService: UtilsService) {
    this.showFieldErrors = false;
    this.lang = this._globalService.getCurrLanguage(); 
    this.generalInfoForm = this._companyInfoService.getReactiveModel();
  }

  ngOnInit() {
    this._formDataLoader.getKeywordList().subscribe((keywords) => {
      try {
        // this._loggerService.log('company.info', 'onInit', keywords);
        this.yesNoList = keywords.find(x => (x.name === 'yesno')).data;
        // this._loggerService.log('company.info', '' + JSON.stringify(this.yesNoList));
      } catch (e) {
        console.error(e);
      }
    });
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    // const isFirstChange = this._utilsService.isFirstChange(changes);

    // // Ignore first trigger of ngOnChanges
    // if (!isFirstChange) {
    //       // since we can't detect changes on objects, using a separate flag
    //   if (changes['detailsChanged']) { // used as a change indiitemor for the model
    //     // console.log("the details cbange");
    //     if (this.generalInfoFormRecord) {
    //       this.setToLocalModel();

    //     } else {
    //       this.generalInfoFormLocalModel = this._companyInfoService.getReactiveModel();
    //       this.generalInfoFormLocalModel.markAsPristine();
    //     }
    //     if (this.generalInfoFormLocalModel ) {
    //       this._saveData();
    //     }
    //   }
    //   if (changes['showErrors']) {

    //     this.showFieldErrors = changes['showErrors'].currentValue;
    //     let temp = [];
    //     if (this.msgList) {
    //       this.msgList.forEach(item => {
    //         temp.push(item);
    //         // console.log(item);
    //       });
    //     }
    //     this.errorList.emit(temp);
    //   }
      if (changes['genInfoModel']) {
        this._init(changes['genInfoModel'].currentValue);
      }
    //   if(changes['enrollmentStatusesList']) {
    //     this._companyInfoService.setEnrolmentStatus((<FormGroup>this.generalInfoFormLocalModel), this.generalInfoFormLocalModel.controls['formStatus'].value, this.enrollmentStatusesList, this.lang, false);
    //   }
    // }
  }

  private _init(generalInformationData: GeneralInformation) {
    if (generalInformationData) {
      this.generalInfoForm.patchValue({ 
        areLicensesTransfered: generalInformationData.are_licenses_transfered
      })
    }
  }
  
}

