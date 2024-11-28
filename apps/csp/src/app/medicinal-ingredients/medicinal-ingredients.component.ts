import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { MedicinalIngredientsService } from './medicinal-ingredients.service';

@Component({
  selector: 'app-medicinal-ingredients',
  templateUrl: './medicinal-ingredients.component.html',
  styleUrl: './medicinal-ingredients.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class MedicinalIngredientsComponent  extends BaseComponent implements OnInit {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpIndex;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  medicinalIngredientForm: FormGroup;

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

  ngOnChange(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
  }
}
