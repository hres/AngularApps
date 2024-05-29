import {Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { ROOT_TAG } from '../app.constants';
import { RegulatoryInformationComponent } from "../regulatory-information/regulatory-information.component";

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent, RegulatoryInformationComponent]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
processFile($event: any) {
throw new Error('Method not implemented.');
}
  public errors;
  @Input() isInternal;
  @Input() lang;
  @Input() helpTextSequences;

  public helpIndex: { [key: string]: number }; // todo CompanyBaseService.getHelpTextIndex();
  public masterFileForm: FormGroup;
  public rootTagText = ROOT_TAG; 
  public showErrors: boolean;
  public errorList = [];
  public headingLevel = 'h2';

 
  constructor(private _globalService: GlobalService,
    private fb: FormBuilder
  ) {

  }
  
  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }
  ngOnInit(): void {
    try {

      this.helpIndex = this._globalService.getHelpIndex();
      this.masterFileForm = this.fb.group({}); 

    } catch (e) {
      console.error(e);
    }
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }
}