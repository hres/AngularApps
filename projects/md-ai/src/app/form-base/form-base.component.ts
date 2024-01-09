import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG } from '../app.constants';
import {  ICode, IKeyword, ConvertResults, FileConversionService, INameAddress, CheckSumService, LoggerService, UtilsService, CHECK_SUM_CONST, ContactListComponent, Contact, ContactStatus, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, AddressModule, ContactModule } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AddressModule, ContactModule, AppFormModule],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() lang;
  @Input() helpTextSequences;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {}
}