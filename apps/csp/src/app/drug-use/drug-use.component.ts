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
import { ICode, UtilsService, HelpSequence, BaseComponent } from '@hpfb/sdk/ui';
import { DrugUseService } from './drug-use.service';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-drug-use',
  templateUrl: './drug-use.component.html',
  styleUrl: './drug-use.component.css',
  providers: [DrugUseService],
  encapsulation: ViewEncapsulation.None,
})
export class DrugUseComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  drugUseOptions: ICode[] = [];
  @Input() drugUseModel: string;

  public drugUseForm: FormGroup;

  constructor(
    private drugUseService: DrugUseService,
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

    if (!this.drugUseForm) {
      this.drugUseForm = this.drugUseService.getDrugUseForm(this._fb);
    }

    this.drugUseOptions = this._globalService.drugUses;
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.drugUseForm.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    if (!this._utilsService.isFirstChange(changes)) {
      if (changes['drugUseModel']) {
        this.drugUseService.mapDataModelToFormModel(
          changes['drugUseModel'].currentValue,
          <FormGroup>this.drugUseForm
        );
      }
    }
  }
}
