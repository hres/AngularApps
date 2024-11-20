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
import { UtilsService, HelpIndex, BaseComponent } from '@hpfb/sdk/ui';
import { FormBaseService } from '../form-base/form-base.service';
import { GlobalService } from '../global/global.service';
import { NewDrugSubmissionInformationService } from './new-drug-submission-information.service';

@Component({
  selector: 'app-new-drug-submission-information',
  templateUrl: './new-drug-submission-information.component.html',
  styleUrl: './new-drug-submission-information.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NewDrugSubmissionInformationComponent extends BaseComponent implements OnInit {



  public showFieldErrors: boolean = false;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  public newDrugSubmissionInfoForm: FormGroup;


  constructor(
    private _newDrugSubmissionInformationService: NewDrugSubmissionInformationService,
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

    if (!this.newDrugSubmissionInfoForm) {
      this.newDrugSubmissionInfoForm = this._newDrugSubmissionInformationService.getNewDrugSubmissionInforForm(this._fb);
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }



  getFormValue() {
    return this.newDrugSubmissionInfoForm.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
  }

}
