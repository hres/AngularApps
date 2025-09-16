import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpIndex, ICode, UtilsService } from '@hpfb/sdk/ui';
import { IContact } from '../../model/entity-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactDetailsService } from './contact.details.service';

@Component({
    selector: 'pbv-contact-details',
    templateUrl: './contact.details.component.html',
    //styleUrl: './contact-details.component.css',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ContactDetailsComponent extends BaseComponent implements OnInit{
  public showFieldErrors: boolean = false;
  public contactDetailsForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() contactDetailsModel: IContact;
  @Input() lang;
  @Input() languageList;
  @Input() contactType;
  @Input() contactGroupLabelKey;
  @Output() errorList = new EventEmitter(true);

  @Input() formGroup?: FormGroup;
  @Input() recordId?: number | null = null;
  @Input() resetFormGroup? : number | null = null;
  @Input() autocomplete = false;


  constructor(private _contactDetailsService: ContactDetailsService, private _fb: FormBuilder, private _utilsService: UtilsService) {
    super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.contactDetailsForm) {
      this.contactDetailsForm = this._contactDetailsService.getReactiveModel(this._fb);
    }

  }
    
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
    if (changes['formGroup']) {
      this.contactDetailsForm = this.formGroup;
    }
    if (!isFirstChange) {
      if (changes['contactDetailsModel']) {
        const dataModel = changes['contactDetailsModel'].currentValue as IContact;
        if (dataModel) {
          this._contactDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.contactDetailsForm));
        }       
      }

      if (changes['resetFormGroup']) {
        if (this.resetFormGroup > 0) {
          this._resetFormGroup();
        }
      }
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.contactDetailsForm.value;
  }

  private _resetFormGroup() : void {
    this.contactDetailsForm.reset();
  }

}