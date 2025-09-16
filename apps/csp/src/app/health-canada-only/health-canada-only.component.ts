import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpSequence, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { HcUseOnlyService } from './health-canada-only.service';
import { HcUse } from '../models/transaction';

@Component({
  selector: 'app-health-canada-only',
  templateUrl: './health-canada-only.component.html',
  styleUrl: './health-canada-only.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class HcUseOnlyComponent extends BaseComponent implements OnInit, OnChanges {
  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  hcUseOnlyForm: FormGroup;
  @Input() hcuseOnlyModel: HcUse;

  constructor(
    private hcUseOnlyService: HcUseOnlyService,
    private _fb: FormBuilder,
    private _globalService: GlobalService,
    private _utilsService: UtilsService
  ) {
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

  getFormValue() {
    return this.hcUseOnlyForm.value;
  }

  onDateInput(event: any): void {
    this._globalService.isDateValid(event, this.hcUseOnlyForm);
  }

  protected override emitErrors(errors: any[]) {
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
    if (!isFirstChange) {
      if (changes['hcuseOnlyModel']) {
        const hcuseOnlyModel = changes['hcuseOnlyModel'].currentValue as HcUse;
        this.hcUseOnlyService.mapDataModelToFormModel( hcuseOnlyModel, <FormGroup>this.hcUseOnlyForm );
      }
    }
  }
}
