import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from './instruction/instruction.component';
import { SharedInformationModule } from '@hpfb/sdk/ui';

@NgModule({
  declarations: [InstructionComponent],
  imports: [CommonModule, TranslateModule, SharedInformationModule],
  exports:[InstructionComponent, SharedInformationModule]
})
export class InformationModule {}
