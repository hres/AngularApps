import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { RecordFormGroup, ENGLISH, UtilsService, IRecordService, BaseListComponent, BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { GlobalService } from '../../global/global.service';
import { Ingredient } from '../../models/ProductInformation';
import { IngredientFormulationService } from '../ingredient-formulation.service';
import { IngredientFormulationListService } from './ingredient-formulation-list.service';

@Component({
  selector: 'app-ingredient-formulation-list',
  templateUrl: './ingredient-formulation-list.component.html',
  styleUrls: ['./ingredient-formulation-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class IngredientFormulationListComponent extends BaseListComponent<Ingredient>{
  recordService: IRecordService;

  records: string = 'ingredients';
  recordInfo: string = 'ingredientFormulation';
  popupId: string = 'ingredientPopup';
  discardPopupId: string = 'ingredientDiscardPopup';
  deletePopupId: string = 'ingredientDeletePopup';

  statusMessage : string = '';
  errorList;

  statusMessageSave : string = '';
  statusMessageDiscard: string = '';
  statusMessageDelete: string = '';

  focusField : string = '';
  addButton : string = 'addAddressBtn';
  
  @Output() errorEmit = new EventEmitter(true);

  constructor(private fb: FormBuilder,
    private _ingredientFormulationService: IngredientFormulationService,
    private _errorNotifService: ErrorNotificationService,
    private _globalService: GlobalService,
    private _utilsService: UtilsService,
    deleteService : RecordDeleteService,
    discardService : RecordDiscardService,
    ingredientFormulationListService: IngredientFormulationListService) {
      super(fb, ingredientFormulationListService, discardService, deleteService);
      this.recordService = this._ingredientFormulationService;
        this.recordFormGroup = this.fb.group({
        ingredients: this.fb.array([])
      });
  }

  ngOnInit():void {
    if (this._globalService.currLanguage === ENGLISH) {
      this.statusMessageSave = this.statusMessageDelete = this.statusMessageDiscard = 'Address details record';
    } else {
      this.statusMessageSave = this.statusMessageDelete = 'des détails de l’adresse';
      this.statusMessageDiscard = 'aux détails de l’adresse'
    }
  }

  override ngAfterViewInit(): void {
    this._errorNotifService.errorSummaryChanged$.subscribe((errors => {
      this._processErrorSummaries(errors);
    }))
  }

  protected _expandInvalidRecordUponLoading() {
    this.expandAllInvalidRecords();
  }

  expandAllInvalidRecords() {
    for (let index = 0; index < this.recordFormArray.controls.length; index++) {
      const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
      if (group.invalid) {
       group.controls['expandFlag'].setValue(true);
       group.markAsDirty();
       group.markAsTouched();
      }
    }
  }

  protected _patchRecordInfoValue(form, outputModel: Ingredient) {
    // this._companyAddressItemService.mapDataModelToFormModel(outputModel, form.controls['addressInfo'], this.companyRolesOptionList, form.controls['id'].value)
    // const addressDetailsFormGroup = form.controls['addressInfo'].controls['addressDetails'];
    // this._mapEarlyVersionCountryProvinceCodesAndPostal(outputModel.company_address_details);
    // this._addressDetailsService.mapDataModelToFormModel(outputModel.company_address_details, addressDetailsFormGroup);
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl: any, outputModel: Ingredient) {
    // const [selectedRoles, companyRoles] = this._companyAddressItemService.getSelectedCompanyRolesFromOutputModel(outputModel);
    // lastSavedStateFormControl.patchValue({
      
    //   }
    // })
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && summary.errSummaryMessage.componentId.startsWith("addressListTable"));
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this.emitErrors();
  }

  protected emitErrors(): void {
    let errorsToEmit = [];
    if (this.errorSummaryChild) {
      errorsToEmit.push(this.errorSummaryChild);
    }
    this.errorList = errorsToEmit;
    this.errorEmit.emit(errorsToEmit);
  }
}
