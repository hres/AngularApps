import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpSequence, ICodeAria, UtilsService } from '@hpfb/sdk/ui';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { AttestationService } from './attestation.service';
import { Ectd } from '../models/transaction';

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrl: './attestation.component.css',
  providers: [ AttestationService ],
  encapsulation: ViewEncapsulation.None,
})

export class AttestationComponent extends BaseComponent implements OnInit{
  


  public lang: string;
  helpIndex: HelpSequence;
  showFieldsErrors: boolean = false;

  public AttestationForm: FormGroup;
  @Input() showErrors: boolean = false;
  public showFieldErrors: boolean = false;
  @Output() errorlis = new EventEmitter(true);
  selectedAttestationAsApplicant: string;
  @Output() errorList = new EventEmitter(true);
  @Input() dataModel: Ectd;
  attestationAsApplicantOptions: ICodeAria[] = [];

  //constructor(private _fb: FormBuilder, private _globalService: GlobalService, private _utilsService: UtilsService){
  constructor(private _attestationService: AttestationService, private _fb: FormBuilder, private _globalService: GlobalService, private _utilsService: UtilsService){

    super();
    this.showFieldsErrors = false;
  
    }
    protected override emitErrors(errors: any[]): void {
      this.errorList.emit(errors);
    }



  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    if(!this.AttestationForm){
    this.AttestationForm = this._attestationService.getAttestationForm(this._fb);
    }
 
    this.attestationAsApplicantOptions = this._globalService.attestationAsApplicant;
   }
    
   onAttestationSelected(e: any): void {
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.attestationAsApplicantOptions, this.AttestationForm.get('attestationAsApplicant').value);
    this.selectedAttestationAsApplicant = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }
 
   ngOnChanges(changes: SimpleChanges) {
       this.showFieldErrors = this.showErrors || this.showFieldErrors;
       const isFirstChange = this._utilsService.isFirstChange(changes);
     }
 
   getFormValue() {
     return this.AttestationForm.value;
   }
}

