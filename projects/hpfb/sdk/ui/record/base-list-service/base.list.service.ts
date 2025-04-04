import { FormArray, FormGroup } from "@angular/forms";
import { IListService } from "./base.list.service.interface";


export abstract class BaseListService implements IListService {

  protected list: FormGroup[];
  protected idCount: number = 0;

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

  // These are id's are used for keeping track of recordId - used for prefixes on global variables accross records
  setMaxId(value : number): void {
    this.idCount = value;
  }

  getId(): number {
    this.idCount += 1;
    return this.idCount;
  }
}