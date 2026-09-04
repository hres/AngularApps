import { ChangeDetectorRef, Component, computed, effect, QueryList, SimpleChange, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../../global/global.service';
import { ICode, CheckboxOption, ErrorNotificationService, BaseComponent, ControlMessagesComponent, ConverterService, UtilsService, ErrorSummaryComponent, RecordDiscardService, RecordDeleteService, HelpSequence } from '@hpfb/sdk/ui';
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
  encapsulation: ViewEncapsulation.None,
  standalone: false
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

  popupId = 'contact-discard-warning'

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
  helpIndex: HelpSequence;
  protected disableDiscardBtn : boolean ;

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
    this.helpIndex = this._globalService.helpIndex;
    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});

    this._recordDiscardService.discardContactConfirmed$.subscribe(index => {
      if (index === this._discardIndex) {
        this._handleDiscard();
        this._patchAndCheckLastSavedRoles();
        this.discardHandled.emit();
        this.disableDiscardBtn = true;
        this.cRRow.markAsPristine();
      }
    });

    this._recordDeleteService.deleteContactConfirmed$.subscribe(index => {
      if (index === this._deleteIndex) {
        this._handleRecordDeletion();
        this.deleteHandled.emit(true)
      }
    });


    // ============ REPLACE YOUR EXISTING SUBSCRIPTION WITH THIS ============
    this.cRRow.valueChanges.subscribe(() => {
      setTimeout(() => {
          this._appendErrorsFromChild();
          this.cdRef.detectChanges();
      }, 10); // need set up 10 or bigger.
  });

    const companyInfoForm = <FormGroup>this.cRRow.controls['companyInfo'];
    const contactInfoForm = <FormGroup> companyInfoForm.controls['contactDetails'];

    if (contactInfoForm.controls['firstName'].value) {
      this.disableDiscardBtn = true
    } else {
      this.disableDiscardBtn = false;
    }
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

  // ==================== ADD THIS METHOD when using Angular 22====================
 private getFieldLabel(translationKey: string): string {
    if (!translationKey) return 'This field';

    // Use the translation service to get the actual label
    const translated = this._translateService.instant(translationKey);

    // If translation returns the key itself, it means translation is not available
    if (translated === translationKey) {
        // Fallback: extract from key
        let cleanLabel = translationKey;
        if (cleanLabel.includes('.')) {
            const parts = cleanLabel.split('.');
            let lastPart = parts[parts.length - 1];
            lastPart = lastPart.replace(/([A-Z])/g, ' $1').trim();
            cleanLabel = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        }
        return cleanLabel || 'This field';
    }

    return translated;
}

  public async revertContactRecord(index: number, recordId: number):  Promise<void> {
    this._discardIndex = index;
    const heading = await this._contactService.getHeading(index, this.cRRow);
    this.cRRow.get('heading').setValue(heading);
    this.revertRecord.emit({ name:'contact', index: index, id: recordId, heading: this.cRRow.get('heading').value });
  }

  private _handleDiscard() {
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
     // Split missing into those selected by others and those not
     const alreadySelectedByOthers: string[] = [];
     const notSelectedByOthers: string[] = [];

     for (const key of missing) {
       const roleId = key.slice(String(recordId).length);

       const isTaken = current.some(entry => {
         const otherRecordId = entry.match(/^\d+/)?.[0];
         return otherRecordId !== String(recordId) && entry.endsWith(roleId);
       });

       if (isTaken) {
         alreadySelectedByOthers.push(roleId);
       } else {
         notSelectedByOthers.push(key);
       }
     }

     if (alreadySelectedByOthers.length > 0) {
       this.openPopup();
     }

     // Update roles signal array
     if (notSelectedByOthers.length > 0) {
       this.cRRow.get('companyInfo.isRoleSelected').setValue(true);
       const final = [...updated, ...notSelectedByOthers];
       this._signalService.setContactCompanyRoles(final);
     } else {
       // None can be re-added because they're selected by other records
       this._signalService.setContactCompanyRoles(updated);
     }
  }

  private _patchAndCheckLastSavedRoles(): void {
    const selectedRoles = this.cRRow.get('companyInfo.selectedCompanyRoles')?.value ?? [];
    const enabledAndCheckedRoles: string[] = [];

    Object.entries(ROLE_INDEX_MAPPING).forEach(([role, index]) => {
      const control = this.companyRolesChkFormArray.at(index);
      const isRoleSelected = selectedRoles.includes(role);

      // Only check the box if the role was selected and the control is not disabled
      const shouldCheck = isRoleSelected && !control.disabled;
      control.setValue(shouldCheck);

      if (shouldCheck) {
        enabledAndCheckedRoles.push(role);
      }
    });

    // Update the selected roles in the form group to reflect only enabled and checked roles
    this.cRRow.get('companyInfo.selectedCompanyRoles')?.setValue(enabledAndCheckedRoles);
  }

  public disabledDiscardButton() {
    if (this.disableDiscardBtn && this.cRRow.get("companyInfo").dirty) {
        return false
      } else {
        return true;
      }
    }

  public async deleteContactRecord(index: number): Promise<void> {
    this._deleteIndex = index;
    const heading = await this._contactService.getHeading(index, this.cRRow); // Await here
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({name:'contact', index: index, heading: this.cRRow.get('heading').value});
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
      this.cRRow.get('companyInfo.rolesTouched').setValue(false);
    } else {
      this.showErrors = true;
      document.location.href = '#coContactErrorSummary' + this.j;
    }
  }

  companyRolesOnChange(e: any, selectedRole: string, index: number) {
    this.cRRow.get('companyInfo.rolesTouched').setValue(true);
    this.cRRow.get('companyInfo.selectedCompanyRoles').setValue(this.selectedCompanyRolesCodes);
    const isChecked = (e.target as HTMLInputElement).checked;

    // Get the specific form control using index
    const roleControl = this.companyRolesChkFormArray.at(index);
    const uniqueRole = this.cRRow.get('recordId').value + selectedRole;
    // Update signal array
    if (isChecked) {
      this._signalService.updateContactCompanyRoles(uniqueRole);
      this.cRRow.get('companyInfo.isRoleSelected').setValue(true);

      // if (this.isRoleAlreadySelected(selectedRole)) {
      //   roleControl.setErrors({ 'error.msg.roleSelected': true });
      // }
    } else {
      this._signalService.removeContactCompanyRole(uniqueRole);
      // this.removeRoleError.emit({id: this.cRRow.get('recordId').value, role: selectedRole, roleIndex: index});
      // roleControl.setErrors(null); // Remove error if valid
    }

    if (this.isNoRoleSelected()) {
      this.cRRow.get('companyInfo.isRoleSelected').setValue(false);
    }

    this.cdRef.detectChanges();
    //this._appendErrorsFromChild(); // Update errors for company roles here
  }


  isNoRoleSelected(): boolean {
    const formArray = this.companyRolesChkFormArray;
    // Check if none of the roles are selected
    const noRoles = formArray.controls.every(control => !control.value);

    return noRoles;
  }

  isNoRoleSelectedAndAllDisabled(): boolean {
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

  /**
   * Deprecated
   * @returns
   */
  // isRoleAlreadySelected = (role: string): boolean => {
  //   const roles = this.selectedCompanyRoles().map(r => r.replace(/^\d+/, '')); // Remove the numeric prefix
  //   return roles.filter(r => r === role).length > 1; // Check if role appears more than once
  // };

  // ==================== REPLACE THESE METHODS ====================

  /**
   * Process errors from child component
   */
  processContactErrors(childErrors: any[]) {
    this._contactErrorList = (childErrors || []).map(error => {
        const translationKey = error?.label || '';
        const fieldLabel = this.getFieldLabel(translationKey);

        error.label = fieldLabel;
        error.currentError = this.lang==='en'?'This field is required.':'Ce champ est obligatoire.';

        return error;
    });
    this._appendErrorsFromChild();
  }

  /**
   * Override _appendErrorsFromChild to ensure all errors have messages
   */
  protected override _appendErrorsFromChild() {
    this._coRolesErrors = this.msgList.toArray();

    const allErrors = [
        ...this._contactErrorList,
        ...this._coRolesErrors
    ].map(error => {
        const translationKey = error?.label || '';
        const fieldLabel = this.getFieldLabel(translationKey);
        error.label = fieldLabel;
        error.currentError = this.lang==='en'?'This field is required.':'Ce champ est obligatoire.';
        return error;
    });

    this.emitErrors(allErrors);
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

  get companyRoles(): FormArray {
    return this.cRRow.get('companyInfo.companyRoles') as FormArray;
  }

  get rolesTouched(): boolean {
    return this.cRRow.get('companyInfo.rolesTouched').value as boolean;
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

  /**
   * Emit errors to parent and ensure every error has a message
   */
  protected emitErrors(errors: any[]): void {
    const fixedErrors = errors.map(error => {
        if (error) {
            const translationKey = error?.label || '';
            const fieldLabel = this.getFieldLabel(translationKey);
            error.label = fieldLabel;
            error.currentError = this.lang==='en'?'This field is required.':'Ce champ est obligatoire.';
        }
        return error;
    });

    this.errors = fixedErrors;

    if (this.showErrors) {
        this.processSummaries(this.errorSummaryChildList);
    }

    this.cdRef.detectChanges();
  }

  // ==================== END OF REPLACED METHODS ====================

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

  openPopup(): void {
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }

}
