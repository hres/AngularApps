import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective, RecordDeleteService, RecordDiscardService } from '@hpfb/sdk/ui';
import { PopupComponent, ConfirmationPopupComponent } from '@hpfb/sdk/ui';
import { AddressModule } from '@hpfb/pbv';
import { FormulationItemComponent } from '../formulation/formulation-item/formulation-item.component';
import { FormulationListComponent } from '../formulation/formulation-list/formulation-list.component';
import { FormulationService } from '../formulation/formulation.service';
import { FormulationListService } from './formulation-list/formulation-list.service';
import { FormulationItemService } from './formulation-item/formulation-item.service';
import { IngredientFormulationModule } from '../ingredient-formulation/ingredient-formulation.module';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    NumbersOnlyDirective,
    PopupComponent,
    ConfirmationPopupComponent,
    AddressModule,
    IngredientFormulationModule
  ],
  declarations: [
    FormulationItemComponent,
    FormulationListComponent
  ],
  exports: [
    FormulationItemComponent,
    FormulationListComponent
  ],
  providers: [
  FormulationService,
   RecordDeleteService,
   RecordDiscardService,
  FormulationListService,
   FormulationItemService
  ]
})
export class FormulationModule { }
