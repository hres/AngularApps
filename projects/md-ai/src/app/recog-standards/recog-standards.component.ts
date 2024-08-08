import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ExpanderModule, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../global/global.service';
import { first } from 'rxjs';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';


@Component({
  selector: 'app-recog-standards',
  templateUrl: './recog-standards.component.html',
  styleUrl: './recog-standards.component.css'
})
export class RecogStandardsComponent {
  

}
