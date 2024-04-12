import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { BiologicalMaterialData } from '../../models/Enrollment';
import { MaterialService } from '../material.service';
import { ControlMessagesComponent, ICode, NO, UtilsService, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { BiologicalMaterialData } from '../../models/Enrollment';

@Component({
  selector: 'app-material-info',
  templateUrl: './material-info.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MaterialInfoComponent implements OnInit, OnChanges, AfterViewInit{
  @Input() public materialData;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  lang = this._globalService.lang();

  materialService = inject(MaterialService)

  public materialInfoForm : FormGroup;

  public materialListModel;

  public yesNoList: ICode[] = [];

  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];

  constructor(private _fb: FormBuilder,
              private _utilsService: UtilsService,
              private _materialService : MaterialService,
              private _globalService: GlobalService) {
    if (!this.materialInfoForm) {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
    }            
    effect(() => {
      this.showErrors = this._globalService.showErrors()
      if (this._globalService.showErrors()) {
        this._updateErrorList(this.msgList);
      }
    });
  }

  async ngOnInit() {
    this.yesNoList = this._globalService.$yesNoList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materialData']) {
      this._init(changes['materialData'].currentValue);
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
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList = temp;

    this._emitErrors();
  }

  private _init(materialData : BiologicalMaterialData) {
    const materialModel = materialData;
    if (!this.materialInfoForm) {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
      this.materialInfoForm.markAsPristine();

      this.materialInfoForm.patchValue({
        hasRecombinant: materialData.has_recombinant,
        isAnimalHumanSourced: materialData.is_animal_human_sourced,
        isListedIddTable: materialData.is_listed_idd_table
      })

      this.materialListModel = materialData.biological_materials;
    } else {
      this.materialInfoForm = this.materialService.createMaterialInfoFormGroup(this._fb);
    }
  }

  animalHumanSourcedOnChange() {
    if (!this.materialInfoForm.controls['isAnimalHumanSourced'].value ||
    this.materialInfoForm.controls['isAnimalHumanSourced'].value === NO) {
      this.materialListModel = [];
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
   
    this._materialService.errors.update( errors => emitErrors );
  }

}
