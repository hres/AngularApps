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
}

export interface IListService {
  setList(list: FormGroup[]): void;
  getNextId(): number;
}