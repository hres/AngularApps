import { Component, SimpleChange, SimpleChanges } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { ICode, CheckboxOption, ErrorNotificationService, BaseComponent, ControlMessagesComponent } from '@hpfb/sdk/ui';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CONTACT_ERROR_PREFIX } from '../../app.constants';
import { IAddressPBVCO, IContactPBVCO } from '../../models/Company';
import { TranslateService } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { CompanyContactItemService } from './company-contact-item.service';

@Component({
  selector: 'app-company-contact-item',
  templateUrl: './company-contact-item.component.html',
  styleUrl: './company-contact-item.component.css'
})
export class CompanyContactItemComponent extends BaseComponent{
  @Input() cRRow: FormGroup;
  @Input() j: number;
  @Input() showErrors: boolean;
  @Input() contactModel: IContactPBVCO;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errorList = new EventEmitter(true);

  lang: string;
  languageList: ICode[] = [];
  
  public companyRolesOptionList: CheckboxOption[] = [];
  public companyRolesCodeList: ICode[] = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.company.contact";
  headingPreambleParams: any;
  translatedParentLabel: string;

  private _contactErrorList = [];
  errors = [];

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _companyContactItemService : CompanyContactItemService) {
    super();
  }

  ngOnInit() : void{
    this.lang = this._globalService.currLanguage;
    this.languageList = this._globalService.languageList;
    this.companyRolesCodeList = this._globalService.companyRolesList;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});

  }

  ngOnChanges(changes: SimpleChanges) : void{
    
  }

  
  public revertContactRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteContactRecord(index: number): void {
    this._errNotifService.updateErrorSummary(CONTACT_ERROR_PREFIX + this.cRRow.get('id').value, null);
    this.deleteRecord.emit(index);
    this.cRRow.markAsPristine();
  }


  public saveContactRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number): void {
    if (this.cRRow.valid) {
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrors = true;
      document.location.href = '#materialErrorSummary' + this.j;
    }
  } 

  companyRolesOnChange() {

  }

  public disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  processContactErrors(childErrors:any[]) {
    this._contactErrorList = childErrors;
    this._appendChildAndParentErrors();
  }

  private _appendChildAndParentErrors() {
    const parentErrors = this.msgList.toArray();
    const combinedErrors = [...parentErrors, ...this._contactErrorList];
    this._emitCombinedErrors(combinedErrors);  // Call the abstract method
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errors = errors;
    this.errorList.emit(errors);
  }

  private _emitCombinedErrors(errors: any[]): void {
    this.errors = errors;
    this.errorList.emit(errors);
  }

  public showErrorSummary(): boolean {
    return (this.showErrors && this.errorList.length > 0);
  }

  get companyRolesChkFormArray() {
    return this.cRRow.get('companyInfo.companyRoles') as FormArray

  }

  get selectedDiagnosisCodes(): string[] {
    return this._companyContactItemService.getCompanyRolesCodes(this.companyRolesOptionList, this.companyRolesChkFormArray);
  }
}
