import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { EQUALS, MEASURE, MEDICINAL, NON_MEDICINAL, NOT_LESS, NOT_MORE, OPTIONAL_FIELDS_INGREDIENT_FORMULATION, PRESENTATION, RANGE, UNITS_OTHER, UNIT_MEASURE_OTHER, YES } from '../../app.constants';
import { GlobalService } from '../../global/global.service';

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

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
    private _errNotifService : ErrorNotificationService,
    private _translateService : TranslateService,
    private _converterService : ConverterService,
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

  saveIngredientRecord(index:number) {

  }

  deleteIngredientRecord(index:number) {

  }

  revertIngredientRecord(index: number, recordId: number) {

  }

  disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  emitErrors(): void {
    
  }
}
