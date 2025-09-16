import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpSequence, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { MedicinalIngredientsService } from './medicinal-ingredients.service';
import { IMedicalInformation, Transaction, TransactionEnrol } from '../models/transaction';

@Component({
  selector: 'app-medicinal-ingredients',
  templateUrl: './medicinal-ingredients.component.html',
  styleUrl: './medicinal-ingredients.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class MedicinalIngredientsComponent  extends BaseComponent implements OnInit, OnChanges {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.



  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  medicinalIngredientForm: FormGroup;

  @Input() productName ;
  @Input() medicinalIngredient ;
  @Input() transactionEnrollModel;


  constructor(private medicinalIngredientService: MedicinalIngredientsService, private _fb: FormBuilder, private _globalService: GlobalService,
    private _utilsService: UtilsService) {
   super();
   this.showFieldErrors = false;
 }


 ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.medicinalIngredientForm) {
      this.medicinalIngredientForm = this.medicinalIngredientService.getMedicinalIngredientsForm(this._fb);
    }

  }


  getFormValue(){
    return this.medicinalIngredientForm.value;
  }

  protected override emitErrors(errors: any[]){
    this.errorList.emit(errors);

  }

  ngOnChanges(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
    if (!isFirstChange) {
      if (changes['transactionEnrollModel'] )  {
        const transactionEnrollModel = changes['transactionEnrollModel'].currentValue as TransactionEnrol

        this.medicinalIngredientService.mapDataModelToFormModel(transactionEnrollModel.application_info.medicinal_ingredient, transactionEnrollModel.application_info.product_name, (<FormGroup>this.medicinalIngredientForm))
      }
    }
  }
}
