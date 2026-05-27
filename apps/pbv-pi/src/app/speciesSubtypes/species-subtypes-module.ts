import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective, PopupComponent, ConfirmationPopupComponent } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SpeciesSubtypesListComponent } from './species-subtypes-list-component/species-subtypes-list-component';
import { SpeciesSubtypesDetailComponent } from './species-subtypes-detail-component/species-subtypes-detail-component';
import { SpeciesSubtypesRecordComonent } from './species-subtypes-record-comonent/species-subtypes-record-comonent';
import { SpeciesSubtypesDetailsService } from './species-subtypes-detail-component/species-subtypes-detail-service';
import { SpeciesSubtypesListService } from './species-subtypes-list-component/species-subtypes-list-service';
import { SpeciesSubtypesRecordService } from './species-subtypes-record-comonent/species-subtypes-record-service';
import { SpecySubtypeBaseService } from './specis-subtypes-base.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    NumbersOnlyDirective,
    PopupComponent,
    ConfirmationPopupComponent,

  ],
  declarations: [

    SpeciesSubtypesDetailComponent,
    SpeciesSubtypesRecordComonent,
    SpeciesSubtypesListComponent,

  ],
  exports: [
    SpeciesSubtypesListComponent,
    SpeciesSubtypesDetailComponent,
    SpeciesSubtypesRecordComonent,
  ],
  providers: [
    SpeciesSubtypesDetailsService,
    SpeciesSubtypesListService,
    SpeciesSubtypesRecordService,
    SpecySubtypeBaseService


  ],
})
export class SpeciesSubtypesModule { }
