import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {  UtilsService,  HelpIndex,  BaseComponent,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { ApplicantService } from './applicant-service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ApplicantComponent extends BaseComponent implements OnInit {
  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public applicantInformationForm: FormGroup;

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

    if (!this.applicantInformationForm) {
      this.applicantInformationForm = ApplicantService.getApplicantInformationForm(
        this._fb
      );
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.applicantInformationForm.value;
  }
}
