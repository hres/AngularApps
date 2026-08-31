import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, CheckboxOption, ICodeDefinition, UtilsService, HelpSequence, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductLineService } from './product-line.service';
import { CompanyEnrol } from '../models/Company';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-line',
  templateUrl: './product-line.component.html',
  styleUrl: './product-line.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ProductLineComponent extends BaseComponent implements OnInit{

  public lang: string;
  helpIndex: HelpSequence;
  public showFieldErrors: boolean = false;

  public productLineForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Input() disableForm: boolean;
  @Output() errorList = new EventEmitter(true);
  @Output() productUpdated = new EventEmitter<CheckboxOption[]>();

  public productLineOptionList: CheckboxOption[] = [];
  public productLineCodeList: ICode[] = [];

  constructor(private _productLineService: ProductLineService,
              private _fb: FormBuilder,
              private _utilsService: UtilsService,
              private _globalService: GlobalService,
              private _converterService : ConverterService,
                private _translateService : TranslateService,) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.productLineCodeList = this._globalService.productLineList;

    this._getProductLineForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }

    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;

      if (!isFirstChange) {
        this._productLineService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this._getProductLineForm(), this.productLineCodeList,  this.productLineOptionList);
      }
    }

    if (this.disableForm) {
      this.disableFormGroup();
    } else {
      this.enableFormGroup();
    }
  }

  private _getProductLineForm(){
    if (!this.productLineForm) {
      this.productLineForm = ProductLineService.getEnrolmentForm(this._fb);
    }
    this._updateProductLineArray();

    return this.productLineForm;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    const fixedErrors = errors.map(error => {
      if (error) {
          const translationKey = error?.label || '';
          const fieldLabel = this.getFieldLabel(translationKey);
          error.label = fieldLabel;
          error.currentError = this.lang==='en'?'This field is required.':'Ce champ est obligatoire.';
      }
      return error;
  });

   this.errorList.emit(fixedErrors);
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
  getFormValue() {
    return this.productLineForm.value;
  }

  get productLineChkFormArray() {
    return this.productLineForm.get('productLine') as FormArray
  }

  get selectedProductLineCodes(): string[] {
    return this._productLineService.getProductLineCodes(this.productLineOptionList, this.productLineChkFormArray);
  }

  get productLine(): FormArray {
    return this.productLineForm.get('productLine') as FormArray;
  }

  productLineOnChange(e: any) {
    this.productLineForm.controls['selectedProductLines'].setValue(this.selectedProductLineCodes);
  }

  private _updateProductLineArray() {
    const productLineList = this._globalService.productLineList;
    this.productLineOptionList = productLineList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    if (this.productLineChkFormArray.length === 0) {
      this.productLineOptionList.forEach(() => {
        this.productLineChkFormArray.push(new FormControl(false));
      });
    }

    this.productUpdated.emit(this.productLineOptionList);
  }

  disableFormGroup() {
    if (this.productLineForm) {
      this.productLineForm.disable();
    }
  }

  enableFormGroup() {
    if (this.productLineForm) {
      this.productLineForm.enable();
    }
  }
}
