import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {  UtilsService,  HelpIndex,  BaseComponent,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { FormBaseService } from '../form-base/form-base.service';
import { PatentService } from './patent-service.service';
@Component({
  selector: 'app-patent',
  templateUrl: './patent.component.html',
  styleUrl: './patent.component.css',
})
export class PatentComponent extends BaseComponent implements OnInit {
  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public patentInformationForm: FormGroup;

  constructor(
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

    if (!this.patentInformationForm) {
      this.patentInformationForm = PatentService.getPatentInformationForm(
        this._fb
      );
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  checkDateValidity(event: any): void {
    let inputName =
      event.target.attributes.getNamedItem('ng-reflect-name').value;
    this._utilsService.checkInputValidity(
      event,
      this.patentInformationForm.get(inputName),
      'invalidDate'
    );
    if (this.patentInformationForm != undefined) {
      let patendExpirationDate = this.patentInformationForm.get(
        'patendExpirationDate'
      );
      let patentGrandDate = this.patentInformationForm.get('patentGrandDate');
      let patentFillingDate =
        this.patentInformationForm.get('patentFillingDate');

      if (
        patendExpirationDate.valid &&
        patentGrandDate.valid &&
        patentFillingDate.valid
      )
        if (
          patendExpirationDate.value <= patentGrandDate.value ||
          patendExpirationDate.value <= patentFillingDate.value ||
          patentGrandDate.value < patentFillingDate.value
        ) {
          // const temp = [];
          this.patentInformationForm
            .get(inputName)
            .setErrors({ 'error.msg.invalidDate': true });
          //  this.emitErrors(temp);
        }
    }
  }

  getFormValue() {
    return this.patentInformationForm.value;
  }
}
