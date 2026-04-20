import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { EQUALS, INGREDIENT_FORMULATION_ERROR_PREFIX, MEASURE, MEDICINAL, NON_MEDICINAL, NOT_LESS, NOT_MORE, OPTIONAL_FIELDS_INGREDIENT_FORMULATION, PRESENTATION, RANGE, UNITS_OTHER, UNIT_MEASURE_OTHER, YES } from '../../app.constants';
import { GlobalService } from '../../global/global.service';
import { IngredientFormulationService } from '../ingredient-formulation.service';

@Component({
  selector: 'app-ingredient-formulation-item',
  templateUrl: './ingredient-formulation-item.component.html',
  styleUrls: ['./ingredient-formulation-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class IngredientFormulationItemComponent extends BaseComponent {
  @Input() cRRow: FormGroup;
  @Input() j: number;
  @Input() showErrors: boolean;
  @Input() disableForm: boolean = false;

  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() deleteHandled = new EventEmitter();

  private _deleteIndex : number;

  public nanomaterialList: ICode[] = [];
  public operatorList: ICode[] = [];
  public perList: ICode[] = [];
  public roleList: ICode[] = [];
  public unitsList: ICode[] = [];
  public yesNoList: ICode[] = []
  public calculatedAsBaseList: ICode[] = [];
  public unitMeasureList: ICode[] = [];
  public unitPresentationList: ICode[] = [];

  lang = this._globalService.currLanguage;

  showAttestDetailsFreeText = false;

  public errors = [];

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
    private _errNotifService : ErrorNotificationService,
    private _translateService : TranslateService,
    private _converterService : ConverterService,
    private _ingredientFormulationService : IngredientFormulationService,
    private _recordDiscardService : RecordDiscardService,
    private _recordDeleteService : RecordDeleteService,
    private cdRef: ChangeDetectorRef) {
    super();
  }

  async ngOnInit() : Promise<void> {
    this.nanomaterialList = this._globalService.nanomaterialList;
    this.operatorList = this._globalService.operatorList;
    this.perList = this._globalService.perList;
    this.roleList = this._globalService.rolesList;
    this.unitsList = this._globalService.unitsList;
    this.yesNoList = this._globalService.yesnoList;
    this.calculatedAsBaseList = this._globalService.calculatedBaseList;
    this.unitMeasureList = this._globalService.unitMeasureList;
    this.unitPresentationList = this._globalService.unitPresentationList;
    this._initSubscriptions();
  }

  ngOnChanges(changes : SimpleChanges) : void {

  }

  private _initSubscriptions(): void {
    this._recordDeleteService.deleteConfirmed$.subscribe(index => {
      if (index === this._deleteIndex) {
        this._handleRecordDeletion();
        this.deleteHandled.emit(true)
      }
    });
  }

  isRoleSeleted() {
    return !!this.cRRow.get('ingredientFormulation.role')?.value; 
  }

  isMedicinalIngredient() {
    return this.cRRow.get('ingredientFormulation.role').value == MEDICINAL;
  }

  isNonMedicinalIngredient() {
    return this.cRRow.get('ingredientFormulation.role').value == NON_MEDICINAL;
  }

  isRangeOperator() {
    return this.cRRow.get('ingredientFormulation.operator').value == RANGE;
  }

  isValueOperator(): boolean {
    const value = this.cRRow.get('ingredientFormulation.operator')?.value;
    return [EQUALS, NOT_MORE, NOT_LESS].includes(Number(value));
  }

  isUnitsOther() {
    return this.cRRow.get('ingredientFormulation.units').value == UNITS_OTHER;
  }

  isUnitOfMeasure() {
    return this.cRRow.get('ingredientFormulation.per').value == MEASURE;
  }

  isUnitOfMeasureOther() {
    return this.cRRow.get('ingredientFormulation.unitOfMeasure').value == UNIT_MEASURE_OTHER;
  }

  isUnitOfPresentation() {
    return this.cRRow.get('ingredientFormulation.per').value == PRESENTATION;
  }

  hasPerValue(): boolean {
    return !!this.cRRow.get('ingredientFormulation.per')?.value;
  }

  isNanomaterial() {
    return this.cRRow.get('ingredientFormulation.isNanomaterial').value == YES;
  }

  isAnimalHumanSourced() {
    return this.cRRow.get('ingredientFormulation.isAnimalHumanSourced').value == YES;
  }

  isAttested(): boolean {
    return !!this.cRRow.get('ingredientFormulation.attestDetails')?.value;
  }

  attestDetailsOnChange() {
    const isChecked = this.cRRow.get('ingredientFormulation.attestDetails')?.value;
    const group = this.cRRow.get('ingredientFormulation') as FormGroup;

    OPTIONAL_FIELDS_INGREDIENT_FORMULATION.forEach(field => {
      const control = group.get(field);
  
      if (!control) return;
  
      if (isChecked) {
        control.clearValidators();
        control.setErrors(null);
      } else {
        control.enable();
  
        // re-add required validator ONLY if needed
        control.setValidators([Validators.required]);
      }
  
      control.updateValueAndValidity();
    });

    this.showAttestDetailsFreeText = isChecked;

  }


  rolesOnChange() {}
  operatorOnChange() {}
  unitsOnChange() {}

  perOnChange() {
    const perValueControl = this.cRRow.get('ingredientFormulation.perValue');
    const unitMeasureControl = this.cRRow.get('ingredientFormulation.unitOfMeasure');
    const unitPresentationControl = this.cRRow.get('ingredientFormulation.unitOfPresentation');

    if (this.isUnitOfPresentation()) {
      perValueControl?.setValue(1);
      perValueControl?.disable();
      unitMeasureControl.reset();
    } else {
      perValueControl?.enable();
      perValueControl?.reset();
      unitPresentationControl.reset();
    }
  }

  calculatedAsBaseOnChange() {}
  nanomaterialOnChange() {}

  saveIngredientRecord(index : number) : void {
    this._save(index);
  }

  private async _save(index: number) {
    console.log(this.cRRow.valid)
    console.log(this.cRRow)
    if (this.cRRow.valid) {
      const heading = await this._ingredientFormulationService.getHeading(index, this.cRRow); // Await here
      this.cRRow.get('heading').setValue(heading);
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrors = true;
      document.location.href = '#ingredientFormulationErrorSummary' + this.j;
    }
  }

  public async deleteIngredientRecord(index:number) {
    this._deleteIndex = index;
    const heading = await this._ingredientFormulationService.getHeading(index, this.cRRow); // Set heading here for when the record isn't saved yet
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({index: index, heading: this.cRRow.get('heading').value});
  }

  revertIngredientRecord(index: number, recordId: number) {
    this.revertRecord.emit({ index: index, id: recordId, heading: this.cRRow.get('heading').value });
    this.cRRow.markAsPristine();
  }

  private _handleRecordDeletion() {
    this._errNotifService.updateErrorSummary(INGREDIENT_FORMULATION_ERROR_PREFIX + this.cRRow.get('id').value, null);
    this.cRRow.markAsPristine();
  }

  disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  get addressDetailsFormGroup(): FormGroup {
    return this.cRRow.get('addressInfo.addressDetails') as FormGroup;
  }

  public showErrorSummary(): boolean {
    return (this.showErrors && this.errors.length > 0);
  }

  emitErrors(errors : any[]): void {
    // Not emitting any errors to parent, just setting the list of errors in contact-item
    this.errors = [...errors];

    // Process error summary component for when error summary list is shown and 1+ records are created
    if (this.showErrors) {
      this.processSummaries(this.errorSummaryChildList)
    }

    this.cdRef.detectChanges(); // Do change detection here to reactively update error summary
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length >= 1) {
      //console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    const errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errNotifService.updateErrorSummary(INGREDIENT_FORMULATION_ERROR_PREFIX + this.cRRow.get('id').value, errorSummaryChild);

  }
}
