import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ErrorSummaryComponent, UtilsService } from '@hpfb/sdk/ui';
import { MaterialService } from '../material.service';
import { MaterialListService } from './material-list.service';
import { GlobalService } from '../../global/global.service';
import { BiologicalMaterial } from '../../models/Enrollment';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui/error-msg/error-summary/error-summary-object';

@Component({
    selector: 'app-material-list',
    templateUrl: './material-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MaterialListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public materialListData: BiologicalMaterial[];

  materialListForm: FormGroup;

  materialService = inject(MaterialService)
  materialListService = inject(MaterialListService)

  public showErrors = false;
  errorSummaryChild = null;

  firstChange: boolean = false;

  popupId = "materialPopup";

  atLeastOneRec = signal(false);
  atLeastOneRecBoolean = false;

  constructor(private fb: FormBuilder, 
              private _utilsService: UtilsService, 
              private _globalService: GlobalService, 
              private _materialService : MaterialService,
              private _errNotifService : ErrorNotificationService) {

    this.materialListForm = this.fb.group({
      materials: this.fb.array([], [this.atLeastOneMaterial])
    });

    effect(() => {
      //console.log('[effect]', this.atLeastOneRec());
      this.atLeastOneRecBoolean = this.atLeastOneRec();
      this._emitErrors();
    }, {
      allowSignalWrites: true
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
    // this.msgList.changes.subscribe(errorObjs => {
    //   this._updateLocalErrorList(errorObjs);
    // });
    // this.msgList.notifyOnChanges();

    this._errNotifService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty 
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && summary.errSummaryMessage.componentId !== "deviceListTable");
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
    if (this.materialsFormArr.length > 1) {
      this._materialService.showMaterialErrorSummaryOneRec.set(false);
    }
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

    if (this.materialsFormArr.length > 0) {
      this.atLeastOneRec.set(true);
    }

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
    
    if (this.materialsFormArr.length == 0) {
      this.atLeastOneRec.set(false);
      this._emitErrors();
    }
    if (this.materialsFormArr.length == 1) {
      this._materialService.showMaterialErrorSummaryOneRec.set(true);
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

  
  private _init(materialsData: BiologicalMaterial[]) {
      // Clear existing controls
    this.materialsFormArr.clear();

    if (materialsData.length > 0) {
        if (materialsData) {
          materialsData.forEach(material => {
            const group = this.materialService.createMaterialFormGroup(this.fb);

            // Set values after defining the form controls
            group.patchValue({
              id: material.id,
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
      this.openPopup();
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

  private _emitErrors(): void {
    let emitErrors = [];

    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    
    if (this.materialsFormArr.errors) {
      emitErrors.push(this.materialsFormArr.errors['atLeastOneMat']);
    }

   this._materialService.setListErrors(emitErrors);
    
    // console.log("emitting errors to info comp ..", emitErrors);
    // this.errorListUpdated.emit(emitErrors);
    // this._materialService.errors.update( errors => emitErrors );
  }

  atLeastOneMaterial(formArray : FormArray) {
    // USE isNew control value to check if at least one record has been saved
    let atLeastOneRecord : boolean = false;
    let oerr : ErrorSummaryObject = null;

    // console.log(formArray);

    formArray.controls.forEach((formGroup: FormGroup) => {
      // Access the controls in each FormGroup
      const isNew = formGroup.get('isNew');
      if (!isNew.value) {
        atLeastOneRecord = true;
      }
    });

    if (!atLeastOneRecord) {
      oerr = getEmptyErrorSummaryObj();
      oerr.index = 0;
      oerr.tableId = 'materialListTable';
      oerr.type = ERR_TYPE_LEAST_ONE_REC;
      oerr.label = 'error.msg.materialOneRecord';
    }

    // console.log("1 rec", atLeastOneRecord);
    // console.log(oerr);

    // const atLeastOneRecord = controls.some((control: AbstractControl) => control['isNew'].value !== true);
    // console.log("at least one record", atLeastOneRecord);
    return atLeastOneRecord ? null : { atLeastOneMat : oerr};
  } 

  openPopup(){
    jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
  }
}