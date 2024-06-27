import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent, ErrorModule, HelpIndex, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Certification } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { CertificationService } from './certification.service';

@Component({
  selector: 'certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CertificationComponent extends BaseComponent implements OnInit{

  lang: string;
  helpIndex: HelpIndex; 
  public showFieldErrors: boolean = false;
  public certificationForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: Certification;
  @Output() errorList = new EventEmitter(true);

  constructor(private _certificationService: CertificationService, private _fb: FormBuilder, private _utilsService: UtilsService,
    //private _entityBaseService: EntityBaseService,  
    private _globalService: GlobalService) {
      super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.certificationForm) {
      this.certificationForm = this._certificationService.getReactiveModel(this._fb);
    }

  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
        const temp = [];
        if (this.msgList) {
          this.msgList.forEach((item) => {
            temp.push(item);
            // console.log(item);
          });
        }
        this.errorList.emit(temp);
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as Certification;
        this._certificationService.mapDataModelToFormModel(dataModelCurrentValue, (<FormGroup>this.certificationForm));
      }
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.certificationForm.get('submitDate'), 'invalidDate');
  }  

    getFormValue() {
    return this.certificationForm.value;
  }
}