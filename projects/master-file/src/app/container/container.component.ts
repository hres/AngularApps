import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from '../instruction/instruction.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, TranslateModule, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent, InstructionComponent, FormBaseComponent],
  templateUrl: './container.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ContainerComponent implements OnInit {

  language: string;
  isInternal: boolean;
  helpIndex: { [key: string]: number };
  devEnv: boolean = false;

  constructor(private _globalService: GlobalService) {}

  ngOnInit(): void {
    this.language = this._globalService.getCurrLanguage();
    this.isInternal = this._globalService.$isInternal;
    this.helpIndex = this._globalService.getHelpIndex();
    this.devEnv = this._globalService.$devEnv;
  }
  
}