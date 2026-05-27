import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
  ViewChildren,
  QueryList,
  inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FileConversionService,
  CheckSumService,
  UtilsService,
  ConverterService,
  VersionService,
  FileIoModule,
  ErrorModule,
  PipesModule,
  EntityBaseService,
  ControlMessagesComponent,
  ConvertResults,
  HelpSequence,
  CHECK_SUM_CONST,
} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import {
  FILE_OUTPUT_PREFIX,
  ROOT_TAG,
  START_CHECKSUM_VERSION,
  VERSION_TAG_PATH,
  XSLT_PREFIX,
} from '../app.constants';
import { FormBaseService } from './form-base.service';
import {
  DrugProductEnrol,
  Formulation,
  Ingredient,
  ProductInformation,
  SpecyAndSubType,
} from '../models/ProductInformation';
import { AppSignalService } from '../signal/app-signal.service';
import { FilereaderInstructionComponent } from '../filereader-instruction/filereader-instruction.component';
import { ProductInformationComponent } from '../product-information/product-information.component';
import { IngredientFormulationListComponent } from '../ingredient-formulation/ingredient-formulation-list/ingredient-formulation-list.component';
import { FormulationListComponent } from '../formulation/formulation-list/formulation-list.component';

@Component({
  selector: 'app-form-base',
  standalone: true,
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    FileConversionService,
    UtilsService,
    VersionService,
    CheckSumService,
    ConverterService,
    EntityBaseService,
    FormBaseService,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FileIoModule,
    ErrorModule,
    PipesModule,
    AppFormModule,
    FilereaderInstructionComponent,
  ],
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  lang: string;
  helpIndex: HelpSequence;
  devEnv: boolean;
  byPassCheckSum: boolean;

  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

  @ViewChild(ProductInformationComponent)
  productInfoComponent: ProductInformationComponent;
  @ViewChild(IngredientFormulationListComponent)
  ingredientFormulationListComponent: IngredientFormulationListComponent;
  @ViewChild(FormulationListComponent)
  formulationListComponent: FormulationListComponent;


  private _consertPrivacyError = [];

  public piForm: FormGroup;
  public errorList = [];
  public showErrors: boolean;
  private specyerrors: any;

  public _productInfoErrors = [];
  public headingLevel = 'h2';

  public enrollModel: ProductInformation;
  public productEnrollModel: DrugProductEnrol;
   public formulationListModel: Formulation[];

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;
  private _signalService = inject(AppSignalService);
  public latestSpeciesArray :SpecyAndSubType[];

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _baseService: FormBaseService,
    private _globalService: GlobalService,
    private _utilsService: UtilsService,
    private fileServices: FileConversionService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService
  ) {
    this.showErrors = false;
  }

  ngOnInit() {
    if (!this.piForm) {
      this.piForm = this._baseService.getReactiveModel(this._fb);
    }
    try {
      if (!this._globalService.enrollment) {
        // console.log("onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.enrollment = this.enrollModel;
      } else {
        this.enrollModel = this._globalService.enrollment;
      }

      this.productEnrollModel = this.enrollModel[this.rootTagText];

      // this._initModels(this.productEnrollModel);

      this.lang = this._globalService.currLanguage;
      this.helpIndex = this._globalService.helpIndex;
      this.devEnv = this._globalService.devEnv;
      this.byPassCheckSum = this._globalService.byPassChecksum;
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';

    this.msgList.changes.subscribe((errorObjs) => {
      let temp = [];
      this._updateErrorList(errorObjs);
      this.processErrors();
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {}

  processErrors() {
    this.errorList = [];
    this.errorList = this.errorList.concat(this._productInfoErrors);
    if (this.specyerrors) {
      this.errorList = this.errorList.concat(this.specyerrors);
    }
    this.cdr.detectChanges(); // doing our own change detection
  }

  processProductInfoErrors(errorList) {
    this._productInfoErrors = errorList;
    this.processErrors();
  }

 updateSpecyErrors(specyErrors) {
    this.specyerrors = specyErrors;
    if(this.latestSpeciesArray && this.latestSpeciesArray.length >0){
      this.specyerrors = undefined;
      const labelsToRemove = [
        'error.msg.contact.one.record',
        'error.msg.specy.required',
      ];

      this._productInfoErrors = this.errorList.filter(
        (err) => !labelsToRemove.includes(err.label)
      );
      this.errorList = [];
      this.errorList = this.errorList.concat(this._productInfoErrors);
    }
      this.processErrors();
  }

  processFormulationListErrors(errorList) {}

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  public saveXmlFile() {
    this.showErrors = true;
    this.processErrors();
    this._saveXML();
  }

  public saveWorkingCopyFile() {
    const result: ProductInformation = this._prepareForSaving(false);
    const fileName = this._generateFileName(result[ROOT_TAG]);
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    // console.log(fileData);
    if (fileData.data !== null) {
      this.productEnrollModel = fileData.data.DRUG_PRODUCT_ENROL;
      this._initModels(this.productEnrollModel);
      // this.setSelectedTxnDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);
      // this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.rtForm);
      // this.agentInfoOnChange();
    }
  }

  private _initModels(drugProduct: DrugProductEnrol) {
    const tFormulations = drugProduct.formulation_details;
    const tFormulationsArray = Array.isArray(tFormulations)
      ? tFormulations
      : [tFormulations];
    this.formulationListModel = tFormulationsArray;
    if (this._utilsService.isEmpty(tFormulations)) {
      this.formulationListModel = [];
    }

    console.log(this.formulationListModel);

    // const tIngredients = drugProduct.ingredients_testing;
    // const tIngredientsArray = Array.isArray(tIngredients) ? tIngredients : [tIngredients];
    // this.ingredientListModel = tIngredientsArray;
    // if (this._utilsService.isEmpty(tIngredients)) {
    //   this.ingredientListModel = [];
    // }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  _saveXML() {
    if (this.errorList && this.errorList.length < 1) {
      const result: ProductInformation = this._prepareForSaving(true);

      const fileName = this._generateFileName(result[ROOT_TAG]);
      const xsltVersion =
        this._versionService.getApplicationMajorVersionWithUnderscore(
          this._globalService.appVersion
        );
      const xslName = XSLT_PREFIX.toUpperCase() + '_PI_' + xsltVersion + '.xsl';

      this.fileServices.saveXmlToFile(result, fileName, true, xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';
  }

  private _prepareForSaving(xmlFile: boolean): ProductInformation {
    let formulationFormArrayValue = null;

    const newDrugProductEnrol: DrugProductEnrol =
      this._baseService.getEmptyDrugProductEnrol();


    const productInfoFormGroupValue = this.productInfoComponent.getFormValue();

    this._baseService.mapProductInfoFormToOutput(
      newDrugProductEnrol,
      productInfoFormGroupValue
    );


    if (this.formulationListComponent.recordFormArray) {
      formulationFormArrayValue =
        this.formulationListComponent.recordFormArray.value;
    }

    this._baseService.mapFormulationFormToOutput(
      newDrugProductEnrol,
      formulationFormArrayValue
    );

    newDrugProductEnrol.date_saved =
      this._utilsService.getFormattedDate('yyyy-MM-dd-HHmm');
    newDrugProductEnrol.software_version = this._globalService.appVersion;
    newDrugProductEnrol.form_language = this._globalService.currLanguage;

    const output: ProductInformation = {
      DRUG_PRODUCT_ENROL: newDrugProductEnrol,
    };
    if(this.latestSpeciesArray){
      output.DRUG_PRODUCT_ENROL.species_subtypes.species_subtypes = this.latestSpeciesArray
    }

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.DRUG_PRODUCT_ENROL[CHECK_SUM_CONST] = ''; // this is needed for generating the checksum value
      output.DRUG_PRODUCT_ENROL[CHECK_SUM_CONST] =
        this._checkSumService.createHash(output);
    }

    console.log('_prepareForSaving ~ output', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(drugProductEnrol: DrugProductEnrol): string {
    let fileName =
      FILE_OUTPUT_PREFIX +
      '-' +
      drugProductEnrol.dossier_id +
      '-' +
      drugProductEnrol.date_saved;
    return fileName;
  }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.piForm.controls[controlName].reset();
    }
  }


  public latestSpeciesArrayupdate(event){
    this.latestSpeciesArray = event;
  }


}
