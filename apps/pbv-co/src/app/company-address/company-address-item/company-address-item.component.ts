import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { ADDRESS_ERROR_PREFIX, ROLE_INDEX_MAPPING } from '../../app.constants';
import { GlobalService } from '../../global/global.service';
import { AppSignalService } from '../../signal/app-signal.service';
import { CompanyAddressService } from '../company-address.service';
import { CompanyAddressItemService } from './company-address-item.service';

@Component({
  selector: 'app-company-address-item',
  templateUrl: './company-address-item.component.html',
  styleUrl: './company-address-item.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CompanyAddressItemComponent extends BaseComponent{
  @Input() cRRow: FormGroup;
  @Input() j: number;
  @Input() showErrors: boolean;
  @Input() disableForm: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() rolesUpdated = new EventEmitter<CheckboxOption[]>();
  @Output() removeRoleError = new EventEmitter();
  @Output() deleteHandled = new EventEmitter();
  
  helpIndex: HelpSequence;

  countryList: ICode[] = [];
  provinceList: ICode[] = [];
  stateList: ICode[] = [];
  lang = this._globalService.currLanguage;
  
  public companyRolesOptionList: CheckboxOption[] = [];
  public companyRolesCodeList: ICode[] = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.company.address";
  headingPreambleParams: any;
  translatedParentLabel: string;

  private _addressErrorList = [];
  private _coRolesErrors = [];
  errors = [];

  private selectedCompanyRoles : Signal<string[]> = this._signalService.getSelectedAddressCompanyRoles();

  private _discardIndex : number;
  private _deleteIndex : number;
  
  private _previouslyDisabled : boolean;

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _converterService : ConverterService,
              private _signalService : AppSignalService,
              private _companyAddressItemService : CompanyAddressItemService,
              private _addressService : CompanyAddressService,
              private _recordDiscardService : RecordDiscardService,
              private _recordDeleteService : RecordDeleteService,
              private cdRef: ChangeDetectorRef) {
      super();
      effect(() => {
        this._disableRoles();
        this._enableRoles();
      });
  }

  async ngOnInit(): Promise<void> {
    this.countryList = this._globalService.countryList;
    this.provinceList = this._globalService.provinceList;
    this.stateList = this._globalService.stateList; 
    this.companyRolesCodeList = this._globalService.companyRolesList;
    this.helpIndex = this._globalService.helpIndex;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});
   
    this._recordDiscardService.discardConfirmed$.subscribe(index => {
      if (index === this._discardIndex) {
        this._updateRolesSignalAfterDiscard();
        this._patchLastSavedRoles();
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
    this._errNotifService.updateErrorSummary(ADDRESS_ERROR_PREFIX + this.cRRow.get('id').value, errorSummaryChild);

  }

  public saveAddressRecord(index: number): void {
    this._save(index);
  }

  private async _save(index: number) {
    if (this.cRRow.valid && !this.isNoRoleSelected()) {
      const heading = await this._addressService.getHeading(index, this.cRRow); // Await here
      this.cRRow.get('heading').setValue(heading);
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrors = true;
      document.location.href = '#coAddressErrorSummary' + this.j;
    }
  }  
  

  public revertAddressRecord(index: number, recordId: number): void {
    this._discardIndex = index;
    this.revertRecord.emit({ index: index, id: recordId, heading: this.cRRow.get('heading').value });
    this.cRRow.markAsPristine();
  }

  private _updateRolesSignalAfterDiscard() {
    const recordId = this.cRRow.get('recordId')?.value;
    const selectedRoles = this.cRRow.get('addressInfo.selectedAddressCompanyRoles')?.value ?? [];
  
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
    const selectedRoles = this.cRRow.get('addressInfo.selectedAddressCompanyRoles')?.value ?? [];
  
    // Loop through all roles in the ROLE_INDEX_MAPPING
    Object.entries(ROLE_INDEX_MAPPING).forEach(([role, index]) => {
      const isSelected = selectedRoles.includes(role);
      this.companyRolesChkFormArray.at(index).setValue(isSelected);
    });
  }

  public async deleteAddressRecord(index: number): Promise<void> {
    this._deleteIndex = index;
    const heading = await this._addressService.getHeading(index, this.cRRow); // Set heading here for when the record isn't saved yet
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({index: index, heading: this.cRRow.get('heading').value});
  }

  private _handleRecordDeletion() {
    this._errNotifService.updateErrorSummary(ADDRESS_ERROR_PREFIX + this.cRRow.get('id').value, null);
    // Find roles that need to be removed
    const prefixToDelete = this.cRRow.get('recordId').value.toString();
    const rolesToRemove = this.selectedCompanyRoles().filter(role => role.startsWith(prefixToDelete));
    // Remove each matching role
    rolesToRemove.forEach(role => 
      {
        this._signalService.removeAddressCompanyRole(role)
      });
    this.cRRow.markAsPristine();
  }

  public disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  companyRolesOnChange(e: any, selectedRole: string, index: number) {
    this.cRRow.get('addressInfo.selectedAddressCompanyRoles').setValue(this.selectedCompanyRolesCodes);
    const isChecked = (e.target as HTMLInputElement).checked;
  
    // Get the specific form control using index
    const roleControl = this.companyRolesChkFormArray.at(index);
    const uniqueRole = this.cRRow.get('recordId').value + selectedRole;
    // Update signal array
    if (isChecked) {
      this._signalService.updateAddressCompanyRoles(uniqueRole);
      // if (this.isRoleAlreadySelected(selectedRole)) {
      //   roleControl.setErrors({ 'error.msg.roleSelected': true });
      // }
    } else {
      this._signalService.removeAddressCompanyRole(uniqueRole);
      // this.removeRoleError.emit({ id: this.cRRow.get('recordId').value, role: selectedRole, roleIndex: index});
      // roleControl.setErrors(null); // Remove error if valid

    }

    // Attach validation to the specific role
    // if (this.isRoleAlreadySelected(selectedRole)) {
    //   console.log("selected");
    //   roleControl.setErrors({ 'error.msg.roleSelected': true });
    // } else {
    //   console.log("remove error")
    //   roleControl.setErrors(null); // Remove error if valid
    // }

    //console.log(this._signalService.getSelectedAddressCompanyRoles()());
    this.cdRef.detectChanges();
    //this._appendErrorsFromChild(); // Update errors for company roles here
  }

  /**
   * Deprecated
   */
  // isRoleAlreadySelected = (role: string): boolean => {
  //   const roles = this.selectedCompanyRoles().map(r => r.replace(/^\d+/, '')); // Remove the numeric prefix
  //   return roles.filter(r => r === role).length > 1; // Check if role appears more than once
  // };

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

  isNoRoleSelected(): boolean {
    const formArray = this.companyRolesChkFormArray;
    // Check if none of the roles are selected
    const noRoles = formArray.controls.every(control => !control.value);
    const allDisabled = formArray.controls.every(control => control.disabled);
    if (noRoles && allDisabled){
      // If no roles selected, manually set the errors
      this.companyRolesChkFormArray.setErrors({ 'required': true });
    }
    return noRoles && allDisabled;
  }
  
  get companyRolesChkFormArray() {
    return this.cRRow.get('addressInfo.addressCompanyRoles') as FormArray;
  }

  get selectedCompanyRolesCodes(): string[] {
    return this._companyAddressItemService.getCompanyRolesCodes(this.companyRolesOptionList, this.companyRolesChkFormArray);
  }

  get addressDetailsFormGroup(): FormGroup {
    return this.cRRow.get('addressInfo.addressDetails') as FormGroup;
  }
  

  processAddressErrors(childErrors:any[]) {
    this._addressErrorList = childErrors;
    this._appendErrorsFromChild();
  }

  protected override _appendErrorsFromChild() {
    // Method is overriden to place company roles error last, since it is the last field in the record.
    this._coRolesErrors = this.msgList.toArray(); // Includes: Company name and company roles
  
    // Extract all companyRoles errors
    const roleErrors = this._coRolesErrors.filter(error => error.parentId === "coAddress");
  
    // Remove them from the original list
    this._coRolesErrors = this._coRolesErrors.filter(error => error.parentId !== "coAddress");
  
    const combinedErrors = [...this._coRolesErrors, ...this._addressErrorList, ...roleErrors];
    this.emitErrors(combinedErrors);
  }
  

  public showErrorSummary(): boolean {
    return (this.showErrors && this.errors.length > 0);
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
    const recordId = this.cRRow.get('recordId').value
  
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
    this.companyRolesOptionList.forEach(role => {
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
