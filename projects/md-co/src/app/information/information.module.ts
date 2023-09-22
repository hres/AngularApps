import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
//import { SecurityDisclaimerComponent } from './security-disclaimer/security-disclaimer.component';
//import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    InstructionComponent,
    //PrivacyStatementComponent,
    //SecurityDisclaimerComponent,
  ],
  imports: [CommonModule, TranslateModule],
  exports: [
    InstructionComponent,
    //PrivacyStatementComponent,
    //SecurityDisclaimerComponent,
  ],
})
export class InformationModule {}
