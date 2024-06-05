import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { RegulatoryInformationService } from './regulatory-information.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'regulatory-information',
  templateUrl: './regulatory-information.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [RegulatoryInformationService]
})
export class RegulatoryInformationComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges{

  @Input() showErrors: boolean;
  @Input() regulatoryInfoModel;
  @Output() regulatoryInfoErrorList = new EventEmitter(true);

  public regulartoryInfoFormModel: FormGroup;
  helpIndex: { [key: string]: number }; 
  public showFieldErrors = false;

  mfTypeSub!: Subscription;
  mfTypeTxDescSub!: Subscription;
  mfRevisedTypeTxDescSub!: Subscription;
  mfUseSub!: Subscription;
  txDescSub!: Subscription;

  constructor(private _fb: FormBuilder, private _regulatoryInfoService: RegulatoryInformationService,  private _globalService: GlobalService) {
    
    super();
    this.showErrors = false;
    this.showFieldErrors = false;
    if (!this.regulartoryInfoFormModel) {
      this.regulartoryInfoFormModel = this._regulatoryInfoService.getReactiveModel(this._fb);
    }
  }

  ngOnInit(): void {
    this.helpIndex = this._globalService.getHelpIndex();
  }

  ngOnDestroy(): void {
        // unsubscribe the subscription(s)
        this.mfTypeSub.unsubscribe();
        this.mfTypeTxDescSub.unsubscribe();
        this.mfRevisedTypeTxDescSub.unsubscribe();
        this.mfUseSub.unsubscribe();
        this.txDescSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['regulatoryFormModel']) {
      const dataModel = changes['regulatoryInfoFormModel'].currentValue;
      if (!this.regulartoryInfoFormModel) {
        this.regulartoryInfoFormModel = this._regulatoryInfoService.getReactiveModel(this._fb);
        this.regulartoryInfoFormModel.markAsPristine();
      }
      this._regulatoryInfoService.mapDataModelToRegulatoryForm(dataModel, (<FormGroup>this.regulartoryInfoFormModel));
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.regulatoryInfoErrorList.emit(errors);
  }
}
