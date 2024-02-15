import {
    Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
  } from '@angular/core';
  import {FormGroup, FormBuilder} from '@angular/forms';
  import {ControlMessagesComponent, ICode, ICodeDefinition, LoggerService, UtilsService, YES} from '@hpfb/sdk/ui';
  import {CompanyAdminChangesService} from './company-admin.changes.service';
  import {HttpClient} from '@angular/common/http';
  import {TranslateService} from '@ngx-translate/core';
import { CompanyDataLoaderService } from '../form-base/company-data-loader.service';

  
  @Component({
    selector: 'comp-admin-changes',
    templateUrl: 'company-admin.changes.component.html',
    encapsulation: ViewEncapsulation.None
  })
  
  export class CompanyAdminChangesComponent implements OnInit, OnChanges, AfterViewInit {
  
    public adminChangesFormLocalModel: FormGroup;
    @Input('group') public adminChangesFormRecord: FormGroup;
    @Input() detailsChanged: any; // TODO: Change type
    @Input() showErrors: boolean;
    @Input() isInternal: boolean;
    @Input() slctAmendReasons;
    @Input() adminChangesModel;
    @Input() lang;
    @Input() helpTextSequences;
    @Output() adminChangesErrorList = new EventEmitter(true);
    // @Output() licenceErrorList = new EventEmitter(true);
    @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  
    public yesNoList: ICode[] = [];
    public showFieldErrors = false;
    public licenceModel = [];  // todo: clean up licence model code to remove it
    private adminChangesService: CompanyAdminChangesService;
    amendReasonDefs: string[] = [];
  
    constructor(private _fb: FormBuilder, private _utilsService: UtilsService, private _loggerService: LoggerService, private _formDataLoader: CompanyDataLoaderService) {
      this.showFieldErrors = false;
      this.showErrors = false;
      this.adminChangesService = new CompanyAdminChangesService();
    }
  
    ngOnInit() {
      if (!this.adminChangesFormLocalModel) {
        this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
      }
      this.detailsChanged = 0;

      this._formDataLoader.getKeywordList().subscribe((keywords) => {
        try {
          this.yesNoList = keywords.find(x => (x.name === 'yesno')).data;
        } catch (e) {
          console.error(e);
        }
      });
    }
  
    ngAfterViewInit() {
      this.msgList.changes.subscribe(errorObjs => {
        let temp = [];
        this._updateErrorList(errorObjs);
      });
      this.msgList.notifyOnChanges();
  
    }
  
    private _updateErrorList(errorObjs) {
      let temp = [];
      if (errorObjs) {
        errorObjs.forEach(
          error => {
            console.log("error in update error list", error);
            temp.push(error);
          }
        );
      }
      this.adminChangesErrorList.emit(temp);
    }
  
    ngOnChanges(changes: SimpleChanges) {
  
      // since we can't detect changes on objects, using a separate flag
      if (changes['detailsChanged']) { // used as a change indicator for the model
        // console.log("the details cbange");
        if (this.adminChangesFormRecord) {
          this.setToLocalModel();
  
        } else {
          this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
          this.adminChangesFormLocalModel.markAsPristine();
        }
      }
      if (changes['showErrors']) {
  
        this.showFieldErrors = changes['showErrors'].currentValue;
        let temp = [];
        if (this.msgList) {
          this.msgList.forEach(item => {
            temp.push(item);
            console.log("show errrors", item);
          });
        }
        this.adminChangesErrorList.emit(temp);
      }
      if (changes['slctAmendReasons']) {
        const amendReasonCodes: string[]= changes['slctAmendReasons'].currentValue;

        // lookup selected amend reasons' definitions
        this._formDataLoader.getAmendReasonList().subscribe((data) => {
          const amendReasonCodeList: ICodeDefinition[] = data;
          this.amendReasonDefs = [];
          
          for (const code of amendReasonCodes) {
            const codeDefinition = this._utilsService.findCodeDefinitionById(amendReasonCodeList, code);
            if (codeDefinition) {
              const defByLang = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
              if (defByLang) {
                this.amendReasonDefs.push(defByLang);
              }
            } else {
              this._loggerService.error("company.admin.change", "ngOnChange", "couldn't find code definition for ", code);
            }
          }
        });
      }
      if (changes['adminChangesFormLocalModel']) {
        this.adminChangesFormRecord = this.adminChangesFormLocalModel;
      }
      if (changes['adminChangesModel']) {
        const dataModel = changes['adminChangesModel'].currentValue;
        if (!this.adminChangesFormLocalModel) {
          this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
          this.adminChangesFormLocalModel.markAsPristine();
        }
        // if (dataModel.licence) {
        //   if (isArray(dataModel.licence)) {
        //     this.licenceModel = dataModel.licence;
        //   } else {
        //     this.licenceModel = [dataModel.licence];
        //   }
        // }
        CompanyAdminChangesService.mapDataModelToFormModel(dataModel, (<FormGroup>this.adminChangesFormLocalModel));
      }
    }
  
    /**
     * Uses the updated reactive forms model locally
     */
  
    setToLocalModel() {
      this.adminChangesFormLocalModel = this.adminChangesFormRecord;
      if (!this.adminChangesFormLocalModel.pristine) {
        this.adminChangesFormLocalModel.markAsPristine();
      }
    }
  
    onblur() {
      // console.log('input is typed');
      CompanyAdminChangesService.mapFormModelToDataModel((<FormGroup>this.adminChangesFormLocalModel),
        this.adminChangesModel, this.licenceModel);
    }
  
    licNumOnblur() {
      // console.log('license input is typed');
      if (this.adminChangesFormLocalModel.controls['licenceNumbers'].value) {
        const licArray = this.adminChangesFormLocalModel.controls['licenceNumbers'].value
          .split('\n').join(',').split(', ').join(',')
          .split(' ').join(',').split(';').join(',')
          .split('; ').join(',').split(':').join(',')
          .split(',');
        let templicNum = '';
        let tempLicStrs = '';
        if (licArray.length > 0) {
          templicNum = '000000' + licArray[0].replace(/[^0-9]/g, '');
          tempLicStrs = templicNum.slice(templicNum.length - 6);
          for (let i = 1; i < licArray.length; i++) {
            tempLicStrs += '\n';
            templicNum = '000000' + licArray[i].replace(/[^0-9]/g, '');
            tempLicStrs += templicNum.slice(templicNum.length - 6);
          }
          this.adminChangesFormLocalModel.controls['licenceNumbers'].setValue(tempLicStrs);
        }
      }
      console.log("impacted licence number length", this.adminChangesFormLocalModel.controls['licenceNumbers'].value.length);
      this.onblur();
    }
  
    // processLicenceErrors(errorList) {
    //   this.licenceErrorList.emit(errorList);
    //
    // }
  
    // processLicenceUpdate(licences) {
    //   this.licenceModel = licences;
    //   this.onblur();
    // }
  
    isReguChange() {
      if (this.adminChangesFormLocalModel.controls['isReguChange'].value &&
            this.adminChangesFormLocalModel.controls['isReguChange'].value === YES) {
        return true;
      } else {
        this.adminChangesFormLocalModel.controls['newCompanyId'].setValue(null);
        this.adminChangesFormLocalModel.controls['newCompanyId'].markAsUntouched();
        this.adminChangesFormLocalModel.controls['newContactId'].setValue(null);
        this.adminChangesFormLocalModel.controls['newContactId'].markAsUntouched();
        this.adminChangesFormLocalModel.controls['newContactName'].setValue(null);
        this.adminChangesFormLocalModel.controls['newContactName'].markAsUntouched();
      }
      return false;
    }
  }
  
  