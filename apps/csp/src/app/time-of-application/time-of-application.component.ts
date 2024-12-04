import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpIndex, ICodeAria, UtilsService } from '@hpfb/sdk/ui';
import { TimeOfApplicationService } from './time-of-application.service';
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
  helpIndex: HelpIndex;
  showFieldsErrors: boolean = false;

  public timeOfApplicationForm: FormGroup;
  @Input() showErrors: boolean = false;
  public showFieldErrors: boolean = false;
  @Output() errorlis = new EventEmitter(true);
  selectedTimmingOfApplicant: string;
  timmingOfApplicantOptions: ICodeAria[] = [];
  @Output() errorList = new EventEmitter(true);
  @Input() dataModel: Ectd;

  constructor(private _timeOfApplicationService: TimeOfApplicationService, private _fb: FormBuilder, private _globalService: GlobalService, private _utilsService: UtilsService){

  super();
  this.showFieldsErrors = false;

  }
  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }




  ngOnInit(): void {
   this.lang = this._globalService.currLanguage;
   this.helpIndex = this._globalService.helpIndex;
   if(!this.timeOfApplicationForm){
   this.timeOfApplicationForm = this._timeOfApplicationService.getTimeOfApplicationForm(this._fb);
   }

   this.timmingOfApplicantOptions = this._globalService.timmingOfApplicant;
  }

  onTimmingSelected(e: any): void {
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.timmingOfApplicantOptions, this.timeOfApplicationForm.get('timmingOfApplicant').value);
    this.selectedTimmingOfApplicant = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }

  ngOnChanges(changes: SimpleChanges) {
      this.showFieldErrors = this.showErrors || this.showFieldErrors;
      const isFirstChange = this._utilsService.isFirstChange(changes);
    }

  getFormValue() {
    return this.timeOfApplicationForm.value;
  }

}
