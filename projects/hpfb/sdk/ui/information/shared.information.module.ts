import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { SecurityDisclaimerComponent } from './security-disclaimer/security-disclaimer.component';

@NgModule({
  declarations: [PrivacyStatementComponent, SecurityDisclaimerComponent],
  imports: [CommonModule, TranslateModule],
  providers:[],
  exports: [PrivacyStatementComponent, SecurityDisclaimerComponent],
})
export class SharedInformationModule {}
