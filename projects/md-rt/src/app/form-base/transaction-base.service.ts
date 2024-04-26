import { Injectable } from '@angular/core';
import { EntityBaseService, IIdTextLabel, UtilsService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, TransFees } from '../models/Enrollment';
import { TransactionDetailsService } from '../transaction-details/transaction.details.service';
import { TransactionFeeService } from '../transaction-fee/transaction.fee.service';
import { GlobalService } from '../global/global.service';

@Injectable()
export class TransactionBaseService {

  constructor(private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService, 
    private _detailsService: TransactionDetailsService, private _feeService:TransactionFeeService) {
  }

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_TRANSACTION_ENROL: {
        template_version: '',
        form_language: '',
        application_info: this.getEmptyApplicationInfoModel(),
        transFees: this.getEmptyTransactionFeeModel(),
      }
    };
    
    return enrollment;
  }

  public getEmptyApplicationInfoModel() : ApplicationInfo{
    return (
      {
        last_saved_date: '',
        dossier_id: '',
        dossier_type: this._getMedicalDeviceDossierType(),
        company_id: '',
        manufacturer_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        regulatory_activity_lead: this._getMedicalDeviceDirectorateActivityLead(),
        regulatory_activity_type: this._entityBaseService.getEmptyIdTextLabel(),
        description_type: this._entityBaseService.getEmptyIdTextLabel(),
        device_class: this._entityBaseService.getEmptyIdTextLabel(),
        amend_reasons: null,
        licence_number: '',
        application_number: '',
        device_name: '',
        request_date: '',
        transaction_description: null,
        has_ddt: '',
        has_app_info: '',
        org_manufacture_id: '',
        org_manufacture_lic: '',
        meeting_id: '',
        proposed_licence_name: '',
        brief_description: '',
        rationale: '',
        proposed_indication: '',
      }
    );
  }

  public getEmptyTransactionFeeModel() : TransFees{
    return (
      {
        has_fees: '',
        billing_company_id: '',
        billing_contact_id: ''
      }
    );
  }

  private _getMedicalDeviceDossierType(): IIdTextLabel { 
    return this._utilsService.createIIdTextLabelObj('D23', 'Medical Device', 'Instruments Médicaux');
  }

  private _getMedicalDeviceDirectorateActivityLead(): IIdTextLabel { 
    return this._utilsService.createIIdTextLabelObj('B14-20160301-08', 'Medical Device Directorate', 'Direction des instruments médicaux');
  }


  public mapFormToOutput(detailsFormGroupValue, feeFormGroup): Enrollment{
    console.log(detailsFormGroupValue, feeFormGroup)

    let transactionInfoModel: ApplicationInfo = this.getEmptyApplicationInfoModel();
    this._detailsService.mapDetailFormToDataModel(detailsFormGroupValue, transactionInfoModel);

    let transFeeModel: TransFees = this.getEmptyTransactionFeeModel(); 
    this._feeService.mapFeeFormToDataModel(feeFormGroup, transFeeModel)

    const output: Enrollment = {
       'DEVICE_TRANSACTION_ENROL': {
         'template_version': this._globalService.$appVersion,
         'form_language': this._globalService.getCurrLanguage(),
         'application_info': transactionInfoModel,
         'transFees': transFeeModel
        }
    };

    // update the last_saved_date
    output.DEVICE_TRANSACTION_ENROL.application_info.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');

    return output;
  }

}
