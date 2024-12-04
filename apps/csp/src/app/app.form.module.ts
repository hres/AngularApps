import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CertSuppProtectComponent } from './cert-supp-protect/cert-supp-protect.component';
import { CertSuppProtectService } from './cert-supp-protect/cert-supp-protect.service';
import {PatentComponent } from './patent/patent.component';
import { PatentService } from './patent/patent-service.service';
import { DrugUseComponent } from './drug-use/drug-use.component';
import { DrugUseService } from './drug-use/drug-use.service';
import { NoticeOfComplianceService } from './notice-of-compliance/notice-of-compliance.service';
import { NoticeOfComplianceComponent } from './notice-of-compliance/notice-of-compliance.component';
import { NewDrugSubmissionInformationComponent } from './new-drug-submission-information/new-drug-submission-information.component';
import { NewDrugSubmissionInformationService } from './new-drug-submission-information/new-drug-submission-information.service';
import {MedicinalIngredientsComponent} from './medicinal-ingredients/medicinal-ingredients.component';
import { MedicinalIngredientsService } from './medicinal-ingredients/medicinal-ingredients.service';
import { TimeOfApplicationComponent } from './time-of-application/time-of-application.component';
import { TimingOfApplicationService } from './time-of-application/time-of-application.service';


@NgModule({
  declarations: [
    CertSuppProtectComponent, PatentComponent, DrugUseComponent, NoticeOfComplianceComponent, NewDrugSubmissionInformationComponent, MedicinalIngredientsComponent
  ,TimeOfApplicationComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CommonUiFeatureModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    ReactiveFormsModule,
    TranslateModule,
    NumbersOnlyDirective
  ],
  providers: [
    CertSuppProtectService, DatePipe, PatentService, DrugUseService, NoticeOfComplianceService, NewDrugSubmissionInformationService,
    MedicinalIngredientsService, TimingOfApplicationService ],
  exports: [CommonUiFeatureModule,
    CertSuppProtectComponent, PatentComponent, DrugUseComponent, NoticeOfComplianceComponent, NewDrugSubmissionInformationComponent, MedicinalIngredientsComponent, TimeOfApplicationComponent]
})
export class AppFormModule {}
