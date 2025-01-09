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
import {
  UtilsService,
  HelpIndex,
  BaseComponent,
} from '@hpfb/sdk/ui';
import { FormBaseService } from '../form-base/form-base.service';
import { NoticeOfComplianceService } from './notice-of-compliance.service';
import { GlobalService } from '../global/global.service';


@Component({
  selector: 'app-notice-of-compliance',
  templateUrl: './notice-of-compliance.component.html',
  styleUrl: './notice-of-compliance.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NoticeOfComplianceComponent extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public noticeOfComplianceForm: FormGroup;


  constructor(
    private _noticeOfComplianceService: NoticeOfComplianceService,
    private _fb: FormBuilder,
    private _globalService: GlobalService,
    private formBaseService: FormBaseService,
    private _utilsService: UtilsService
  ) {
    super();
    this.showFieldErrors = false;


  }
  ngOnInit(): void {

    this.helpIndex = this._globalService.helpIndex;

    if (!this.noticeOfComplianceForm) {
      this.noticeOfComplianceForm = NoticeOfComplianceService.getNoticeOfComplianceForm(
        this._fb
      );
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  onDateInput(event: any): void {
    this._globalService.isDateValid(event, this.noticeOfComplianceForm);
  }

  checkDateValidity(event: any): void {
    let inputName =
      event.target.attributes.getNamedItem('ng-reflect-name').value;
    this._utilsService.checkInputValidity(
      event,
      this.noticeOfComplianceForm.get(inputName),
      'invalidDate'
    );
    if (this.noticeOfComplianceForm != undefined) {
      let patendExpirationDate = this.noticeOfComplianceForm.get(
        'patendExpirationDate'
      );
    }
  }

  getFormValue() {
    return this.noticeOfComplianceForm.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
  }
}

