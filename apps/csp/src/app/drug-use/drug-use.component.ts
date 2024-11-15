import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ICode, UtilsService, HelpIndex, BaseComponent } from '@hpfb/sdk/ui';
import { DrugUseService } from './drug-use.service';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-drug-use',
  templateUrl: './drug-use.component.html',
  styleUrl: './drug-use.component.css',
  providers:  [ DrugUseService ]
})
export class DrugUseComponent  extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  drugUseOptions: ICode[] = [];

  public drugUseForm: FormGroup;

  constructor(private drugUseService: DrugUseService, private _fb: FormBuilder, private _globalService: GlobalService,
     private _utilsService: UtilsService ) {
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
      const isFirstChange = this._utilsService.isFirstChange(changes);
    }
}
