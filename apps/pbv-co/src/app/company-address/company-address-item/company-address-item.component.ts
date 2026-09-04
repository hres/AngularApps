import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { ADDRESS_ERROR_PREFIX, ROLE_INDEX_MAPPING } from '../../app.constants';
import { GlobalService } from '../../global/global.service';
import { AppSignalService } from '../../signal/app-signal.service';
import { CompanyAddressService } from '../company-address.service';
import { CompanyAddressItemService } from './company-address-item.service';

@Component({
  selector: 'app-company-address-item',
  templateUrl: './company-address-item.component.html',
  styleUrl: './company-address-item.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CompanyAddressItemComponent extends BaseComponent {
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
  popupId = 'address-discard-warning'

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
  private  _deleteIndex : number;

  private _previouslyDisabled : boolean;

  protected disableDiscardBtn : boolean ;

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

    this._recordDiscardService.discardAddressConfirmed$.subscribe(index => {
      if (index === this._discardIndex) {
        this._handleDiscard();
        this._patchAndCheckLastSavedRoles();
         this.disableDiscardBtn = true;
        this.cRRow.markAsPristine();
      }
    });

    this._recordDeleteService.deleteAddressConfirmed$.subscribe(index => {
      if (index === this._deleteIndex) {
        this._handleRecordDeletion();
        this.deleteHandled.emit(true)
      }
    });

       // ============ THE FIX ============
    // Same as companyEnrolment - subscribe to form changes and re-emit errors
    this.cRRow.valueChanges.subscribe(() => {
      this._appendErrorsFromChild();
      this.cdRef.detectChanges();
  });

    const addressInfoForm = <FormGroup>this.cRRow.controls['addressInfo'];
    if (addressInfoForm.controls['companyName'].value) {
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
    this._errNotifService.updateErrorSummary(ADDRESS_ERROR_PREFIX + this.cRRow.get('id').value, errorSummaryChild);
  }

  public saveAddressRecord(index: number): void {
    this._save(index);
  }

  private async _save(index: number) {
    if (this.cRRow.valid && !this.isNoRoleSelected()) {
      const heading = await this._addressService.getHeading(index, this.cRRow);
      this.cRRow.get('heading').setValue(heading);
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
      this.cRRow.get('addressInfo.rolesTouched').setValue(false);
    } else {
      this.showErrors = true;
      setTimeout(() => {
        document.location.href = '#coAddressErrorSummary' + this.j;
      }, 100);
    }
  }

  public async revertAddressRecord(index: number, recordId: number):  Promise<void> {
    this._discardIndex = index;
    const heading = await this._addressService.getHeading(index, this.cRRow);
    this.cRRow.get('heading').setValue(heading);
    this.revertRecord.emit({ name:'address', index: index, id: recordId, heading: this.cRRow.get('heading').value });
    this.disableDiscardBtn = true;
  }



  private _handleDiscard() {
    const recordId = this.cRRow.get('recordId')?.value;
    const selectedRoles = this.cRRow.get('addressInfo.selectedAddressCompanyRoles')?.value ?? [];

    if (!recordId || !Array.isArray(selectedRoles)) return;

    const validKeys = selectedRoles.map(role => `${recordId}${role}`);
    const current = this.selectedCompanyRoles();

    const updated = current.filter(entry => {
      const entryRecordId = entry.match(/^\d+/)?.[0];
      return entryRecordId !== String(recordId) || validKeys.includes(entry);
    });

    const missing = validKeys.filter(key => !updated.includes(key));

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

    if (notSelectedByOthers.length > 0) {
      this.cRRow.get('addressInfo.isRoleSelected').setValue(true);
      const final = [...updated, ...notSelectedByOthers];
      this._signalService.setAddressCompanyRoles(final);
    } else {
      this._signalService.setAddressCompanyRoles(updated);
    }
  }

  private _patchAndCheckLastSavedRoles(): void {
    const selectedRoles = this.cRRow.get('addressInfo.selectedAddressCompanyRoles')?.value ?? [];
    const enabledAndCheckedRoles: string[] = [];

    Object.entries(ROLE_INDEX_MAPPING).forEach(([role, index]) => {
      const control = this.companyRolesChkFormArray.at(index);
      const isRoleSelected = selectedRoles.includes(role);

      const shouldCheck = isRoleSelected && !control.disabled;
      control.setValue(shouldCheck);

      if (shouldCheck) {
        enabledAndCheckedRoles.push(role);
      }
    });

    this.cRRow.get('addressInfo.selectedAddressCompanyRoles')?.setValue(enabledAndCheckedRoles);
  }

  public disabledDiscardButton() {
    if (this.disableDiscardBtn && this.cRRow.get("addressInfo").dirty) {
        return false
      }
      else {
        return true;
      }
    }

  public async deleteAddressRecord(index: number): Promise<void> {
    this._deleteIndex = index;
    const heading = await this._addressService.getHeading(index, this.cRRow);
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({name:'address',index: index, heading: this.cRRow.get('heading').value});
  }

  private _handleRecordDeletion() {
    this._errNotifService.updateErrorSummary(ADDRESS_ERROR_PREFIX + this.cRRow.get('id').value, null);
    const prefixToDelete = this.cRRow.get('recordId').value.toString();
    const rolesToRemove = this.selectedCompanyRoles().filter(role => role.startsWith(prefixToDelete));
    rolesToRemove.forEach(role => {
      this._signalService.removeAddressCompanyRole(role)
    });
    this.cRRow.markAsPristine();
  }

  companyRolesOnChange(e: any, selectedRole: string, index: number) {
    this.cRRow.get('addressInfo.rolesTouched').setValue(true);
    this.cRRow.get('addressInfo.selectedAddressCompanyRoles').setValue(this.selectedCompanyRolesCodes);
    const isChecked = (e.target as HTMLInputElement).checked;

    const roleControl = this.companyRolesChkFormArray.at(index);
    const uniqueRole = this.cRRow.get('recordId').value + selectedRole;

    if (isChecked) {
      this._signalService.updateAddressCompanyRoles(uniqueRole);
      this.cRRow.get('addressInfo.isRoleSelected').setValue(true);
    } else {
      this._signalService.removeAddressCompanyRole(uniqueRole);
    }
    if (this.isNoRoleSelected()) {
      this.cRRow.get('addressInfo.isRoleSelected').setValue(false);
    }

    this.cdRef.detectChanges();
  }

  private _updateCompanyRolesArray() {
    const companyRolesList = this._globalService.companyRolesList;
    this.companyRolesOptionList = companyRolesList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    if (this.companyRolesChkFormArray.length === 0) {
      this.companyRolesOptionList.forEach(() => {
        this.companyRolesChkFormArray.push(new FormControl(false));
      });
    }

    this.rolesUpdated.emit(this.companyRolesOptionList);
  }

  isNoRoleSelected(): boolean {
    const formArray = this.companyRolesChkFormArray;
    const noRoles = formArray.controls.every(control => !control.value);
    return noRoles;
  }

  isNoRoleSelectedAndAllDisabled(): boolean {
    const formArray = this.companyRolesChkFormArray;
    const noRoles = formArray.controls.every(control => !control.value);
    const allDisabled = formArray.controls.every(control => control.disabled);
    if (noRoles && allDisabled){
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

  get rolesTouched(): boolean {
    return this.cRRow.get('addressInfo.rolesTouched').value as boolean;
  }

  // ==================== THE FIX when using angular 22====================

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

  /**
   * Process errors from child component (pbv-address-details)
   */
  processAddressErrors(childErrors: any[]) {
    this._addressErrorList = (childErrors || []).map(error => {
        const translationKey = error?.label || '';
        const fieldLabel = this.getFieldLabel(translationKey);

        // Set both label and currentError
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

    const roleErrors = this._coRolesErrors.filter(error => error.parentId === "coAddress");
    this._coRolesErrors = this._coRolesErrors.filter(error => error.parentId !== "coAddress");

    const allErrors = [
        ...this._coRolesErrors,
        ...this._addressErrorList,
        ...roleErrors
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

  // ==================== END OF FIX ====================

  private _disableFormGroup() {
    this.cRRow.disable();
  }

  private _enableFormGroup() {
    this.cRRow.enable();
    if (this.cRRow.get('expandFlag').value) {
      this.cRRow.get('expandFlag').setValue(false);
      if (this.cRRow.invalid) {
        this._handleFormInvalidity();
      }
    }

    this.showErrors = true;
  }

  private _handleFormInvalidity() {
    this.cRRow.get('expandFlag').setValue(true);
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

  openPopup(): void {
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }
}
