import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IIdTextLabel } from '../models/transaction';
import { ICode } from '../shared/data';

@Injectable()
export class GlobalsService {
  public static errorSummClassName: string = 'ErrorSummaryComponent';
  public static errorSummleastOneRcd: string = 'leastOneRecordError';
  public static CANADA: string = 'CAN';
  public static USA: string = 'USA';
  public static DATA_PATH: string = './assets/data/';
  public static ENGLISH: string = 'en';
  public static FRENCH: string = 'fr';
  public static YES: string = 'yes';
  public static NO: string = 'no';
  public static YESNOList = [GlobalsService.YES, GlobalsService.NO];
  // public static NEW: string = 'NEW';
  // public static AMEND: string = 'AMEND';
  public static FINAL: string = 'FINAL';

  public static STYLESHEETS_1_0_PREFIX = ''; // todo the value??
  // public static STYLESHEETS_1_0_PREFIX  = 'https://raw.githubusercontent.com/HealthCanada/HPFB/master/Medical-Device-REP/v_1_0/Style-Sheets/';
  public static SOFTWARE_VERSION: string = '2.0';

  public static MASTER_FILE_OUTPUT_PREFIX = 'mf-';

  // form control types
  public static FC_TYPE_INPUT = '1';
  public static FC_TYPE_ICODE = '2';
  // output data types
  public static OP_TYPE_TEXT = '10';
  public static OP_TYPE_IDTEXTLABEL = '20';

  constructor() {}

  static isFrench(lang: string): boolean {
    return lang === GlobalsService.FRENCH;
  }

  /**
   * Gets an yesno array
   *
   */
  static getYesNoList() {
    return [GlobalsService.YES, GlobalsService.NO];
  }

  static convertFormDataToOutputModel(
    mapping: DataMapping,
    formRecord: FormGroup,
    output,
    lang: string
  ): void {
    var splitted = mapping.outputDataName.split('.');

    let val: any;
    if (mapping.formControlType === GlobalsService.FC_TYPE_INPUT) {
      val = formRecord.controls[mapping.formControlName].value;
    } else if (mapping.formControlType === GlobalsService.FC_TYPE_ICODE) {
      val = this.convertCodeToIdTextLabel(
        formRecord.controls[mapping.formControlName].value,
        lang
      );
    }

    // console.log(
    //   'convertFormDataToOutputModel ~ mapping ',
    //   mapping,
    //   '~ formControlValue ',
    //   val,
    //   ' ~ splitted',
    //   splitted.length,
    //   splitted
    // );

    // hard code to handle max of one level down of the data structure. eg lifecycle_record.regulatory_activity_type
    if (splitted.length == 2) {
      output[splitted[0]][splitted[1]] = val;
    } else if (splitted.length == 1) {
      output[splitted[0]] = val;
    }
  }

  static convertOutputModelToFormData(
    mapping: DataMapping,
    formRecord: FormGroup,
    output,
    lang: string
  ): void {
    //  formRecord.controls['dossierId'].setValue(dataModel.dossier_id);
    var splitted = mapping.outputDataName.split('.');

    // hard code to handle max of one level down of the data structure. eg lifecycle_record.regulatory_activity_type
    let val: any;
    if (splitted.length == 2) {
      val = output[splitted[0]][splitted[1]];
    } else if (splitted.length == 1) {
      val = output[splitted[0]];
    }

    console.log(
      'convertOutputModelToFormData ~ mapping ',
      mapping,
      '~ outputValue ',
      val
    );

    if (mapping.outputDataType === GlobalsService.OP_TYPE_TEXT) {
      console.log('1 typeof val ', typeof val);
      formRecord.controls[mapping.formControlName].setValue(val);
    } else if (mapping.outputDataType === GlobalsService.OP_TYPE_IDTEXTLABEL) {
      console.log('2 typeof val ', typeof val);
      if (this.isIIdTextLabel(val)) {
        console.log('2.1 is IIdTextLabel');
      } else {
        console.log('2.1 is NOT IIdTextLabel');
      }

      formRecord.controls[mapping.formControlName].setValue(
        (val as IIdTextLabel)._id
      );
    }

    // console.log(
    //   'convertFormDataToOutputModel ~ mapping ',
    //   mapping,
    //   '~ formControlValue ',
    //   val,
    //   ' ~ splitted',
    //   splitted.length,
    //   splitted
    // );
  }

  private static isIIdTextLabel(obj: any): obj is IIdTextLabel {
    console.log(
      'GlobalsService ~ isIIdTextLabel ~ isIIdTextLabel',
      (<IIdTextLabel>obj)._id !== undefined
    );
    return (<IIdTextLabel>obj)._id !== undefined;
  }

  private static convertCodeToIdTextLabel(
    codeObj: ICode,
    lang: string
  ): IIdTextLabel {
    if (codeObj === undefined || codeObj === null) {
      return null;
    } else {
      const idTextLabelObj = {} as IIdTextLabel;
      idTextLabelObj.__text = this.isFrench(lang) ? codeObj.fr : codeObj.en;
      idTextLabelObj._id = codeObj.id;
      idTextLabelObj._label_en = codeObj.en;
      idTextLabelObj._label_fr = codeObj.fr;
      return idTextLabelObj;
    }
  }
  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  // private static _convertListText(rawList, lang) {
  //   const result = [];
  //   if (lang === GlobalsService.FRENCH) {
  //     rawList.forEach(item => {
  //       item.text = item.fr;
  //       result.push(item);
  //       //  console.log(item);
  //     });
  //   } else {
  //     rawList.forEach(item => {
  //       item.text = item.en;
  //       // console.log("adding country"+item.text);
  //       result.push(item);
  //       // console.log(item);
  //     });
  //   }
  //   return result;
  // }

  // private static _convertDate(value) {

  //   if (!value) {return ''; }
  //   const date = new Date(value);
  //   const m_names = ['Jan', 'Feb', 'Mar',
  //     'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  //     'Oct', 'Nov', 'Dec'];
  //   const result = m_names[date.getUTCMonth()] + '. ' + date.getUTCDate() + ', ' + date.getFullYear();
  //   return result;
  // }
}

// a mapping of form control to output data model
export class DataMapping {
  formControlName: string;
  formControlType: string;
  outputDataName: string;
  outputDataType: string;

  constructor(
    formControlName,
    formControlType,
    outputDataName,
    outputDataType
  ) {
    this.formControlName = formControlName;
    this.formControlType = formControlType;
    this.outputDataName = outputDataName;
    this.outputDataType = outputDataType;
  }
}