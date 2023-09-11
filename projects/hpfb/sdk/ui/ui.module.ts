import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpanderComponent } from './expander/expander.component';
import { GreeterComponent } from './file-io/greeter/greeter.component';
import { LayoutComponent } from './layout/layout.component';
import { FileIoModule } from './file-io/file-io.module';

@NgModule({
  declarations: [LayoutComponent, ExpanderComponent, GreeterComponent],
  imports: [CommonModule, FileIoModule],
  exports: [LayoutComponent, ExpanderComponent, GreeterComponent, FileIoModule],
})
export class UiModule {}
