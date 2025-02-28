import { ChangeDetectorRef, Component, computed, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { ICode, CheckboxOption, ErrorNotificationService, BaseComponent, ControlMessagesComponent, ConverterService, UtilsService, ErrorSummaryComponent } from '@hpfb/sdk/ui';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CONTACT_ERROR_PREFIX } from '../../app.constants';
import { TranslateService } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { CompanyContactItemService } from './company-contact-item.service';
import { AppSignalService } from '../../signal/app-signal.service';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-company-contact-item',
  templateUrl: './company-contact-item.component.html',
  styleUrl: './company-contact-item.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CompanyContactItemComponent extends BaseComponent{
  @Input() cRRow: FormGroup;
  @Input() j: number;
  @Input() showErrors: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() rolesUpdated = new EventEmitter<CheckboxOption[]>();

  lang = this._globalService.currLanguage;
  languageList: ICode[] = [];
  
  public companyRolesOptionList: CheckboxOption[] = [];
  public companyRolesCodeList: ICode[] = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.company.contact";
  headingPreambleParams: any;
  translatedParentLabel: string;

  private _contactErrorList = [];
  private _coRolesErrors = [];
  errors = [];

  private selectedCompanyRoles : Signal<string[]> = this._signalService.getSelectedContactCompanyRoles();

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _companyContactItemService : CompanyContactItemService,
              private _converterService : ConverterService,
              private _signalService : AppSignalService,
              private cdRef: ChangeDetectorRef) {
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
    if (changes['cRRow']) {
      this._updateCompanyRolesArray();
    }
  }

  override ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._appendErrorsFromChild();
    });
    this.msgList.notifyOnChanges();
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      setTimeout(() => {
        this.processSummaries(list);
      });
    });
    this.cdRef.detectChanges();
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
    // Find roles that need to be removed
    const prefixToDelete = index.toString();
    const rolesToRemove = this.selectedCompanyRoles().filter(role => role.startsWith(prefixToDelete));
    // Remove each matching role
    rolesToRemove.forEach(role => this._signalService.removeContactCompanyRole(role));
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

 
  companyRolesOnChange(e: any, selectedRole: string, index: number) {
    this.cRRow.get('companyInfo.selectedCompanyRoles').setValue(this.selectedCompanyRolesCodes);
    const isChecked = (e.target as HTMLInputElement).checked;
  
    // Get the specific form control using index
    const roleControl = this.companyRolesChkFormArray.at(index);
    const uniqueRole = this.j + selectedRole;
    // Update signal array
    if (isChecked) {
      this._signalService.updateContactCompanyRoles(uniqueRole);
    } else {
      this._signalService.removeContactCompanyRole(uniqueRole);
    }
  
    // Attach validation to the specific role
    if (this.isRoleAlreadySelected(selectedRole)) {
      roleControl.setErrors({ 'error.msg.roleSelected': true });
    } else {
      roleControl.setErrors(null); // Remove error if valid
    } 
    //this._appendErrorsFromChild(); // Update errors for company roles here
  }

  isRoleAlreadySelected = (role: string): boolean => {
    const roles = this.selectedCompanyRoles().map(r => r.replace(/^\d+/, '')); // Remove the numeric prefix
    return roles.filter(r => r === role).length > 1; // Check if role appears more than once
  };

  public disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  processContactErrors(childErrors:any[]) {
    this._contactErrorList = childErrors;
    this._appendErrorsFromChild();
  }

  protected override _appendErrorsFromChild() {
    // Method is overriden to place company roles error last, since it is the last field in the record.
    this._coRolesErrors = this.msgList.toArray();
    const combinedErrors = [...this._contactErrorList, ...this._coRolesErrors]; 
    this.emitErrors(combinedErrors);
  }

  public showErrorSummary(): boolean {
    return (this.showErrors && this.errors.length > 0);
  }

  get companyRolesChkFormArray() {
    return this.cRRow.get('companyInfo.companyRoles') as FormArray
  }

  get selectedCompanyRolesCodes(): string[] {
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

  protected emitErrors(errors: any[]): void {
    // Not emitting any errors to parent, just setting the list of errors in contact-item
    this.errors = [...errors];

    // Process error summary component for when error summary list is shown and 1+ records are created
    if (this.showErrors) {
      this.processSummaries(this.errorSummaryChildList)
    }

    this.cdRef.detectChanges(); // Do change detection here to reactively update error summary
  }

}
