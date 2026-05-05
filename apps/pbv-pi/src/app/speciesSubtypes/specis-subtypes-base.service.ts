import { Injectable} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityBaseService } from '@hpfb/sdk/ui';
import { ProductInformation, SpecyAndSubType, WithdrawalTime } from '../models/ProductInformation';


@Injectable()
export class SpecySubtypeBaseService {

  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService) {}

  // /**
  //  * Gets the reactive forms Model for generalInfo details
  //  * @param {FormBuilder} fb
  //  * @returns {any}
  //  */
  // buildForm() : FormGroup {
  //   return this._fb.group({
  //     status: EnrollmentStatus.New,
  //     lastSavedDate: '',
  //     companyId: ['', [Validators.required, Validators.min(5)]]
  //   });
  // }


  // public getEmptySpecyAndSubType(): SpecyAndSubType{
  // return (
  //   {
  //     id: null,
  //     specy: '',
  //     subtype: '',
  //     withdrawal_time: this.getEmptyWithdrawalTime()
  //     }
  // );


  // }


  public getEmptyWithdrawalTime(): WithdrawalTime {
    return (
      { days: null,
        hours: null,
      }
    );
  }







  getEmptySpecySubtypeModel(): SpecyAndSubType {
    return {
      id: null,
      specy: '',
      subtype: '',
      isUsedForTreatmentOfFoodProducingAnimals:'',
      withdrawal_time:this.getEmptyWithdrawalTime()
    };
  }
}
