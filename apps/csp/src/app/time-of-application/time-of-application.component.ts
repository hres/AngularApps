import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpSequence, ICodeAria, UtilsService } from '@hpfb/sdk/ui';
import { TimingOfApplicationService } from './time-of-application.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { Ectd } from '../models/transaction';

@Component({
  selector: 'app-time-of-application',
  templateUrl: './time-of-application.component.html',
  styleUrl: './time-of-application.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TimeOfApplicationComponent extends BaseComponent implements OnInit{


  public lang: string;
  helpIndex: HelpSequence;
  showFieldsErrors: boolean = false;

  public timingOfApplicationForm: FormGroup;
  @Input() showErrors: boolean = false;
  public showFieldErrors: boolean = false;
  @Output() errorlis = new EventEmitter(true);
  selectedTimingOfApplicant: string;
  timingOfApplicantOptions: ICodeAria[] = [];
  @Output() errorList = new EventEmitter(true);
  @Input() dataModel: Ectd;

  constructor(private _timingOfApplicationService: TimingOfApplicationService, private _fb: FormBuilder, private _globalService: GlobalService, private _utilsService: UtilsService){
    super();
    this.showFieldsErrors = false;

  }
  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }




  ngOnInit(): void {
   this.lang = this._globalService.currLanguage;
   this.helpIndex = this._globalService.helpIndex;
   if(!this.timingOfApplicationForm){
   this.timingOfApplicationForm = this._timingOfApplicationService.getTimingOfApplicationForm(this._fb);
   }

   this.timingOfApplicantOptions = this._globalService.timingOfApplicant;
  }

  onTimingSelected(e: any): void {
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.timingOfApplicantOptions, this.timingOfApplicationForm.get('timingOfApplicant').value);
    this.selectedTimingOfApplicant = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }

  ngOnChanges(changes: SimpleChanges) {
      this.showFieldErrors = this.showErrors || this.showFieldErrors;
      const isFirstChange = this._utilsService.isFirstChange(changes);
    }

  getFormValue() {
    return this.timingOfApplicationForm.value;
  }

}
