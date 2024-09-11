import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ControlMessagesComponent, ConverterService, ICode, NO, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { DeclarationConformityService } from './declaration-conformity.service';
import { ActivityType, DeviceClass } from '../app.constants';
import { ApplicationInfoDetailsService } from '../application-info-details/application-info.details.service';

@Component({
  selector: 'app-declaration-conformity',
  templateUrl: './declaration-conformity.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DeclarationConformityComponent {
  public declarationLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() declarationModel;

  @Input() helpTextSequences;
  @Output() declarationErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public yesNoList: ICode[] = [];
  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private _fb: FormBuilder,
              private _globalService : GlobalService,
              private _declarationService : DeclarationConformityService,
              private _converterService : ConverterService,
              private _utilsService : UtilsService,
              private _appInfoService : ApplicationInfoDetailsService){

    this.showFieldErrors = false;
    this.showErrors = false;
    if (!this.declarationLocalModel) {
      this.declarationLocalModel = this._declarationService.getReactiveModel(this._fb);
    }           
              
  }

  async ngOnInit() {
    this.yesNoList = this._globalService.$yesNoList;
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
          temp.push(error);
        }
      );
    }
    this.declarationErrorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.declarationErrorList.emit(temp);
    }
    if (changes['declarationModel']) {
      const dataModel = changes['declarationModel'].currentValue;
      if (!this.declarationLocalModel) {
        this.declarationLocalModel = this._declarationService.getReactiveModel(this._fb);
        this.declarationLocalModel.markAsPristine();
      }
      this._declarationService.mapDataModelToFormModel(dataModel, this.declarationLocalModel);
    }
  }

  isMandatory() {
    if (this._appInfoService.raTypeLicence()
      && (this._appInfoService.deviceClassIII()
        || this._appInfoService.deviceClassIV())) {
      return true;
    }
    return false;
  }

  isOptional() {
    if (this._appInfoService.raTypeLicenceAmend()
      && (this._appInfoService.deviceClassIII()
        || this._appInfoService.deviceClassIV())) {
      return true;
    }
    return false;
  }

  isNoDeclaration() {
    if (this.declarationLocalModel.controls['declarationConformity'].value) {
      return (this.declarationLocalModel.controls['declarationConformity'].value === NO);
    }
    return false;
  }
}
