import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {  ICode, IKeyword, ConvertResults, FileConversionService, CheckSumService, LoggerService, UtilsService, CHECK_SUM_CONST, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { PopupComponent } from '@hpfb/sdk/ui/popup/popup.component';
import $ from 'jquery';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent]
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
rootTagText: string;
showAmendNote: any;

 
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

}