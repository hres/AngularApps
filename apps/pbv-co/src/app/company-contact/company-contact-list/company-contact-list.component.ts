import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray} from '@angular/forms';
import { ControlMessagesComponent } from '@hpfb/sdk/ui';
import { ContactRecord } from '../../models/Company';
import { BaseListComponent } from '../../record-base/base.list.component';
import { ListService } from '../../record-base/list.service';
import { CompanyContactService } from '../company-contact.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui';
import { IRecordService } from '../../record-base/record.service.interface';

@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.component.html',
  styleUrl: './company-contact-list.component.css'
})
export class CompanyContactListComponent extends BaseListComponent<ContactRecord>{
  recordService: IRecordService;

  records: string = 'contacts';
  recordInfo: string = 'companyInfo';
  popupId: string = 'contactPopup';
  statusMessage : string = '';

  @Output() errorList = new EventEmitter(true);

  constructor(private fb: FormBuilder, private _contactService: CompanyContactService) {
    super(fb);
    this.recordService = this._contactService;
    this.recordFormGroup = this.fb.group({
      contacts: this.fb.array([], [this.atLeastOneMaterial])
    });
  }

  ngOnInit():void {

  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    // Additional logic

  }

  protected _patchRecordInfoValue(group: FormGroup<any>, outputModel: any) {
    throw new Error('Method not implemented.');
  }

  processCompanyItemErrors(errorList) {
    this.emitErrors(errorList);
  }

  protected emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  atLeastOneMaterial(formArray : FormArray) {
    // USE isNew control value to check if at least one record has been saved
    let atLeastOneRecord : boolean = false;
    let oerr : ErrorSummaryObject = null;

    // console.log(formArray);

    formArray.controls.forEach((formGroup: FormGroup) => {
      // Access the controls in each FormGroup
      const isNew = formGroup.get('isNew');
      if (!isNew.value) {
        atLeastOneRecord = true;
      }
    });

    if (!atLeastOneRecord) {
      oerr = getEmptyErrorSummaryObj();
      oerr.index = 0;
      oerr.tableId = 'contactListTable';
      oerr.type = ERR_TYPE_LEAST_ONE_REC;
      oerr.label = 'error.msg.contactOneRecord';
    }

    // console.log("1 rec", atLeastOneRecord);
    // console.log(oerr);

    // const atLeastOneRecord = controls.some((control: AbstractControl) => control['isNew'].value !== true);
    // console.log("at least one record", atLeastOneRecord);
    return atLeastOneRecord ? null : { atLeastOneMat : oerr};
  } 

}
