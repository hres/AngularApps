import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-container',
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
