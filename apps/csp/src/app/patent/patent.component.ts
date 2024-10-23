
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren, ViewEncapsulation,
  computed,
  signal
} from '@angular/core';
import { ICodeDefinition, ICodeAria, ICode, IParentChildren, EntityBaseService, UtilsService, ErrorModule, PipesModule, HelpIndex, BaseComponent } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Ectd } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { FormBaseService } from '../form-base/form-base.service';
import { PatentService } from './patent-service.service';
@Component({
  selector: 'app-patent',
  templateUrl: './patent.component.html',
  styleUrl: './patent.component.css'
})
export class PatentComponent  extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public patentInformationForm: FormGroup;

  constructor(private patentService: PatentService, private _fb: FormBuilder, private _globalService: GlobalService,
     private formBaseService: FormBaseService, private _utilsService: UtilsService ) {
    super();
    this.showFieldErrors = false;
  }
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.patentInformationForm) {
      this.patentInformationForm = PatentService.getPatentInformationForm(this._fb);
    }

    }

    protected override emitErrors(errors: any[]): void {
       this.errorList.emit(errors);
    }

    checkDateValidity(event: any ): void {
      let inputName = event.target.attributes.getNamedItem('ng-reflect-name').value;
      this._utilsService.checkInputValidity(event, this.patentInformationForm.get(inputName), 'invalidDate');
    }

    getFormValue() {
      return this.patentInformationForm.value;
    }
}
