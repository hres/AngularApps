import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.css',
  providers:  [ CertificationService ],
  encapsulation: ViewEncapsulation.None,
})

export class CertificationComponent  extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  certificationForm: FormGroup;

  constructor(private certificationService: CertificationService, private _fb: FormBuilder, private _globalService: GlobalService,
    private _utilsService: UtilsService) {
   super();
   this.showFieldErrors = false;
 }

 ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.certificationForm) {
      this.certificationForm = this.certificationService.getCertificationForm(this._fb);
    }

  }

  getFormValue(){
    return this.certificationForm.value;
  }

  protected override emitErrors(errors: any[]){
    this.errorList.emit(errors);

  }

  checkDateValidity(event: any): void {
    const inputName = event.target.attributes.getNamedItem('ng-reflect-name')?.value;
    const dateControl = this.certificationForm.get(inputName);
    const dateValue = dateControl.value;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

    if (!isValidFormat) {
      this.certificationForm
            .get(inputName)
            .setErrors({ 'error.msg.invalidDate': true });
    } else {
      if (dateControl.errors?.['invalidDate']) {
        this.certificationForm
            .get(inputName)
            .setErrors({ 'error.msg.invalidDate': true });
      }
    }
  }

  ngOnChange(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
  }
}
