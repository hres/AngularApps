import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ENGLISH, FRENCH, HelpSequence, ICode, ICodeAria, UtilsService } from '@hpfb/sdk/ui';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { AttestationService } from './attestation.service';
import { Ectd, IAttestationInfomation } from '../models/transaction';
import { AttestationTypeForSubmission } from './AttestationEnum';

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrl: './attestation.component.css',
  providers: [ AttestationService ],
  encapsulation: ViewEncapsulation.None,
})

export class AttestationComponent extends BaseComponent implements OnInit, OnChanges {



  public lang: string;
  public openother: boolean ;
  helpIndex: HelpSequence;
  showFieldsErrors: boolean = false;

  public attestationForm: FormGroup;
  @Input() showErrors: boolean = false;
  public showFieldErrors: boolean = false;
  @Output() errorlis = new EventEmitter(true);
  @Output() errorList = new EventEmitter(true);
  @Input() attestationModel: IAttestationInfomation;
  attestationAsApplicantOptions: ICodeAria[] = [];
  attestationAsSubmissionOptions: ICodeAria[] = [];


  countryOptions: ICode[] = [];

  constructor(private _attestationService: AttestationService, private _fb: FormBuilder, private _globalService: GlobalService, private _utilsService: UtilsService){
    super();
    this.showFieldsErrors = false;
    }


  protected override emitErrors(errors: any[]): void {
      this.errorList.emit(errors);
    }



  ngOnInit(): void {
    this.openother = false;
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    if(!this.attestationForm){
    this.attestationForm = this._attestationService.getAttestationForm(this._fb);
    }

    this.attestationAsApplicantOptions = this._globalService.attestationAsApplicant;
    this.attestationAsSubmissionOptions = this._globalService.attestationAsSubmission;
    this.countryOptions = this._globalService.countryList;
   }

   onAttestationAsApplicantSelected(e: any): void {
    this.openother = false;
  }

  onAttestationAsSubmissionSelected(e: any): void {
    if(this.attestationForm.get('attestationAsSubmission').value == AttestationTypeForSubmission.grandEn || this.attestationForm.get('attestationAsSubmission').value == AttestationTypeForSubmission.grandFr ){
        this.openother = true;
    }else{
        this.openother = false;
    }
   }

   ngOnChanges(changes: SimpleChanges) {
       this.showFieldErrors = this.showErrors || this.showFieldErrors;
       if (!this._utilsService.isFirstChange(changes)) {
        if (changes['attestationModel']) {
          this._attestationService.mapDataModelToFormModel(
            changes['attestationModel'].currentValue,
            <FormGroup>this.attestationForm, this.countryOptions
          );
        }
      }
     }

   getFormValue() {
     return this.attestationForm.value;
   }

   onDateInput(event: any): void {
    this._globalService.isDateValid(event, this.attestationForm);
  }
}

