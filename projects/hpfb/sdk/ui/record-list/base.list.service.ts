import { FormArray, FormGroup } from "@angular/forms";
import { IListService } from "./record.list.service.interface";


export abstract class BaseListService implements IListService {

  protected list: FormGroup[];

  setList(list: FormGroup[]): void {
    this.list = list;
  }

  getNextId(): number {
    let maxId = 0;

    // Iterate over the form groups
    this.list.forEach(control => {
      const id = control.get('id').value;
  
      // Parse the ID as a number and update maxId if necessary
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId) && numericId > maxId) {
        maxId = numericId;
      }
    });
  
    // Increment the maximum ID to get the next available ID
    return maxId + 1;
  }

  rearrangeIds(formArrValue): void{
    formArrValue.forEach((record, index) => {
      record.id = index + 1;
    });
  }
}