import { ChangeDetectorRef, Component, effect, EventEmitter, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecordFormGroup, BaseComponent, CheckboxOption, ConverterService, ErrorNotificationService, ErrorSummaryComponent, HelpSequence, ICode, RecordDiscardService, RecordDeleteService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { EQUALS, INGREDIENT_FORMULATION_ERROR_PREFIX, MEASURE, MEDICINAL, NON_MEDICINAL, NOT_LESS, NOT_MORE, OPTIONAL_FIELDS_INGREDIENT_FORMULATION, PRESENTATION, RANGE, UNITS_OTHER, UNIT_MEASURE_OTHER, YES } from '../../app.constants';
import { GlobalService } from '../../global/global.service';
import { Ingredient } from '../../models/ProductInformation';
import { FormulationService } from '../formulation.service';

@Component({
  selector: 'app-formulation-item',
  templateUrl: './formulation-item.component.html',
  styleUrl: './formulation-item.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class FormulationItemComponent extends BaseComponent {

  @Input() cRRow: RecordFormGroup;
  @Input() j: number;
  @Input() showErrors: boolean;

  @Input() ingredFormModelList: Ingredient[];

  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() deleteHandled = new EventEmitter();
  @Output() processIngredListErrors = new EventEmitter();

  private _deleteIndex : number;

  public dosageFormList: ICode[] = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.formulation";
  headingPreambleParams: any;
  translatedParentLabel: string;

  lang = this._globalService.currLanguage;

  public errors = [];

  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummaryChild: ErrorSummaryComponent;

  constructor(private _globalService: GlobalService,
    private _errNotifService : ErrorNotificationService,
    private _translateService : TranslateService,
    private _converterService : ConverterService,
    private _formulationService : FormulationService,
    private _recordDiscardService : RecordDiscardService,
    private _recordDeleteService : RecordDeleteService,
    private cdRef: ChangeDetectorRef) {
    super();
  }

  async ngOnInit() : Promise<void> {
    this.dosageFormList = this._globalService.dosageFormList;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});

    this._initSubscriptions();
  }

//   ngOnChanges(changes: SimpleChanges): void {
//     console.log('FormulationItem ngOnChanges', changes);

//     if (changes['ingredFormModelList']) {
//         console.log(
//             'ingredient list:',
//             changes['ingredFormModelList'].currentValue
//         );

//         this.cdRef.detectChanges();
//     }
// }

ngOnChanges(changes: SimpleChanges): void {
  console.log('=== FormulationItem changes ===');
  console.log(
    'isArray =',
    Array.isArray(this.ingredFormModelList)
);
  if (changes['ingredFormModelList']) {
      console.log('ingredFormModelList:', changes['ingredFormModelList'].currentValue);
  }

  if (changes['cRRow']) {
      console.log('cRRow:', changes['cRRow'].currentValue);
  }
}

  private _initSubscriptions(): void {
    this._recordDeleteService.deleteConfirmed$.subscribe(index => {
      if (index === this._deleteIndex) {
        this._handleRecordDeletion();
        this.deleteHandled.emit(true)
      }
    });
  }

  dosageFormOnChange() {}

  saveFormulationRecord(index : number) : void {
    this._save(index);
  }

  private async _save(index: number) {
    // console.log(this.cRRow.valid)
    // console.log(this.cRRow)
    if (this.cRRow.valid) {
      const heading = await this._formulationService.getHeading(index, this.cRRow); // Await here
      this.cRRow.get('heading').setValue(heading);
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrors = true;
      document.location.href = '#formulationErrorSummary' + this.j;
    }
  }

  public async deleteFormulationRecord(index:number) {
    this._deleteIndex = index;
    const heading = await this._formulationService.getHeading(index, this.cRRow); // Set heading here for when the record isn't saved yet
    this.cRRow.get('heading').setValue(heading);
    this.deleteRecord.emit({index: index, heading: this.cRRow.get('heading').value});
  }

  revertFormulationRecord(index: number, recordId: number) {
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

  processIngredientListErrors(event : any) {
    this.processIngredListErrors.emit();
  }

  get ingredientFormGroup(): FormGroup {
    return this.cRRow.get('formulation.ingredientsFormGroup') as FormGroup;
  }

}
