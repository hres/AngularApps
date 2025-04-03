import { inject, Injectable } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { ConverterService, ICode, ENGLISH, UtilsService, ValidationService, CheckboxOption } from "@hpfb/sdk/ui";
import { ENROLMENT_STATUS } from "../app.constants";
import { GlobalService } from "../global/global.service";
import { CompanyEnrol, ProductLine } from "../models/Company";
import { AppSignalService } from "../signal/app-signal.service";

@Injectable()
export class ProductLineService {
  private _signalService = inject(AppSignalService);
  private _utilsService = inject(UtilsService);
  private _converterService = inject(ConverterService);
  private _globalService = inject(GlobalService);

  public static getEnrolmentForm(fb:FormBuilder) {
      if (!fb) {
        return null;
      }
      return fb.group({
        productLine: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
        selectedProductLines: ['']
      });
  }

  public mapFormModelToDataModel(dataModel:CompanyEnrol, coEnrolFormModel:any) {
    const lang = this._globalService.currLanguage;
    const productLineList = this._globalService.productLineList;
    const products: ProductLine = {
      product_line: this._converterService.findAndConverCodesToIdTextLabels(productLineList, coEnrolFormModel.selectedProductLines, lang)
    }
    dataModel.product_line_checkbox = products;
  }

  public mapDataModelToFormModel(dataModel : CompanyEnrol, formModel:any, productLineList: ICode[], productLineListOption: CheckboxOption[]) {
    const lang = this._globalService.currLanguage;
    this.setProductLine(dataModel, formModel, productLineList, productLineListOption, lang); 
  }

  public setProductLine(dataModel: CompanyEnrol, formModel: any, productLineList: ICode[], productLineListOption: CheckboxOption[], lang) {
    if (dataModel?.product_line_checkbox?.product_line) {
      const loadedProductLineCodes: string[] = this._utilsService.getIdsFromIdTextLabels(dataModel.product_line_checkbox.product_line);
  
      if (loadedProductLineCodes.length > 0) {
        const productLineChkFormArray = this.getProductLineChkboxFormArray(formModel);
        this.loadProductLineOptions(productLineList, productLineListOption, productLineChkFormArray, lang);
        this._converterService.checkCheckboxes(loadedProductLineCodes, productLineListOption, productLineChkFormArray);
      }  
  
      formModel.controls['selectedProductLines'].setValue(loadedProductLineCodes);
    } else { // gets rid of error from older forms
      formModel.controls['selectedProductLines'].setValue([]);
    }
  }
  
  getProductLineCodes(productLineReasonList: CheckboxOption[], productLineChkFormArray: FormArray) : string[] {
    return this._converterService.getCheckedCheckboxValues(productLineReasonList, productLineChkFormArray);
  }

  getProductLineChkboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['productLine'] as FormArray;
  } 

  loadProductLineOptions(productList, productLineListOptionList, productLineChkFormArray, lang) {
    productLineListOptionList.length = 0;
    productLineChkFormArray.clear();

    productList.forEach((item) => {
      const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
      productLineListOptionList.push(checkboxOption);
      productLineChkFormArray.push(new FormControl(false));
    }); 
  }
}