import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService, IRecordService, BaseListComponent, BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
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
  recordInfo: string = 'ingredientInfo';
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

  protected _expandInvalidRecordUponLoading() {
  }

  expandAllInvalidRecords() {
  }

  protected _patchRecordInfoValue(form, outputModel: Ingredient) {
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl: any, outputModel: Ingredient) {
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
