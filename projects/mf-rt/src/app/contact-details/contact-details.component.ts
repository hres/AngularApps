import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpIndex, UtilsService } from '@hpfb/sdk/ui';
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

  @Input() showErrors: boolean;
  @Input() dataModel: IContact;
  @Output() errorList = new EventEmitter(true);
  @Input() contactType;

  constructor(private _contactDetailsService: ContactDetailsService, private _fb: FormBuilder, private _utilsService: UtilsService,
    //private _entityBaseService: EntityBaseService,  
    private _globalService: GlobalService) {
      super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.contactFormLocalModel) {
      this.contactFormLocalModel = this._contactDetailsService.getReactiveModel(this._fb);
    }

  }
  
  ngOnInit(): void {
    this.helpIndex = this._globalService.helpIndex;
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }
}
