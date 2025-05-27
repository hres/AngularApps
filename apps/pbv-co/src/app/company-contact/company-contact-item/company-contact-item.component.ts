import { ChangeDetectorRef, Component, computed, effect, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { ICode, CheckboxOption, ErrorNotificationService, BaseComponent, ControlMessagesComponent, ConverterService, UtilsService, ErrorSummaryComponent, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CONTACT_ERROR_PREFIX, ROLE_INDEX_MAPPING } from '../../app.constants';
import { TranslateService } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { CompanyContactItemService } from './company-contact-item.service';
import { AppSignalService } from '../../signal/app-signal.service';
import { Signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CompanyContactService } from '../company-contact.service';

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
  @Input() disableForm: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() rolesUpdated = new EventEmitter<CheckboxOption[]>();
  @Output() removeRoleError = new EventEmitter();
  @Output() discardHandled = new EventEmitter();
  @Output() deleteHandled = new EventEmitter();

  lang = this._globalService.currLanguage;
  languageList: ICode[] = [];
  
  public representativeRolesOptionList: CheckboxOption[] = [];
  public representativeRolesCodeList: ICode[] = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.company.contact";
  headingPreambleParams: any;
  translatedParentLabel: string;

  private _contactErrorList = [];
  private _coRolesErrors = [];
  errors = [];

  private selectedCompanyRoles : Signal<string[]> = this._signalService.getSelectedContactCompanyRoles();

  private _discardIndex : number;
  private _deleteIndex : number;

  private _previouslyDisabled : boolean;


  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _companyContactItemService : CompanyContactItemService,
              private _converterService : ConverterService,
              private _signalService : AppSignalService,
              private _contactService : CompanyContactService,
              private _recordDiscardService: RecordDiscardService,
              private _recordDeleteService : RecordDeleteService,
              private cdRef: ChangeDetectorRef) {
    super();
    effect(() => {
      this._disableRoles();
      this._enableRoles();
    });
  }

  async ngOnInit() : Promise<void> {
    this.lang = this._globalService.currLanguage;
    this.languageList = this._globalService.languageList;
    this.representativeRolesCodeList = this._globalService.representativeRolesList;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});

    this._recordDiscardService.discardConfirmed$.subscribe(index => {
      if (index === this._discardIndex) {
        this._updateRolesSignalAfterDiscard();
        this._patchLastSavedRoles();
        this.discardHandled.emit();
      }
    });

    this._recordDeleteService.deleteConfirmed$.subscribe(index => {
      if (index === this._deleteIndex) {
        this._handleRecordDeletion();
        this.deleteHandled.emit(true)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) : void{
    if (changes['cRRow']) {
      this._updateCompanyRolesArray();
    }

    if (this.disableForm) {
      this._disableFormGroup();
      this._previouslyDisabled = true;
    } else {
      if (this._previouslyDisabled) {
        this._enableFormGroup();
      }
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
    this._discardIndex = index;
    this.revertRecord.emit({ index: index, id: recordId, heading: this.cRRow.get('heading').value });
    this.cRRow.markAsPristine();
  }

  private _updateRolesSignalAfterDiscard() {
    const recordId = this.cRRow.get('recordId')?.value;
    const selectedRoles = this.cRRow.get('companyInfo.selectedCompanyRoles')?.value ?? [];
  
    if (!recordId || !Array.isArray(selectedRoles)) return;
  
    const validKeys = selectedRoles.map(role => `${recordId}${role}`);
    const current = this.selectedCompanyRoles();
  
    // Keep the roles that belong to other records and this record. This unchecks the roles that has been checked
    const updated = current.filter(entry => {
      const entryRecordId = entry.match(/^\d+/)?.[0]; // Extract prefix digits
      return entryRecordId !== String(recordId) || validKeys.includes(entry);
    });
  
    // Add in the role that was unchecked from last saved state. This checks the role that has been unchecked
    const missing = validKeys.filter(key => !updated.includes(key));
    const final = [...updated, ...missing];
  
    this._signalService.setAddressCompanyRoles(final);
  }

  private _patchLastSavedRoles(): void {
    const selectedRoles = this.cRRow.get('companyInfo.selectedCompanyRoles')?.value ?? [];
  
    // Loop through all roles in the ROLE_INDEX_MAPPING
    Object.entries(ROLE_INDEX_MAPPING).forEach(([role, index]) => {
      const isSelected = selectedRoles.includes(role);
      this.companyRolesChkFormArray.at(index).setValue(isSelected);
    });
  }

  public async deleteContactRecord(index: number): Promise<void> {
    this._deleteIndex = index;
    const heading = await this._contactService.getHeading(index, this.cRRow); // Await here
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({index: index, heading: this.cRRow.get('heading').value});
    this.cRRow.markAsPristine();
  }

  private _handleRecordDeletion() {
    this._errNotifService.updateErrorSummary(CONTACT_ERROR_PREFIX + this.cRRow.get('id').value, null);
    // Find roles that need to be removed
    const prefixToDelete = this.cRRow.get('recordId').value.toString();
    const rolesToRemove = this.selectedCompanyRoles().filter(role => role.startsWith(prefixToDelete));
    // Remove each matching role
    rolesToRemove.forEach(role => 
      {
        this._signalService.removeContactCompanyRole(role)
      });
    this.cRRow.markAsPristine();
  }


  public saveContactRecord(index: number): void {
    this._save(index);
  }

  private async _save(index: number) {
    if (this.cRRow.valid && !this.isNoRoleSelected()) {
      const heading = await this._contactService.getHeading(index, this.cRRow); // Await here
      this.cRRow.get('heading').setValue(heading);
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
    const uniqueRole = this.cRRow.get('recordId').value + selectedRole;
    // Update signal array
    if (isChecked) {
      this._signalService.updateContactCompanyRoles(uniqueRole);
      // if (this.isRoleAlreadySelected(selectedRole)) {
      //   roleControl.setErrors({ 'error.msg.roleSelected': true });
      // } 
    } else {
      this._signalService.removeContactCompanyRole(uniqueRole);
      // this.removeRoleError.emit({id: this.cRRow.get('recordId').value, role: selectedRole, roleIndex: index});
      // roleControl.setErrors(null); // Remove error if valid
    }

    this.cdRef.detectChanges();
    //this._appendErrorsFromChild(); // Update errors for company roles here
  }

  /**
   * Deprecated
   * @returns 
   */
  // isRoleAlreadySelected = (role: string): boolean => {
  //   const roles = this.selectedCompanyRoles().map(r => r.replace(/^\d+/, '')); // Remove the numeric prefix
  //   return roles.filter(r => r === role).length > 1; // Check if role appears more than once
  // };

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
    return this._companyContactItemService.getCompanyRolesCodes(this.representativeRolesOptionList, this.companyRolesChkFormArray);
  }

  get contactDetailsFormGroup(): FormGroup {
    return this.cRRow.get('companyInfo.contactDetails') as FormGroup;
  }

  private _updateCompanyRolesArray() {
    const representativeRolesList = this._globalService.representativeRolesList;
    this.representativeRolesOptionList = representativeRolesList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    if (this.companyRolesChkFormArray.length === 0) {
      // Create new form controls for the company roles
      this.representativeRolesOptionList.forEach(() => {
        this.companyRolesChkFormArray.push(new FormControl(false));
      });
    }
    
    this.rolesUpdated.emit(this.representativeRolesOptionList);
  }

  isNoRoleSelected(): boolean {
    const formArray = this.companyRolesChkFormArray;
    // Check if none of the roles are selected (value = true)
    const noRoles = formArray.controls.every(control => !control.value);
    const allDisabled = formArray.controls.every(control => control.disabled);
    if (noRoles && allDisabled){
      this.companyRolesChkFormArray.setErrors({ 'required': true });
    }
    return noRoles && allDisabled;
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

  private _disableFormGroup() {
    this.cRRow.disable();
  }

  private _enableFormGroup() {
    this.cRRow.enable();
    if (this.cRRow.get('expandFlag').value) {
      this.cRRow.get('expandFlag').setValue(false); // Collapse records
      // Expand record again if it has an error/empty field
      if (this.cRRow.invalid) {
        this._handleFormInvalidity();
      }
    }
  }
  
  private _handleFormInvalidity() {
    this.cRRow.get('expandFlag').setValue(true); // Collapse records
    this.cRRow.markAsDirty();
    this._disableRoles();
  }

  private _disableRoles() {
    const recordId = this.cRRow.get('recordId').value;
  
    this.selectedCompanyRoles().forEach(roleWithPrefix => {
      const selectedRecordId = roleWithPrefix.match(/^\d+/)?.[0] ?? '';
      const roleId = roleWithPrefix.slice(selectedRecordId.length);
    
      if (selectedRecordId !== String(recordId)) {
        const mappedIndex = ROLE_INDEX_MAPPING[roleId];
        if (mappedIndex !== undefined) {
          this._disableRole(mappedIndex);
        }
      }
    });
  }

  private _enableRoles() {
    const roles = this.selectedCompanyRoles().map(r => r.replace(/^\d+/, ''));
    this.representativeRolesOptionList.forEach(role => {
        if (!roles.includes(role.value)) {
          const mappedIndex = ROLE_INDEX_MAPPING[role.value];
          if (mappedIndex !== undefined) {
            this._enableRole(mappedIndex);
          }
        }
      }
    )
  }

  private _disableRole(roleIndex) {
    const roleFormGroup = this.companyRolesChkFormArray.at(roleIndex) as FormGroup;
    roleFormGroup.disable();
  }

  private _enableRole(roleIndex) {
    const roleFormGroup = this.companyRolesChkFormArray.at(roleIndex) as FormGroup;
    roleFormGroup.enable();
  }

  get rolesInvalid() : boolean {
    return !this.companyRolesChkFormArray.valid;
  }

}
