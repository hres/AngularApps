import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlMessagesComponent, ICode, UtilsService } from '@hpfb/sdk/ui';

@Component({
  selector: 'app-species-subtypes-detail-component',
  templateUrl: './species-subtypes-detail-component.html',
  styleUrl: './species-subtypes-detail-component.css',
  standalone: false
})

/**
 * Species subtypes Details Component is used for product form
 */
export class SpeciesSubtypesDetailComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('group') public speciesSubtypesDetailForm: FormGroup;    // specy detail form will use the reactive model passed in from the specy record component
  @Input() recordId: string;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;

  @Input() lang;
  @Input() helpTextSequences;
  @Input() translatedParentLabel: string;
  @Input() disableForm: boolean;
  @Input() vetSpecies;
  @Input() specySubTypes;
  @Input() yesNoList;

  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public showFieldErrors: boolean = false;
  public disableEdit: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private _utilsService: UtilsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(errorObjs);
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
    this.errorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
        });
      }
      this.errorList.emit(temp);
    }

    if (this.disableForm) {
      this.disableFormGroup();
    } else {
      this.enableFormGroup();
    }
  }
  disableFormGroup() {
    if (this.speciesSubtypesDetailForm) {
      this.speciesSubtypesDetailForm.disable();
    }
  }

  enableFormGroup() {
    if (this.speciesSubtypesDetailForm) {
      this.speciesSubtypesDetailForm.enable();
    }
  }

  IsEnterWithdrawTime() {
    if (this.speciesSubtypesDetailForm.controls['isUsedForTreatmentOfFoodProducingAnimals'].value=='Y' ){
    return true;
    }else{
      return false;
    }
  }

}


