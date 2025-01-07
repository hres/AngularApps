import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { HcUseOnlyService } from './health-canada-only.service';

@Component({
  selector: 'app-health-canada-only',
  templateUrl: './health-canada-only.component.html',
  styleUrl: './health-canada-only.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class HcUseOnlyComponent  extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  hcUseOnlyForm: FormGroup;

  constructor(private hcUseOnlyService: HcUseOnlyService, private _fb: FormBuilder, private _globalService: GlobalService,
    private _utilsService: UtilsService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.hcUseOnlyForm) {
      this.hcUseOnlyForm = this.hcUseOnlyService.getHcUseOnlyForm(this._fb);
    }
  }

  getFormValue(){
    return this.hcUseOnlyForm.value;
  }

  checkDateValidity(event: any): void {
    const inputName = event.target.attributes.getNamedItem('ng-reflect-name')?.value;
    const dateControl = this.hcUseOnlyForm.get(inputName);
    const dateValue = dateControl.value;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

    if (!isValidFormat) {
      this.hcUseOnlyForm
            .get(inputName)
            .setErrors({ 'error.msg.invalidDate': true });
    } else {
      if (dateControl.errors?.['invalidDate']) {
        this.hcUseOnlyForm
            .get(inputName)
            .setErrors({ 'error.msg.invalidDate': true });
      }
    }
  }
  
  protected override emitErrors(errors: any[]){
    this.errorList.emit(errors);
  }

  ngOnChange(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
  }
}
