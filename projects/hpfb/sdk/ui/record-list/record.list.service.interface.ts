import { FormGroup } from '@angular/forms';

export interface RecordListServiceInterface {
  deleteModelRecord(id: number);
  getModelRecordList();
  getModelRecord(id);
  saveRecord(record: FormGroup, lang: string, ...args: any[]);
  initIndex(recordList);
  getNextIndex();
  resetIndex();
  getCurrentIndex();
  setIndex(value: number);
  // getRecordId(record: FormGroup);
  // setRecordId(record: FormGroup, value: number);
}
