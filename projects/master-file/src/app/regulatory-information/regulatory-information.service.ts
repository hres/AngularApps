import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  throwError,
  shareReplay,
  tap,
  filter,
} from 'rxjs';
import { GlobalsService, DataMapping } from '../globals/globals.service';
import { Ectd, TransactionEnrol } from '../models/transaction';
import { ICode, ICodeDefinition, IParentChildren } from '../shared/data';
import { DataService } from '../shared/data.service';
import { ValidationService } from '../validation.service';

@Injectable()
export class RegulatoryInformationService {
  private static lang = GlobalsService.ENGLISH; // todo remove it

  constructor(private _fb: FormBuilder, private _dataService: DataService) {}

  mfTypeOptions$: Observable<ICodeDefinition[]>;
  mfUseOptions$: Observable<ICode[]>;
  txDescs$: Observable<ICodeDefinition[]>;
  mfTypeTxDescOptions$: Observable<IParentChildren[]>;

  getMasterFileTypes(): Observable<ICodeDefinition[]> {
    this.mfTypeOptions$ = this._dataService
      .getData<ICodeDefinition>('mfTypes.json')
      .pipe(
        //tap((_) => console.log('getMasterFileTypeOptions is executed')),
        shareReplay(1)
      );
    return this.mfTypeOptions$;
  }

  getTxDescriptions(): Observable<ICodeDefinition[]> {
    this.txDescs$ = this._dataService
      .getData<ICodeDefinition>('txDescriptions.json')
      .pipe(
        //tap((_) => console.log('getTxDescriptions is executed')),
        shareReplay(1)
      );
    return this.txDescs$;
  }

  getMasterFileTypeAndTransactionDescription(): Observable<IParentChildren[]> {
    const mfTypeAndTransactionDescription$ = this._dataService
      .getData<any>('mfTypeTxDescription.json')
      .pipe(
        // tap((data) =>
        //   console.log(
        //     'getMasterFileTypeAndTransactionDescription ~ typeDescription: ',
        //     JSON.stringify(data)
        //   )
        // ),
        catchError(this._dataService.handleError)
      );


    this.mfTypeTxDescOptions$ = combineLatest([
      mfTypeAndTransactionDescription$,
      this.getTxDescriptions(),
    ]).pipe(
      map(([arr1, arr2]) => {
        return arr1.map((item) => ({
          parentId: item.mfId,
          children: arr2.filter((x) => {
            return item.descIds.includes(x.id);
          }),
        }));
      }),
      shareReplay(1)
    );

    return this.mfTypeTxDescOptions$;
  }

  getMasterFileUses(): Observable<ICode[]> {
    this.mfUseOptions$ = this._dataService.getData<ICode>('mfUses.json').pipe(
      //tap((_) => console.log('getMasterFileUses is executed')),
      shareReplay(1)
    );
    return this.mfUseOptions$;
  }

  public getRegularInfoForm() {
    // if (!_fb) {
    //   return null;
    // }
    return this._fb.group({
      dossierId: [
        '',
        [Validators.required, ValidationService.dossierIdValidator],
      ],
      masterFileName: ['', Validators.required],
      masterFileNumber: [ '', ValidationService.masterfileNumberValidator],
      masterFileType: ['', Validators.required],
      masterFileUse: ['', Validators.required],
      descriptionType: ['', Validators.required],
      requestDate: ['', Validators.required],
      requester: ['', Validators.required],
    });
  }

  regInfoDataMappings: DataMapping[] = [
    new DataMapping(
      'dossierId',
      GlobalsService.FC_TYPE_INPUT,
      'dossier_id',
      GlobalsService.OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileName',
      GlobalsService.FC_TYPE_INPUT,
      'product_name',
      GlobalsService.OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileNumber',
      GlobalsService.FC_TYPE_INPUT,
      'lifecycle_record.master_file_number',
      GlobalsService.OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileType',
      GlobalsService.FC_TYPE_ICODE,
      'lifecycle_record.regulatory_activity_type',
      GlobalsService.OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'masterFileUse',
      GlobalsService.FC_TYPE_ICODE,
      'lifecycle_record.master_file_use',
      GlobalsService.OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'descriptionType',
      GlobalsService.FC_TYPE_ICODE,
      'lifecycle_record.sequence_description_value',
      GlobalsService.OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'requestDate',
      GlobalsService.FC_TYPE_INPUT,
      'lifecycle_record.sequence_from_date',
      GlobalsService.OP_TYPE_TEXT
    ),
    new DataMapping(
      'requester',
      GlobalsService.FC_TYPE_INPUT,
      'lifecycle_record.requester_of_solicited_information',
      GlobalsService.OP_TYPE_TEXT
    ),    
  ];

  public mapFormModelToDataModel(
    formRecord: FormGroup,
    dataModel: Ectd,
    lang: string
  ): void {

    for (let mapping of this.regInfoDataMappings) {
      GlobalsService.convertFormDataToOutputModel(
        mapping,
        formRecord,
        dataModel,
        lang
      );
    }

    // save concatenated data to the dataModel
    // transaction_description: include display value Transaction description with additional details summarized added (date, etc)
    dataModel.lifecycle_record.transaction_description = 
      GlobalsService.concat(dataModel.lifecycle_record.sequence_description_value.__text, dataModel.lifecycle_record.sequence_from_date);
  }

  public mapDataModelToFormModel(
    dataModel: Ectd,
    formRecord: FormGroup,
    lang: string
  ): void {
    // loop through all mappings to set form values from the data model
    for (let mapping of this.regInfoDataMappings) {
      GlobalsService.convertOutputModelToFormData(
        mapping,
        formRecord,
        dataModel,
        lang
      );
    }

    // loop through all mappings again to deal with  those form controls whose value is an object
    // it will use the object id, which is set to the from control by previous looping, to find the object from the object subscription and then assign the object to the form control
    for (let mapping of this.regInfoDataMappings) {
      if (mapping.outputDataType === GlobalsService.OP_TYPE_IDTEXTLABEL) {
        const control = formRecord.controls[
          mapping.formControlName
        ] as FormControl;
        const controlName = mapping.formControlName;

        if (controlName === 'masterFileType') {
          GlobalsService.updateControlValue(controlName, control,  this.mfTypeOptions$ );
        } else if (controlName === 'masterFileUse') {
          GlobalsService.updateControlValue(controlName, control, this.mfUseOptions$);
        } else if (controlName === 'descriptionType') {
          GlobalsService.updateControlValue(controlName, control, this.txDescs$);
        }
      }
    }
  }

}
