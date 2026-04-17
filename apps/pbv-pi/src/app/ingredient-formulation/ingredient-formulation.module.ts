import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective, RecordDeleteService, RecordDiscardService } from '@hpfb/sdk/ui';
import { PopupComponent, ConfirmationPopupComponent } from '@hpfb/sdk/ui';
import { AddressModule } from '@hpfb/pbv';
import { IngredientFormulationItemComponent } from './ingredient-formulation-item/ingredient-formulation-item.component';
import { IngredientFormulationListComponent } from './ingredient-formulation-list/ingredient-formulation-list.component';
import { IngredientFormulationService } from './ingredient-formulation.service';
import { IngredientFormulationListService } from './ingredient-formulation-list/ingredient-formulation-list.service';

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
    AddressModule
  ],
  declarations: [
    IngredientFormulationItemComponent,
    IngredientFormulationListComponent
  ],
  exports: [
    IngredientFormulationItemComponent,
    IngredientFormulationListComponent
  ],
  providers: [
  IngredientFormulationService,
   RecordDeleteService,
   RecordDiscardService,
   IngredientFormulationListService
  ]
})
export class IngredientFormulationModule { }
