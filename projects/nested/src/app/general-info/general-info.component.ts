import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, PipesModule } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../global/global.service';
import { GeneralInfoService } from './general-info.service';


@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorModule, PipesModule],
  providers: [GeneralInfoService],
  templateUrl: './general-info.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GeneralInfoComponent {

  generalInfoForm: FormGroup;
  public showFieldErrors = false;

  generalInfoService = inject(GeneralInfoService)
  
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private _globalService: GlobalService,) {
    this.generalInfoForm = this.generalInfoService.createGeneralInfoFormGroup(this.fb);
  }

  // this.myForm.controls['companyName'].setValue(companyEnroll.company_name);

}
