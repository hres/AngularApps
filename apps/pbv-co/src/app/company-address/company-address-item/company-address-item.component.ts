import { ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { ADDRESS_ERROR_PREFIX } from '../../app.constants';
import { GlobalService } from '../../global/global.service';
import { AppSignalService } from '../../signal/app-signal.service';
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
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() rolesUpdated = new EventEmitter<CheckboxOption[]>();
  
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

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
              private _errNotifService : ErrorNotificationService,
              private _translateService : TranslateService,
              private _converterService : ConverterService,
              private _signalService : AppSignalService,
              private _companyAddressItemService : CompanyAddressItemService,
              private cdRef: ChangeDetectorRef) {
      super();
  }

  ngOnInit(): void {
    this.countryList = this._globalService.countryList;
    this.provinceList = this._globalService.provinceList;
    this.stateList = this._globalService.stateList; 
    this.companyRolesCodeList = this._globalService.companyRolesList;
    this.helpIndex = this._globalService.helpIndex;

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

    setTimeout(() => {
      const inputElement = document.querySelector('pbv-address-details input[name="address"]');
      if (inputElement) {
        inputElement.setAttribute('maxlength', '120');
      }
    }, 0);
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

  private _save(index: number): void {
    if (this.cRRow.valid) {
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrors = true;
      document.location.href = '#coAddressErrorSummary' + this.j;
    }
  } 

  public revertAddressRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteAddressRecord(index: number): void {
    this._errNotifService.updateErrorSummary(ADDRESS_ERROR_PREFIX + this.cRRow.get('id').value, null);
    // Find roles that need to be removed
    const prefixToDelete = index.toString();
    const rolesToRemove = this.selectedCompanyRoles().filter(role => role.startsWith(prefixToDelete));
    // Remove each matching role
    rolesToRemove.forEach(role => this._signalService.removeAddressCompanyRole(role));
    this.deleteRecord.emit(index);
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
    const uniqueRole = this.j + selectedRole;
    // Update signal array
    if (isChecked) {
      this._signalService.updateAddressCompanyRoles(uniqueRole);
    } else {
      this._signalService.removeAddressCompanyRole(uniqueRole);
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

    // Check if the company roles is in the list of errors, if so, extract it
    let roleError = null;
    const roleErrorIndex = this._coRolesErrors.findIndex(error => error.controlId === "companyRoles");
    if (roleErrorIndex !== -1) {
      // Extract the error
      roleError = this._coRolesErrors[roleErrorIndex];
  
      // Remove the error from the list
      this._coRolesErrors.splice(roleErrorIndex, 1);
    }
  
    const combinedErrors = [...this._coRolesErrors, ...this._addressErrorList, roleError].filter(error => error !== null);    if (combinedErrors === null) {
      this.emitErrors([]);
    } else {
      this.emitErrors(combinedErrors);
    }
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
}
