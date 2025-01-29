import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {  UtilsService,  HelpSequence,  BaseComponent,} from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { PatentService } from './patent-service.service';
@Component({
  selector: 'app-patent',
  templateUrl: './patent.component.html',
  styleUrl: './patent.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PatentComponent extends BaseComponent implements OnInit {
  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpSequence;
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

  onDateInput(event: any): void {
    this._globalService.isDateValid(event, this.patentInformationForm);
  }



  getFormValue() {
    return this.patentInformationForm.value;
  }

  ngOnChanges(changes: SimpleChanges) {
      this.showFieldErrors = this.showErrors || this.showFieldErrors;
    }


}
