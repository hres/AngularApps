import { Injectable} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityBaseService } from '@hpfb/sdk/ui';
import { ProductInformation, SpecyAndSubType, WithdrawalTime } from '../models/ProductInformation';


@Injectable()
export class SpecySubtypeBaseService {

  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService) {}


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
      species: '',
      subtype: '',
      isUsedForTreatmentOfFoodProducingAnimals:'',
      withdrawal_time:this.getEmptyWithdrawalTime()
    };
  }
}
