import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EntityBaseService, ErrorModule, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MasterFileFeeService } from './master-file.fee.service';
import { GlobalService } from '../global/global.service';
import { FeeDetails } from '../models/transaction';

@Component({
  selector: 'master-file-fee',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, ErrorModule, PipesModule],
  providers: [MasterFileFeeService],
  templateUrl: './master-file-fee.component.html',
  styleUrl: './master-file-fee.component.css'
})
export class MasterFileFeeComponent implements OnInit{
  lang: string;
  helpIndex: { [key: string]: number }; 
  public showFieldErrors: boolean = false;

  public mfFeeFormLocalModel: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: FeeDetails;
  @Output() errorList = new EventEmitter(true);

  constructor(private _masterFileFeeService: MasterFileFeeService, private _fb: FormBuilder, 
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService) {
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    
    if (!this.mfFeeFormLocalModel) {
      this.mfFeeFormLocalModel = this._masterFileFeeService.getReactiveModel(this._fb);
    }
  }
}
