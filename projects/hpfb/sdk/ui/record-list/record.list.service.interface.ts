import { FormGroup } from '@angular/forms';

// todo rename the class to ??

export interface RecordListServiceInterface {
  deleteModelRecord(id: number);
  getModelRecordList();
  getModelRecord(id);
  saveRecord(record: FormGroup);
  initIndex(recordList);
  getNextIndex();
  resetIndex();
  getCurrentIndex();
  setIndex(value: number);
  getRecordId(record: FormGroup);
  setRecordId(record: FormGroup, value: number);
}
