import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { InformationModule } from '../information/information.module';
import { RegistrationModule } from '../registration/registration.module';
import { InstructionService } from './instruction.service';
import { SharedModule } from 'projects/master-file/src/app/shared/shared.module';

@NgModule({
  declarations: [ContainerComponent],
  imports: [CommonModule, SharedModule, InformationModule, RegistrationModule],
  providers: [InstructionService],
  exports: [ContainerComponent],
})
export class ContainerModule {}
