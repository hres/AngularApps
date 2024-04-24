import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ExpanderModule, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialService } from '../material.service';
import { MaterialListService } from './material-list.service';
import { GlobalService } from '../../global/global.service';
import { MaterialItemComponent } from '../material-item/material-item.component';
import { BiologicalMaterial, BiologicalMaterials } from '../../models/Enrollment';
import { first } from 'rxjs';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';

@Component({
    selector: 'app-material-list',
    templateUrl: './material-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MaterialListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public materialListData: BiologicalMaterial[];
  @Output() public errorListUpdated = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  lang = this._globalService.lang();

  materialListForm: FormGroup;

  materialService = inject(MaterialService)
  materialListService = inject(MaterialListService)

  public showErrors = false;
  public errorList = [];
  errorSummaryChild = null;

  firstChange: boolean = false;

  constructor(private fb: FormBuilder, 
              private _utilsService: UtilsService, 
              private _globalService: GlobalService, 
              private _materialService : MaterialService,
              private _errorNotificationService : ErrorNotificationService) {

    this.materialListForm = this.fb.group({
      materials: this.fb.array([], [this.atLeastOneMaterial])
    });

    effect(() => {
      // console.log('[effect2]', this._materialService.errors());
    });
  }

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges) {
    this.firstChange = this._utilsService.isFirstChange(changes);

    // console.log(this._utilsService.checkComponentChanges(changes));
    if (changes['materialListData']) {
      // console.log("material list component - changes");
      this._init(changes['materialListData'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateLocalErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

    this._errorNotificationService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty 
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    console.log("processing error summary in contact list component...", errSummaryEntries);
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage);
    // console.log('....', filteredErrSummaryEntry);
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this._emitErrors();
  } 

  get materialsFormArr(): FormArray {
    return this.materialListForm.get('materials') as FormArray;
  }

  addMaterial() {
    const group = this.materialService.createMaterialFormGroup(this.fb);
    this.materialsFormArr.push(group);
  }

  saveMaterialRecord(event: any) {  
    const index = event.index;

    const group = this.materialsFormArr.at(index) as FormGroup;
    // if this is a new record, assign next available id, otherwise, use it's existing id
    const id = group.get('isNew').value? this.materialListService.getNextId(): group.get('id').value
    group.patchValue({ 
      id: id,
      isNew: false,
      expandFlag: false,    // collapse this record
    });

    const materialInfo = this.getMaterialInfo(group);

    // Update lastSavedState with the current value of contactInfo
    group.get('lastSavedState').setValue(materialInfo.value);

    this._expandNextInvalidRecord();

    this._globalService.setMaterialsFormArrValue(this.getMaterialsFormArrValues());
  }

  private _expandNextInvalidRecord(){
    // expand next invalid record
    for (let index = 0; index < this.materialsFormArr.controls.length; index++) {
     const group: FormGroup = this.materialsFormArr.controls[index] as FormGroup;
     if (group.invalid) {
      group.controls['expandFlag'].setValue(true);
       break;
     } 
   }     
 }

  deleteMaterialRecord(index){
    const group = this.materialsFormArr.at(index) as FormGroup;
    const materialInfo = this.getMaterialInfo(group);
    materialInfo.reset();
    this.materialsFormArr.removeAt(index);

    this._globalService.setMaterialsFormArrValue(this.getMaterialsFormArrValues());
    if(this.materialsFormArr.length == 0) {

    }
  }

  revertMaterial(event: any) {  
    const index = event.index;
    const id = event.id;

    const group = this.materialsFormArr.at(index) as FormGroup;
    const materialInfo =this.getMaterialInfo(group);

    // Revert to the last saved state
    const lastSavedState = group.get('lastSavedState').value;

    materialInfo.patchValue(lastSavedState);    
  }

  
  private _init(materialsData?: BiologicalMaterials) {
      // Clear existing controls
    console.log(materialsData);
    this.materialsFormArr.clear();
    const materials = materialsData.material;

    if (materials.length > 0) {

      if (materialsData) {
        materials.forEach(material => {
          const group = this.materialService.createMaterialFormGroup(this.fb);

          // Set values after defining the form controls
          group.patchValue({
            id: material.material_id,
            isNew: false,
            expandFlag: false,
          });

          this._patchMaterialInfoValue(group, material);

          this.materialsFormArr.push(group);
        });
      }
    } else {
      const group = this.materialService.createMaterialFormGroup(this.fb);
      this.materialsFormArr.push(group);
      const firstFormRecord = this.materialsFormArr.at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    }
    this._globalService.setMaterialsFormArrValue(this.getMaterialsFormArrValues());

    // Set the list of form groups
    this.materialListService.setList(this.materialsFormArr.controls as FormGroup[]);
  }

  // todo add contact type
  private _patchMaterialInfoValue(group: FormGroup, material): void {
    group.controls['materialInfo'].patchValue({
      materialName: material.material_name,
      deviceName: material.device_name,
      originCountry: material.origin_country? material.origin_country._id : '',
      specFamily: material.family_of_species._id,
      tissueType: material.tissue_substance_type._id? material.tissue_substance_type._id : '',
      tissueTypeOtherDetails: material.tissue_type_other_details,
      derivative: material.derivative? material.derivative._id : '',
      derivativeOtherDetails: material.derivative_other_details
    });
  }

  handleRowClick(event: any) {  
    const clickedIndex = event.index;
    const clickedRecordState = event.state;


    if (this.materialListForm.pristine) {
      this.materialsFormArr.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      if (this._utilsService.isFrench(this.lang)) {
        alert(
          "Veuillez sauvegarder les données d'entrée non enregistrées."
        );
      } else {
        alert(
          'Please save the unsaved input data.'
        );
      }
    }

  } 

  /**
   * Method to check if child material item has any errors
   * 
   * @param errs 
   */
  showError(errs) {
    if (errs.length > 0) {
      this.showErrors = true;
    } else {
      this.showErrors = false;
    }
  }
  
  public disableAddButton(): boolean {
    // console.log("material list form", this.materialListForm);
    // console.log("form is invalid: ", !this.materialListForm.valid,  "form has errors: ", this.showErrors, "form is dirty: ", this.materialListForm.dirty);
    return ( this.showErrors ||  this.materialListForm.dirty );
  }

  getMaterialInfo(materialFormGroup : FormGroup): FormGroup {
    return materialFormGroup.get('materialInfo') as FormGroup;
  }

  getMaterialsFormArrValues(): any {
    return this.materialsFormArr.value;
  }  

  private _updateLocalErrorList(errs) {
    if (errs) {
      errs.forEach(err => {
       this.errorList.push(err);
      });
    } 
    if (errs.length == 0) {
      this.errorList = errs;
    }

    this._emitErrors(); // needed or will generate a valuechanged error
  }

  private _emitErrors(): void {
    let emitErrors = [];

    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    
    // Error List is a QueryList type
    if (this.errorList) {
      this.errorList.forEach(err => {
        emitErrors.push(err);
      })
    }
    
    // console.log("emitting errors to info comp ..", emitErrors);
    this.errorListUpdated.emit(emitErrors);
    // this._materialService.errors.update( errors => emitErrors );
  }

  atLeastOneMaterial(formArray : FormArray) {
    // USE isNew control value to check if at least one record has been saved
    let atLeastOneRecord : boolean = false;

    formArray.controls.forEach((formGroup: FormGroup) => {
      // Access the controls in each FormGroup
      const isNew = formGroup.get('isNew');
      if (!isNew.value) {
        atLeastOneRecord = true;
      }
    });

    // const atLeastOneRecord = controls.some((control: AbstractControl) => control['isNew'].value !== true);
    // console.log("at least one record", atLeastOneRecord);
    return atLeastOneRecord ? null : { 'error.msg.materialOneRecord' : true };
} 

}