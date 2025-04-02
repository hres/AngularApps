import { FormGroup } from '@angular/forms';

export interface IListService {
  setList(list: FormGroup[]): void;
  getNextId(): number;
  setMaxId(value: number): void;
  getId(): number;
}