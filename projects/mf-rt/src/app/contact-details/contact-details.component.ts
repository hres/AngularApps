import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpIndex, ICode, UtilsService } from '@hpfb/sdk/ui';
import { IContact } from '../models/transaction';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactDetailsService } from './contact-details.service';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ContactDetailsComponent extends BaseComponent implements OnInit{
  lang: string;
  helpIndex: HelpIndex; 
  public showFieldErrors: boolean = false;
  public contactFormLocalModel: FormGroup;
  public languageList: ICode[] = [];

  @Input() showErrors: boolean;
  @Input() contactDetailsModel: IContact;
  @Output() errorList = new EventEmitter(true);
  @Input() contactType;

  constructor(private _contactDetailsService: ContactDetailsService, private _fb: FormBuilder, private _utilsService: UtilsService,
    //private _entityBaseService: EntityBaseService,  
    private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
    this.showErrors = false;
    this.languageList = this._globalService.languageList;

    if (!this.contactFormLocalModel) {
      this.contactFormLocalModel = this._contactDetailsService.getReactiveModel(this._fb);
    }

  }
    
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['contactDetailsModel']) {
      const dataModel = changes['contactDetailsModel'].currentValue;
      if (!this.contactFormLocalModel) {
        this.contactFormLocalModel = this._contactDetailsService.getReactiveModel(this._fb);
        this.contactFormLocalModel.markAsPristine();
      }
      this._contactDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.contactFormLocalModel));
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }
}
