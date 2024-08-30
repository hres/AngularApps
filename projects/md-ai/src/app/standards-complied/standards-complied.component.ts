import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ControlMessagesComponent, ConverterService, ICode, UtilsService, YES, NO } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { StandardsCompliedService } from './standards-complied.service.ts';

@Component({
  selector: 'app-standards-complied',
  templateUrl: './standards-complied.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StandardsCompliedComponent {
  public standardsCompliedLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() standardsCompModel;

  @Input() helpTextSequences;
  @Output() standardsCompErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public yesNoList: ICode[] = [];
  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private _fb: FormBuilder,
    private _globalService: GlobalService,
    private _standardsCompService: StandardsCompliedService,
    private _converterService: ConverterService,
    private _utilsService: UtilsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
    if (!this.standardsCompliedLocalModel) {
      this.standardsCompliedLocalModel = this._standardsCompService.getReactiveModel(this._fb);
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
    this.standardsCompErrorList.emit(temp);
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
    this.standardsCompErrorList.emit(temp);
  }
  if (changes['standardsCompModel']) {
    const dataModel = changes['standardsCompModel'].currentValue;
    if (!this.standardsCompliedLocalModel) {
      this.standardsCompliedLocalModel = this._standardsCompService.getReactiveModel(this._fb);
      this.standardsCompliedLocalModel.markAsPristine();
    }
    this._standardsCompService.mapDataModelToFormModel(dataModel, this.standardsCompliedLocalModel, this.lang);
  }
}

isNoDeclaration() {
  if (this.standardsCompliedLocalModel.controls['declarationConformity'].value) {
    return (this.standardsCompliedLocalModel.controls['declarationConformity'].value === NO);
  }
  return false;
}

}