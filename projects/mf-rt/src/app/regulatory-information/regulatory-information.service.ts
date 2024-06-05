import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';
import { RegulatoryInformation } from '../models/transaction';

@Injectable()
export class RegulatoryInformationService {

  constructor() {
  }

  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      dossierId: [
        null,
        [Validators.required, ValidationService.masterFileDossierIdValidator],
      ],
      masterFileName: [null, Validators.required],
      masterFileNumber: [null, ValidationService.masterFileNumberValidator],
      masterFileType: [null, Validators.required],
      masterFileUse: [null, Validators.required],
      descriptionType: [null, Validators.required],
      requestDate: [null, Validators.required],
      requester: [null, Validators.required],
      reqRevision: [null, Validators.required],
      revisedDescriptionType: [null, Validators.required],
    });
  }

  public mapRegulatoryFormToDataModel(formValue, regulartoryFormModel: RegulatoryInformation) {
    regulartoryFormModel.dossier_id = formValue.dossier_id;
  }

  public mapDataModelToRegulatoryForm(regulartoryFormModel: RegulatoryInformation, formRecord: FormGroup) {
    formRecord.controls['dossier_id'].setValue(regulartoryFormModel.dossier_id);
  }
}