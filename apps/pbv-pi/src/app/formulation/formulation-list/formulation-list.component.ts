import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { RecordFormGroup, ENGLISH, UtilsService, IRecordService, BaseListComponent, BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { GlobalService } from '../../global/global.service';
import { Formulation, Ingredient } from '../../models/ProductInformation';
import { FormulationService } from '../formulation.service';
import { FormulationItemService } from '../formulation-item/formulation-item.service';
import { FormulationListService } from './formulation-list.service';
import { IngredientFormulationItemService } from '../../ingredient-formulation/ingredient-formulation-item/ingredient-formulation-item.service';
@Component({
  selector: 'app-formulation-list',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  templateUrl: './formulation-list.component.html',
  styleUrl: './formulation-list.component.css'
})
export class FormulationListComponent extends BaseListComponent<Formulation>{
  recordService: IRecordService;

  records: string = 'formulations';
  recordInfo: string = 'formulation';
  popupId: string = 'formulationPopup';
  discardPopupId: string = 'formulationDiscardPopup';
  deletePopupId: string = 'formulationDeletePopup';

  statusMessage : string = '';
  errorList;

  statusMessageSave : string = '';
  statusMessageDiscard: string = '';
  statusMessageDelete: string = '';

  focusField : string = '';
  addButton : string = 'addFormulationBtn';

  @Input() ingredientFormModelList;
  @Output() errorEmit = new EventEmitter(true);
  @Output() ingredientFormErrors = new EventEmitter();

  constructor(private fb: FormBuilder,
    private _formulationService: FormulationService,
    private _formulationItemService: FormulationItemService,
    private _ingredFormItemService: IngredientFormulationItemService,
    private _errorNotifService: ErrorNotificationService,
    private _globalService: GlobalService,
    private _utilsService: UtilsService,
    deleteService : RecordDeleteService,
    discardService : RecordDiscardService,
    formulationListService: FormulationListService) {
      super(fb, formulationListService, discardService, deleteService);
      this.recordService = this._formulationService;
        this.recordFormGroup = this.fb.group({
        formulations: this.fb.array([])
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

  // This function is called when looping through the output data's list of records
  // Maps output model to form
  protected _patchRecordInfoValue(form, outputModel: Formulation) {

    this._formulationItemService.mapDataModelToFormModel(outputModel, form.controls['formulation']);

    console.log(outputModel, form.controls['formulation']);

    // Map formulation's ingredient list - pass ingredient list to form-item and it will past the list
    // to ingred form list -> mapping will happen in the ingred list component
    this.ingredientFormModelList = outputModel?.ingredient_section;
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl: any, outputModel: Ingredient) {
    // TODO: This method is for discarding changes after loading in XML file
    lastSavedStateFormControl.patchValue({

    })
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

  processIngredListErrors(event : any) {
    this.ingredientFormErrors.emit();
  }
}
