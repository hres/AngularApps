import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl ,FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';  
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {
  userForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.userForm = this.fb.group({
          users: this.fb.array([]) 
    });

    this.renderUser();
  }

  // Add form field row with initial data
  formRowWithData(data): FormGroup {
    return this.fb.group({    
      name: [data.name, Validators.required],  
      email: data.email,
      mobNumber: data.mobNumber
    });
  }

  // Add form field row with no data
  formRowWithOutData(): FormGroup {
    return this.fb.group({    
      name: ['', Validators.required],  
      email: [''],
      mobNumber: ['']
    });
  }

  // Dummy json 
  initialData = [
    {name : "a", email : "a@b.com", mobNumber:  "1111"},
    {name : "b", email : "b@c.com", mobNumber:  "2222"},
    {name : "c", email : "c@d.com", mobNumber:  "3333"}
  ]

  // Add new row in form
  addUser() {
    const control = <FormArray>this.userForm.get('users');
    control.push(this.formRowWithOutData());  
  }

  // Render initial data
  renderUser(){
    const control = <FormArray>this.userForm.get('users');
    for (let data of this.initialData ) {
      control.push(this.formRowWithData(data));  
    }
  }

  // Remove desired user row
  remove(index: number) {
    const control = <FormArray>this.userForm.get('users');
    control.removeAt(index);  

    // Romove Index row that are recorded as change
    let elementIndexToRemove = this.rowNeedToUpdate.indexOf(index);

    console.log(elementIndexToRemove);
    if (elementIndexToRemove >= 0) {
      this.rowNeedToUpdate.splice(elementIndexToRemove, 1);  
    }

    //console.log(elementIndexToRemove);
    //console.log(this.rowNeedToUpdate);

    // Managing rows array as we remove one elemement
    for(let i=elementIndexToRemove; i< this.rowNeedToUpdate.length; i++){
      this.rowNeedToUpdate[i] = this.rowNeedToUpdate[i] -1;
    }

    console.log(this.rowNeedToUpdate);
    
  }

  // Get form data
  save() {
    // To get all form records
    console.log(this.userForm.value);

    // To get records that we need to update

    var dataToSend = [];
    for(let i=0; i< this.rowNeedToUpdate.length; i++){
      dataToSend.push(this.userForm.value.users[this.rowNeedToUpdate[i]]);
    }

    console.log(dataToSend);
  }

  // Get row only for updation
  
  rowNeedToUpdate =[];
  dataToUpdate(rowIndex:any){
    //console.log(rowIndex);
    if(this.rowNeedToUpdate.includes(rowIndex)){
      return false;
    }
    this.rowNeedToUpdate.push(rowIndex);
    return true;
    
  }
 
  get usersFormArray() {
    return this.userForm.get('users')  as FormArray;
  }
}