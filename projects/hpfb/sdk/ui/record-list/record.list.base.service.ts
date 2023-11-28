import { FormArray, FormGroup } from "@angular/forms";

export abstract class RecordListBaseService {

  /**
   * Used to create address ids
   * @type {number}
   * @private
   */
  private _indexValue = -1;

  constructor() {

  }

  // static getRecord(recordList: Array<any>, value, prop) {
  //   for (let i = 0; i < recordList.length; i++) {
  //     if (recordList[i][prop] === value) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  /**
   * Parses the current data and finds the largest ID
   * @public
   */
  public initIndex(recordList) {
    this.resetIndex();
    for (let record of recordList) {
      if (record.id > this._indexValue) {
        this._indexValue = record.id;
      }
    }
    // console.log("The index value "+  this._indexValue)
  }

  /**
   * Gets the next index id for the details record
   * @returns {number}
   */
  getNextIndex() {
    this._indexValue++;
    // console.log("In list service get id "+ this._indexValue);
    return this._indexValue;
  }

  /**
   * Resets the index to the base value. Used for record ids
   */
  public resetIndex() {
    this._indexValue = -1;
  }

  /**
   * Gets the current id value to use for a record
   * @returns {number}
   */
  getCurrentIndex() {

    return this._indexValue;
  }

  /**
   * Sets the record id to a value
   * @param {number} value
   */
  public setIndex(value: number) {
    this._indexValue = value;
  }

  public updateFormRecordListSeqNumber(formRecordList: FormArray){
    formRecordList.controls.forEach( (element: FormGroup) => {
      // console.log(element);
      element.controls['seqNumber'].setValue(Number(element.controls['id'].value) + 1)
    });  
  }

  /**
   * if formRecordIdToExpand is passed in, expand that record and collapse other records;
   * otherwise, collapse all records
   * 
   * @param formRecordList 
   * @param formRecordIdToExpand optional
   */
  public collapseFormRecordList(formRecordList: FormArray, formRecordIdToExpand?: number){
    formRecordList.controls.forEach( (element: FormGroup) => {
      // console.log(element);
      if ( (formRecordIdToExpand !== undefined) && (Number(element.controls['id'].value) === formRecordIdToExpand) ) {
        element.controls['expandFlag'].setValue(true);
      } else {
        element.controls['expandFlag'].setValue(false);
      }
    });  
  }

}

