import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaterialService } from '../material.service';
import { ControlMessagesComponent, ICode, NO, UtilsService, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { BiologicalMaterialData } from '../../models/Enrollment';
import { MaterialListComponent } from '../material-list/material-list.component';
import { ApplicationInfoBaseService } from '../../form-base/application-info-base.service';

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

  public yesNoList: ICode[] = [];

  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];
  public materialListErrors = [];

  constructor(private _fb: FormBuilder,
              private _utilsService: UtilsService,
              private _materialService : MaterialService,
              private _globalService: GlobalService,
              private _applicationInfoBaseService : ApplicationInfoBaseService) {
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
    // console.log("updating error list in info...");
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          // console.log(error);
          temp.push(error);
        }
      );
    }
    this.errorList = temp;
    // console.log("updated error list in material info", this.errorList);

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
    
    if (materialData) {
      this.materialInfoForm.patchValue({
        hasRecombinant: materialData.has_recombinant? materialData.has_recombinant : '',
        isAnimalHumanSourced: materialData.is_animal_human_sourced? materialData.is_animal_human_sourced : '',
        isListedIddTable: materialData.is_listed_idd_table ? materialData.is_listed_idd_table : ''
      })

      if (materialData.biological_materials) {
        this.materialListModel = materialData.biological_materials;
      } else {
        this.materialListModel = this._applicationInfoBaseService.getEmptyMaterialListModel();
      }
    } else {
      this.materialListModel = this._applicationInfoBaseService.getEmptyMaterialListModel();
    }
  }

  animalHumanSourcedOnChange() {
    if (!this.materialInfoForm.controls['isAnimalHumanSourced'].value ||
    this.materialInfoForm.controls['isAnimalHumanSourced'].value === NO) {
      this.materialListModel.material = [];
      this.materialListErrors = [];
      this._materialService.showSummary.set(false);
      this._emitErrors();
    } else {
      if (this.materialListModel) {
        if (!this.materialListModel.material) {
          this.materialListModel.material = [];
        }
      }
    }
  }

  isAnimalHumanSourced() {
    if (this.materialInfoForm.controls['isAnimalHumanSourced'].value &&
          this.materialInfoForm.controls['isAnimalHumanSourced'].value === YES) {  
      return true;
    } else {
      this._utilsService.resetControlsValues(this.materialInfoForm.controls['isListedIddTable']);
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

    this._materialService.materialErrors.update( errors => emitErrors );
  }

}
