import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { ERR_TYPE_LEAST_ONE_REC, ErrorNotificationService, ErrorSummaryComponent, ErrorSummaryObject, getEmptyErrorSummaryObj, UtilsService } from '@hpfb/sdk/ui';
import { MaterialService } from '../material.service';
import { MaterialListService } from './material-list.service';
import { GlobalService } from '../../global/global.service';
import { BiologicalMaterial } from '../../models/Enrollment';
import { MATERIAL_ERROR_PREFIX } from '../../app.constants';

@Component({
    selector: 'app-material-list',
    templateUrl: './material-list.component.html',
    encapsulation: ViewEncapsulation.None,  standalone: false
})

export class MaterialListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public materialListData: BiologicalMaterial[];
  @Input() xmlTriggered: boolean;

  materialListForm: FormGroup;

  materialService = inject(MaterialService)
  materialListService = inject(MaterialListService)

  public showErrors = false;
  errorSummaryChild = null;

  firstChange: boolean = false;

  popupId = "materialPopup";
  accordionId = 'materialAccordion'
  deleteMaterialPopupID = 'deleteMaterialPopupID';
  discardChangePopupID = 'discardMaterialChangesPopupID';
  deleteRecordHeading: string;
  discardChangeHeading: string;
  popupTrigger: HTMLElement = null;

  atLeastOneRec = signal(false);
  atLeastOneRecBoolean = false;

  statusMessage : string = '';

  private materialId: number; // ID a record is assigned to
  private materialIndex: number; // Place of the record in the array

  updateMateriraForm: FormGroup;

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
      this._clearErrorList();
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
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && !summary.errSummaryMessage.componentId.startsWith("deviceListTable"));
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
    const newIndex = this.materialsFormArr.length;
    const group = this.materialService.createMaterialFormGroup(this.fb);
    let materialFocus = "";

    this.materialsFormArr.push(group);
    this.materialListService.updateUIDisplayValues(this.materialsFormArr);

    if (this.materialsFormArr.length > 1) {
      this._materialService.showMaterialErrorSummaryOneRec.set(false);
    }
    if (this.materialsFormArr.length >= 1) {
      materialFocus = "materialName" + newIndex;
    } else {
      materialFocus = "materialName" + 0;
    }
    setTimeout(() => {
      document.getElementById(materialFocus).focus()
    }, 0);
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

    this._emitErrors(true);

    if (this._globalService.lang() == "en") {
      this.statusMessage = "Biological material record " + group.controls['seqNumber'].value + " has been saved.";
    } else {
      this.statusMessage = "Enregistrement du matériel biologique " + group.controls['seqNumber'].value + " a été sauvegardé.";
    }
    setTimeout(() => {
      document.getElementById('addMaterialBtn').focus()
    }, 0);
  }

  private _expandNextInvalidRecord(){
    // expand next invalid record
    for (let index = 0; index < this.materialsFormArr.controls.length; index++) {
     const group: FormGroup = this.materialsFormArr.controls[index] as FormGroup;
     if (group.invalid) {
      group.controls['expandFlag'].setValue(true);
      this.materialListForm.markAsDirty();
       break;
     }
   }
 }

  confirmDeleteMaterialRecord(event:any) {
    this.materialId = event.id;
    console.log(this.materialId);
    this.materialIndex = event.index;
    console.log(this.materialIndex);
    this.deleteRecordHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;

    this.openConfirmationPopup(this.deleteMaterialPopupID);
  }

  confirmRevertMaterial(event:any) {
    this.materialId = event.id;
    this.materialIndex = event.index;
    this.discardChangeHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.discardChangePopupID);
     this.updateMateriraForm = event.tempMaterialForm;
     this.updateMateriraForm.markAsDirty()
  }

  deleteMaterialRecord(){
    const id : number = this.materialId;
    const index : number = this.materialIndex;
    const group = this.materialsFormArr.at(index) as FormGroup;
    const materialInfo = this.getMaterialInfo(group);
    materialInfo.reset();
    this.materialsFormArr.removeAt(index);
    
    this.materialListForm.markAsPristine();
    this._errNotifService.updateErrorSummary(MATERIAL_ERROR_PREFIX + this.materialId, null);

    this._globalService.setMaterialsFormArrValue(this.getMaterialsFormArrValues());

    if (this.materialsFormArr.length == 0) {
      this.atLeastOneRec.set(false);
      this._emitErrors();
    }

    if (this.materialsFormArr.length >= 1) {
      this._emitErrors(true);
    }

    if (this.materialsFormArr.length == 1) {
      this._materialService.showMaterialErrorSummaryOneRec.set(true);
    }

    this.materialListService.updateUIDisplayValues(this.materialsFormArr);

    if (this._globalService.lang() == "en") {
      this.statusMessage = "Biological material record " + group.controls['seqNumber'].value + " has been deleted.";
    } else {
      this.statusMessage = "Enregistrement du matériel biologique " + group.controls['seqNumber'].value + " a été supprimé.";
    }
    document.getElementById('addMaterialBtn').focus();
    this.showErrors = false;
  }

  revertMaterial(event: any) {
    let discardMsg = "";
    const index = this.materialIndex;
    const id : string = (index + 1).toString();

    const group = this.materialsFormArr.at(index) as FormGroup;
    const materialInfo = this.updateMateriraForm;

    // Revert to the last saved state
    const lastSavedState = group.get('lastSavedState').value;

    materialInfo.patchValue(lastSavedState);
    if (this._globalService.lang() == "en") {
      discardMsg = "Biological material record " + group.controls['seqNumber'].value + " changes have been discarded.";
    } else {
      discardMsg = "Les modification du matériel biologique " + group.controls['seqNumber'].value + " ont été annulées.";
    }

    this.statusMessage = discardMsg;
    this.updateMateriraForm.markAsPristine();
    // Screen reader will announce message again after the first time Discard Changes button has been clicked
    setTimeout(() => {
      this.statusMessage = ''; // Temporarily clear the message
      setTimeout(() => {
          this.statusMessage = discardMsg; // Restore the message
      }, 50); // Small delay before restoring
    }, 50);
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
              lastSavedState: material
            });

            this._patchMaterialInfoValue(group.get('lastSavedState'), material);
            this._patchMaterialInfoValue(group.controls['materialInfo'], material);

            this.materialsFormArr.push(group);

            this._expandNextInvalidRecord();
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
    this.materialListService.updateUIDisplayValues(this.materialsFormArr);
  }

  // todo add contact type
  private _patchMaterialInfoValue(form, material): void {
    form.patchValue({
      materialName: material.material_name,
      deviceName: material.device_name,
      originCountry: material.origin_country? material.origin_country._id : '',
      specFamily: material.family_of_species? material.family_of_species._id : '',
      tissueType: material.tissue_substance_type? material.tissue_substance_type._id : '',
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

  private _emitErrors(forceEmit: boolean = false): void {
    let emitErrors = [];

    if (!forceEmit && !this._shouldEmitErrors()) {
      console.log('No open records and at least one record exists – skipping emitErrors');
      return;
  }

    if (this.materialsFormArr.errors) {
      emitErrors.push(this.materialsFormArr.errors['atLeastOneMat']);
    } else {
      if (this.errorSummaryChild) {
        emitErrors.push(this.errorSummaryChild);
      }
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

  openPopup() {
    const popupSelector = "#" + this.popupId;
    jQuery(popupSelector).trigger("open.wb-overlay");

    // Wait for overlay to render to focus on Close button once it is shown on the UI
    setTimeout(() => {
      const btn = document.querySelector(`${popupSelector} button.overlay-close`) as HTMLButtonElement;
      if (btn) {
        btn.focus();
      }
    }, 100);
  }

  openConfirmationPopup(popupId: string) {
    const popupSelector = "#" + popupId;
    jQuery(popupSelector).trigger("open.wb-overlay");

    console.log(popupSelector)
    // Wait for overlay to render to focus on Close button once it is shown on the UI
    setTimeout(() => {
      const btn = document.querySelector(`${popupSelector} button.overlay-close`) as HTMLButtonElement;
      if (btn) {
        btn.focus();
      }
    }, 100);
  }

  handleClosedPopup() {
    setTimeout(() => {
      this.popupTrigger.focus();
    })
  }

  private _clearErrorList(): void {
    const controls = this.materialsFormArr.controls;
  
    // Determine if there is at least one saved record
    const hasAtLeastOneRecord = controls.some(
      (group: FormGroup) => !group.get('isNew')?.value
    );
  
    // Determine if any record is invalid
    const hasInvalidRecords = controls.some((group: AbstractControl) => group.invalid);
  
    // Filter errors in a single pass
    const currentErrors = this._materialService.materialListErrors?.() || [];
    const filteredErrors = currentErrors.filter(err => {
      // Remove "least one record" error if at least one record exists
      if (hasAtLeastOneRecord && err?.tableId.startsWith('materialListTable') && err?.type === 'least_one_rec_error') {
        return false;
      }
  
      // Remove all "component_error" errors if no invalid records exist
      if (!hasInvalidRecords && err.componentId?.startsWith('materialListTable') && err?.type === 'component_error') {
        return false;
      }
  
      return true; // Keep all other errors
    });
  
    // Update the error signal and local summary
    this._materialService.setListErrors(filteredErrors);
    if (!hasInvalidRecords) {
      this.errorSummaryChild = null;
      this.showErrors = false;
    }
    console.log(this._materialService.materialListErrors());
  }

  private _shouldEmitErrors(): boolean {
    const hasSavedRecords = this.materialsFormArr.controls.some(group => !group.get('isNew')?.value);
    const hasOpenRecords = this.materialsFormArr.controls.some(group => group.get('expandFlag')?.value);

    // Emit if:
    // 1. There are no saved records (must enforce "at least one record")
    // OR
    // 2. There is at least one open record
    return !hasSavedRecords || hasOpenRecords;
}
}