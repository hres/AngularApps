import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpTextModuleModule } from "./instruction/help-text-module.module";
import { AppSignalService } from './signal/app-signal.service';
import { ProductInformationService } from './product-information/product-information.service';
import { ProductInformationComponent } from './product-information/product-information.component';
import { SpeciesSubtypesModule } from './speciesSubtypes/species-subtypes-module';
import { SpeciesSubtypesDetailComponent } from './speciesSubtypes/species-subtypes-detail-component/species-subtypes-detail-component';
import { SpeciesSubtypesRecordComonent } from './speciesSubtypes/species-subtypes-record-comonent/species-subtypes-record-comonent';
import { SpeciesSubtypesListComponent } from './speciesSubtypes/species-subtypes-list-component/species-subtypes-list-component';
import { SpeciesSubtypesDetailsService } from './speciesSubtypes/species-subtypes-detail-component/species-subtypes-detail-service';
import { SpeciesSubtypesListService } from './speciesSubtypes/species-subtypes-list-component/species-subtypes-list-service';
import { SpecySubtypeBaseService } from './speciesSubtypes/specis-subtypes-base.service';
import { SpeciesSubtypesRecordService } from './speciesSubtypes/species-subtypes-record-comonent/species-subtypes-record-service';


@NgModule({
  declarations: [
    ProductInformationComponent,
      // SpeciesSubtypesDetailComponent,
      //   SpeciesSubtypesRecordComonent,
      //   SpeciesSubtypesListComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CommonUiFeatureModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NumbersOnlyDirective,
    HelpTextModuleModule,
    SpeciesSubtypesModule,
 ],
  providers: [
    AppSignalService,
    ProductInformationComponent,
    ProductInformationService,
     SpeciesSubtypesDetailsService,
        SpeciesSubtypesListService,
        SpeciesSubtypesRecordService,
        SpecySubtypeBaseService
  ],
  exports: [CommonUiFeatureModule,
    ProductInformationComponent,
    SpeciesSubtypesDetailComponent,
        SpeciesSubtypesRecordComonent,
        SpeciesSubtypesListComponent
   ],
   bootstrap:[ProductInformationComponent]
})
export class AppFormModule {}