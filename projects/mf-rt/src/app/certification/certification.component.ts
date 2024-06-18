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
  public mfCertificationForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: Certification;
  @Output() errorList = new EventEmitter(true);

  constructor(private _certificationService: CertificationService, private _fb: FormBuilder, private _utilsService: UtilsService,
    //private _entityBaseService: EntityBaseService,  
    private _globalService: GlobalService) {
      super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.mfCertificationForm) {
      this.mfCertificationForm = this._certificationService.getReactiveModel(this._fb);
    }

  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['certificationModel']) {
      const dataModel = changes['certificationModel'].currentValue;
      if (!this.mfCertificationForm) {
        this.mfCertificationForm = this._certificationService.getReactiveModel(this._fb);
        this.mfCertificationForm.markAsPristine();
      }
      this._certificationService.mapDataModelToFormModel(dataModel, (<FormGroup>this.mfCertificationForm));
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.mfCertificationForm.get('submitDate'), 'invalidDate');
  }  
}
