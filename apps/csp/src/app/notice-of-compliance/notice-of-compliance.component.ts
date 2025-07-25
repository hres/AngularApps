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
  HelpSequence,
  BaseComponent,
} from '@hpfb/sdk/ui';
import { FormBaseService } from '../form-base/form-base.service';
import { NoticeOfComplianceService } from './notice-of-compliance.service';
import { GlobalService } from '../global/global.service';


@Component({
  selector: 'app-notice-of-compliance',
  templateUrl: './notice-of-compliance.component.html',
  styleUrl: './notice-of-compliance.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class NoticeOfComplianceComponent extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public noticeOfComplianceForm: FormGroup;
  @Input() nocModel: string;


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
      this.noticeOfComplianceForm = this._noticeOfComplianceService.getNoticeOfComplianceForm(
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



  getFormValue() {
    return this.noticeOfComplianceForm.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    if (!this._utilsService.isFirstChange(changes) && changes['nocModel']) {
        this._noticeOfComplianceService.mapDataModelToFormModel( changes['nocModel'].currentValue, (<FormGroup>this.noticeOfComplianceForm))
    }
  }
}

