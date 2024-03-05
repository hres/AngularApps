import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService, YES } from '@hpfb/sdk/ui';


@Injectable()
export class CompanyInfoService {

  constructor(private _fb: FormBuilder, private _utilsService: UtilsService) {}

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  getReactiveModel(): FormGroup{
    return this._fb.group({
      // firstname: [''],
      // formStatus: [EnrollmentStatus.New],
      // formStatusText: '', // UI display
      // lastSavedDate: '',
      // companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      // amendReasons: this._fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
      // rationale: ['', [Validators.required]],
      areLicensesTransfered: ['', [Validators.required]]
    });
  }
}