import { Injectable } from '@angular/core';
import { CheckboxOption, ConverterService, UtilsService, ValidationService} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import {  DrugProductEnrol, ScheduleClaim, SpecyAndSubType } from '../models/ProductInformation';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpeciesSubtypesListService } from '../speciesSubtypes/species-subtypes-list-component/species-subtypes-list-service';


@Injectable()
export class ProductInformationService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService,   private specylistService : SpeciesSubtypesListService ) {}

  public static getProductInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    dossierType: [null, [Validators.required]],
    dossierId: [null],
    companyId: [null, [Validators.required, Validators.minLength(5)]],
    productName: [null, [Validators.required]],
    properName: [null, [Validators.required]],
    isAdminSub: [null],
    subType: [null, [Validators.required]],
    manufacturer: [null],
    mailing: [null],
    thisActivity: [null],
    importer: [null],
    isSchedule: [null],
    isInclude: [null],
    isOnDrugList: [null],
    isRegulated: [null],
    isOnDrug: [null],
    isNonPrescriptioScheduleApplied: [null],
    isDrugPermitted: [null],
    dosAge: [null, [Validators.required]],
    drugUse: [null, [Validators.required]],
    din:[null],
    scheduleClaimAndIndicationAssociatedOfProduct:[null, [Validators.required]],
    scheduleClaims: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
    selectedScheduleClaimCodes: [''],
    disinfectantTypes: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
    proposedIndicationOfUseDosage: [null, [Validators.required]],
    species_subtypes:[null]
   });

  }



  public mapFormModelToDataModel(formValue: any, dataModel: DrugProductEnrol): void {
    const lang = this._globalService.currLanguage;
    dataModel.dossier_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.dossierTypes, formValue['dossierType'], lang);
    dataModel.dossier_id = formValue['dossierId'];
    dataModel.company_id = formValue['companyId'];
    dataModel.product_name = formValue['productName'];
    dataModel.proper_name = formValue['properName'];
    dataModel.is_admin_sub = formValue['isAdminSub'];
    dataModel.sub_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.subTypeList, formValue['subType'], lang);
    dataModel.manufacturer = formValue['manufacturer'] == true ? 'Y': undefined;
    dataModel.mailing = formValue['mailing'] == true ? 'Y': undefined;
    dataModel.this_activity = formValue['thisActivity'] == true ? 'Y': undefined;
    dataModel.importer = formValue['importer'] == true ? 'Y': undefined;
    dataModel.isSchedule = formValue['isSchedule'] == true ? 'Y': undefined;
    dataModel.isInclude = formValue['isInclude'] == true ? 'Y': undefined;
    dataModel.isOnDrugList = formValue['isOnDrugList'] == true ? 'Y': undefined;
    dataModel.isRegulated = formValue['isRegulated'] == true ? 'Y': undefined;
    dataModel.isOnDrug = formValue['isOnDrug'] == true ? 'Y': undefined;
    dataModel.isNonPrescriptioScheduleApplied = formValue['isNonPrescriptioScheduleApplied'] == true ? 'Y': undefined;
    dataModel.proposedIndicationOfUseDosage = formValue['proposedIndicationOfUseDosage'];

    if (formValue['isNonPrescriptioScheduleApplied'] == true) {
            const scheduleClaim: ScheduleClaim = {
              schedule_claim_applied: this._converterService.findAndConverCodesToIdTextLabels(this._globalService.scheduleClaims, formValue.selectedScheduleClaimCodes, lang),
              din: formValue['din'],
              schedule_claim_indication: formValue['scheduleClaimAndIndicationAssociatedOfProduct'],
            }
            dataModel.is_schedule_claim = scheduleClaim;
      }

    dataModel.isDrugPermitted = formValue['isDrugPermitted'] == true ? 'Y': undefined;
    dataModel.dosAge = formValue['dosAge'];
    dataModel.drug_use = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.drugUse, formValue['drugUse'], lang);
  }

  public mapDataModelToFormModel(fb: FormBuilder,dataModel: DrugProductEnrol, formRecord: FormGroup,   scheduleClaimOptionList: CheckboxOption[] ): void {
    if(dataModel.dossier_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.dossier_type);
      formRecord.controls['dossierType'].setValue(id? id : null);
    } else {
      formRecord.controls['dossierType'].setValue(null);
    }
    formRecord.controls['dossierId'].setValue(dataModel.dossier_id);
    formRecord.controls['companyId'].setValue(dataModel.company_id);
    formRecord.controls['productName'].setValue(dataModel.product_name);
    formRecord.controls['properName'].setValue(dataModel.proper_name);
    formRecord.controls['isAdminSub'].setValue(dataModel.is_admin_sub);
    if(dataModel.sub_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.sub_type);
      formRecord.controls['subType'].setValue(id? id : null);
    } else {
      formRecord.controls['subType'].setValue(null);
    }
    formRecord.controls['manufacturer'].setValue(dataModel.manufacturer=='Y'?true:false);
    formRecord.controls['mailing'].setValue(dataModel.mailing=='Y'?true:false);
    formRecord.controls['thisActivity'].setValue(dataModel.this_activity=='Y'?true:false);
    formRecord.controls['importer'].setValue(dataModel.importer=='Y'?true:false);
    formRecord.controls['isSchedule'].setValue(dataModel.isSchedule=='Y'?true:false);
    formRecord.controls['isInclude'].setValue(dataModel.isInclude=='Y'?true:false);
    formRecord.controls['isOnDrugList'].setValue(dataModel.isOnDrugList=='Y'?true:false);
    formRecord.controls['isRegulated'].setValue(dataModel.isRegulated=='Y'?true:false);
    formRecord.controls['isNonPrescriptioScheduleApplied'].setValue(dataModel.isNonPrescriptioScheduleApplied=='Y'?true:false);
    formRecord.controls['isOnDrug'].setValue(dataModel.isOnDrug=='Y'?true:false);
    formRecord.controls['isDrugPermitted'].setValue(dataModel.isDrugPermitted=='Y'?true:false);
    formRecord.controls['dosAge'].setValue(dataModel.dosAge);
    formRecord.controls['proposedIndicationOfUseDosage'].setValue(dataModel.proposedIndicationOfUseDosage);

    if(dataModel.drug_use?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.drug_use);
      formRecord.controls['drugUse'].setValue(id? id : null);
    } else {
      formRecord.controls['drugUse'].setValue(null);
    }
  }



  getScheduleClaimChkboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['scheduleClaims'] as FormArray;
  }

  loadScheduleClaimOptions(scheduleClaimList, scheduleClaimOptionList, scheduleClaimChkFormArray, lang) {
    scheduleClaimOptionList.length = 0;
    scheduleClaimChkFormArray.clear();


    // Populate the array with new items
    scheduleClaimList.forEach((item) => {
      const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
      scheduleClaimOptionList.push(checkboxOption);
      scheduleClaimChkFormArray.push(new FormControl(false));
    });
  }

}