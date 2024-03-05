import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact, ErrorModule, ExpanderModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../contact.service';
import { ContactListService } from './contact-list.service';
import { GlobalService } from '../../global/global.service';
import { ContactItemComponent } from "../contact-item/contact-item.component";
import { DemoContact } from '../../models/Enrollment';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    templateUrl: './contact-list.component.html',
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorModule, ExpanderModule, ContactItemComponent],
    providers: [ContactListService, ContactService],
    encapsulation: ViewEncapsulation.None
})

export class ContactListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public contactListData: DemoContact[];

  // @Output() public contactsUpdated = new EventEmitter();
  
  contactListForm: FormGroup;
  isInternal: boolean;

  contactService = inject(ContactService)
  contactListService = inject(ContactListService)

  constructor(private fb: FormBuilder, private _utilsService: UtilsService, private _globalService: GlobalService) {
    this.isInternal = this._globalService.$isInternal;
    console.log("isInternal", this.isInternal);

    this.contactListForm = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));
    if (changes['contactListData']) {
      this._init(changes['contactListData'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    
  }

  get contactsFormArr(): FormArray {
    return this.contactListForm.get('contacts') as FormArray;
  }

  addContact() {
    const group = this.contactService.createContactFormGroup(this.fb, this.isInternal);
    this.contactsFormArr.push(group);
  }

  saveContactRecord(event: any) {  
    const index = event.index;
    const status = event.contactStatus;
    console.log("saveContactRecord", index, status);

    const group = this.contactsFormArr.at(index) as FormGroup;
    // if this is a new record, assign next available id, otherwise, use it's existing id
    const id = group.get('isNew').value? this.contactListService.getNextId(): group.get('id').value
    group.patchValue({ 
      id: id,
      isNew: false,
      expandFlag: false,    // collapse this record
    });

    const contactInfo =this.getContactInfo(group);

    // Update the status if it is passed in
    if (status) {
      contactInfo.controls['status'].setValue(status);
    }

    // Update lastSavedState with the current value of contactInfo
    contactInfo.get('lastSavedState').setValue(contactInfo.value);

    this._expandNextInvalidRecord();

    // this.contactsUpdated.emit(this.getContactsFormArrValues());
    this._globalService.setContactsFormArrValue(this.getContactsFormArrValues());
  }

  private _expandNextInvalidRecord(){
    // expand next invalid record
    for (let index = 0; index < this.contactsFormArr.controls.length; index++) {
     const group: FormGroup = this.contactsFormArr.controls[index] as FormGroup;
     if (group.invalid) {
      group.controls['expandFlag'].setValue(true);
       break;
     } 
   }     
 }

  deleteContactRecord(index){
    console.log(index);
    this.contactsFormArr.removeAt(index);

    // this.contactsUpdated.emit(this.getContactsFormArrValues());
    this._globalService.setContactsFormArrValue(this.getContactsFormArrValues());
  }

  revertContact(event: any) {  
    const index = event.index;
    const id = event.id;
    console.log("revertContact", index, id);

    const group = this.contactsFormArr.at(index) as FormGroup;
    const contactInfo =this.getContactInfo(group);

    // Revert to the last saved state
    const lastSavedState = contactInfo.get('lastSavedState').value;
    contactInfo.patchValue(lastSavedState);    

    // const filteredContact = this.contactListData.find(contact => contact.id === id);
    // if (filteredContact !== undefined) {
    //   // Found a matching contact
    //   this._patchContactInfoValue(group, filteredContact);
    // } else {
    //   console.error("COULDN'T FIND THE ORIGINAL CONTACT")
    // }
  }

  
    private _init(contactsData: DemoContact[]) {
      // Clear existing controls
    this.contactsFormArr.clear();

    if (contactsData.length > 0) {
      contactsData.forEach(contact => {
        const group = this.contactService.createContactFormGroup(this.fb, this.isInternal);

        // Set values after defining the form controls
        group.patchValue({
          id: contact.id,
          isNew: false,
          expandFlag: false,
        });

        this._patchContactInfoValue(group, contact);

        this.contactsFormArr.push(group);
      });
    } else {
      const group = this.contactService.createContactFormGroup(this.fb, this.isInternal);
      this.contactsFormArr.push(group);
    }

    this._globalService.setContactsFormArrValue(this.getContactsFormArrValues());

    // if (this.isInternal) {
    //   this._expandNextInvalidRecord();
    // } else {
      // expand the first record
      const firstFormRecord = this.contactsFormArr.at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    // }

      // Set the list of form groups
      this.contactListService.setList(this.contactsFormArr.controls as FormGroup[]);
  }

  // todo add contact type
  private _patchContactInfoValue(group: FormGroup, contact): void {
    group.controls['contactInfo'].patchValue({
      status: contact.status._id,
      fullName: contact.full_name,
      jobTitle: contact.job_title
    });
  }

  handleRowClick(event: any) {  
    const clickedIndex = event.index;
    const clickedRecordState = event.state;

    console.log(this._utilsService.logFormControlState(this.contactListForm))

    if (this.contactListForm.pristine) {
      this.contactsFormArr.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      // if (this._utilsService.isFrench(this.lang)) {
      //   alert(
      //     "Veuillez sauvegarder les données d'entrée non enregistrées."
      //   );
      // } else {
        alert(
          'Please save the unsaved input data.'
        );
      // }
    }

  }  

  // get the contactInfo FormGroup
  getContactInfo(contactFormGroup : FormGroup): FormGroup {
    return contactFormGroup.get('contactInfo') as FormGroup;
  }

  // retrieve the values of the contacts form array
  getContactsFormArrValues(): any {
    return this.contactsFormArr.value;
  }  
}

