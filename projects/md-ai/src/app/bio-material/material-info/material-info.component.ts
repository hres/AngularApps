import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { BiologicalMaterialData } from '../../models/Enrollment';
import { MaterialService } from '../material.service';
import { ControlMessagesComponent, ICode, NO, UtilsService, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { BiologicalMaterial, BiologicalMaterialData } from '../../models/Enrollment';
import { MaterialListComponent } from '../material-list/material-list.component';

@Component({
  selector: 'app-material-info',
  templateUrl: './material-info.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MaterialInfoComponent implements OnInit, OnChanges, AfterViewInit{
  
  public materialInfoForm : FormGroup;
  @Input() public materialInfo;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChild(MaterialListComponent) aiMaterials: MaterialListComponent;
  
  lang = this._globalService.lang();

  materialService = inject(MaterialService)
  public materialListModel;
  public materialListModel2;

  public yesNoList: ICode[] = [];

  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];
  public materialListErrors = [];

  constructor(private _fb: FormBuilder,
              private _utilsService: UtilsService,
              private _materialService : MaterialService,
              private _globalService: GlobalService) {
    if (!this.materialInfoForm) {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
    }            
    effect(() => {
      this.showErrors = this._globalService.showErrors();
      if (this._globalService.showErrors()) {
        this._updateErrorList(this.msgList);
      }
    });
  }

  async ngOnInit() {
    this.yesNoList = this._globalService.$yesNoList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materialInfo']) {
      this._init(changes['materialInfo'].currentValue);
    }
  }
  
  ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(this.msgList);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    console.log("updating error list in info...");
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          console.log(error);
          temp.push(error);
        }
      );
    }
    this.errorList = temp;
    console.log("updated error list in material info", this.errorList);

    this._emitErrors();
  }

  updateMaterialListErrors(errors) {
    this.materialListErrors = errors;
    this._emitErrors();
  }

  private _init(materialData : BiologicalMaterialData) {
    if (!this.materialInfoForm) {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
      this.materialInfoForm.markAsPristine();
    } else {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
    }

    this.materialInfoForm.patchValue({
      hasRecombinant: materialData.has_recombinant,
      isAnimalHumanSourced: materialData.is_animal_human_sourced,
      isListedIddTable: materialData.is_listed_idd_table
    })
    
    this.materialListModel = materialData.biological_materials;

  }

  animalHumanSourcedOnChange() {
    if (!this.materialInfoForm.controls['isAnimalHumanSourced'].value ||
    this.materialInfoForm.controls['isAnimalHumanSourced'].value === NO) {
      this.materialListModel = [];
      this.materialListErrors = [];
      this._emitErrors();
    } else {
    }
  }

  isAnimalHumanSourced() {
    if (this.materialInfoForm.controls['isAnimalHumanSourced'].value &&
          this.materialInfoForm.controls['isAnimalHumanSourced'].value === YES) {
        // this.bioMaterials. = ;
        return true;
    } else {
      this._utilsService.resetControlsValues(this.materialInfoForm.controls['isListedIddTable']);
        // this.appInfoFormLocalModel.controls.isListedIddTable.setValue(null);
        // this.appInfoFormLocalModel.controls.isListedIddTable.markAsUntouched();
        //this.materialListModel = [];
    }
    return false;
  }

  private _emitErrors(): void {
    let emitErrors = [];

    // Error List is a QueryList type
    if (this.errorList) {
      this.errorList.forEach(err => {
        emitErrors.push(err);
      })
    }

    if (this.materialListErrors) {
      this.materialListErrors.forEach( err => {
        emitErrors.push(err);
      })
    }

    console.log("emitting errors in material info", this.errorList);
   
    this._materialService.errors.update( errors => emitErrors );
  }

}
