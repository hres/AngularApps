import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, ICode, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { RegulatoryContactService } from './regulatory-contact.service';
import { IContactInformation } from '../models/transaction';

@Component({
  selector: 'app-regulatory-contact',
  templateUrl: './regulatory-contact.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryContactComponent extends BaseComponent implements OnInit{
  lang:string;
  
  public regulatoryContactForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: IContactInformation;
  @Output() errorList = new EventEmitter(true);

  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;

  showThirdPartyNote : boolean = false;

  constructor(private _regulatoryContactService: RegulatoryContactService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    if (!this.regulatoryContactForm) {
      this.regulatoryContactForm = RegulatoryContactService.getContactForm(this._fb);
    }
    this.yesNoList = this._globalService.yesnoList;
  }

  protected override emitErrors(errors: any[]): void {
    // this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // console.log("RegulatoryInformationComponent ~ ngOnChanges ~ isFirstChange:", isFirstChange);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as IContactInformation;
        this._regulatoryContactService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulatoryContactForm);

        // this.onMfTypeSelected(null);
        // this.onTxDescriptionSelected(null);
        // this.reqRevisionChanged(null);
      }
    }
  }

  isSigned3rdPartyChanged() {

  }

  showCompanyNameField() {

  }

  getFormValue() {
    return this.regulatoryContactForm.value;
  }

}
