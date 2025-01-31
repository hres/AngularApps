import { Component, computed, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { ICode, CheckboxOption, ErrorNotificationService, BaseComponent, ControlMessagesComponent, ConverterService, UtilsService, ErrorSummaryComponent } from '@hpfb/sdk/ui';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CONTACT_ERROR_PREFIX } from '../../app.constants';
import { ContactRecord, IContactPBVCO } from '../../models/Company';
import { TranslateService } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { CompanyContactItemService } from './company-contact-item.service';
import { AppSignalService } from '../../signal/app-signal.service';
import { Signal } from '@angular/core';
import { CompanyContactService } from '../company-contact.service';

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
  @Output() rolesUpdated = new EventEmitter<CheckboxOption[]>();

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

  private selectedCompanyRoles : Signal<string[]> = this._signalService.getSelectedCompanyRoles();
  isRoleAlreadySelected: Signal<boolean> = computed(() => 
  {
    const roles = this.selectedCompanyRoles();
    const roleSet = new Set(roles);
    return roleSet.size !== roles.length
  });

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _companyContactItemService : CompanyContactItemService,
              private _converterService : ConverterService,
              private _signalService : AppSignalService,
              private _utilService : UtilsService,
              private _contactService: CompanyContactService) {
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
    console.log('ngOnChanges triggered:', changes);
    if (changes['cRRow']) {
      this._updateCompanyRolesArray();
    }
  }

  override ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateAndEmitErrors(errorObjs);
    });
    this.msgList.notifyOnChanges();

    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      // console.log("error summary child change,", list);
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length >= 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    const errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errNotifService.updateErrorSummary(CONTACT_ERROR_PREFIX + this.cRRow.get('id').value, errorSummaryChild);

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
      document.location.href = '#coContactErrorSummary' + this.j;
    }
  } 

  companyRolesOnChange(e: any, selectedRole : any) {
    this.cRRow.get('companyInfo.selectedCompanyRoles').setValue(this.selectedDiagnosisCodes);
    const isChecked = (e.target as HTMLInputElement).checked;

    // Update signal array
    if (isChecked) {
      this._signalService.updateCompanyRoles(selectedRole);
    } else {
      this._signalService.removeCompanyRole(selectedRole);
    }

    // Do validation here 
    if (this.isRoleAlreadySelected()) {
      this.companyRoles.setErrors({'error.msg.roleSelected' : true});
    }
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
    const combinedErrors = [...this._contactErrorList, ...parentErrors];
    this.emitErrors(combinedErrors);  // Call the abstract method
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errors = errors;
  }

  public showErrorSummary(): boolean {
    return (this.showErrors && this.errors.length > 0);
  }

  get companyRolesChkFormArray() {
    return this.cRRow.get('companyInfo.companyRoles') as FormArray

  }

  get selectedDiagnosisCodes(): string[] {
    return this._companyContactItemService.getCompanyRolesCodes(this.companyRolesOptionList, this.companyRolesChkFormArray);
  }

  get contactDetailsFormGroup(): FormGroup {
    return this.cRRow.get('companyInfo.contactDetails') as FormGroup;
  }

  private _updateCompanyRolesArray() {
    const companyRolesList = this._globalService.companyRolesList;
    this.companyRolesOptionList = companyRolesList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    console.log(this.companyRolesOptionList)
    if (this.companyRolesChkFormArray.length === 0) {
      // Create new form controls for the company roles
      this.companyRolesOptionList.forEach(() => {
        this.companyRolesChkFormArray.push(new FormControl(false));
      });
    }
    
    this.rolesUpdated.emit(this.companyRolesOptionList);
  }

  get companyRoles(): FormArray {
    return this.cRRow.get('companyInfo.companyRoles') as FormArray;
  }

  
}
