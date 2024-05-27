import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type, ElementRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {  ICode, IKeyword, ConvertResults, FileConversionService, CheckSumService, LoggerService, UtilsService, CHECK_SUM_CONST, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { PopupComponent } from '@hpfb/sdk/ui/popup/popup.component';
import $ from 'jquery';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: []
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @Input() helpTextSequences;

  public helpIndex: { [key: string]: number }; // todo CompanyBaseService.getHelpTextIndex();

 
  constructor(private _globalService: GlobalService
  ) {

  }
  
  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }
  ngOnInit(): void {
    try {

      this.helpIndex = this._globalService.getHelpIndex();

    } catch (e) {
      console.error(e);
    }
  }

}