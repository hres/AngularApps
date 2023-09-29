import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent implements OnInit {

  language: string;
  isInternal: boolean;
  helpIndex: { [key: string]: number };

  constructor(private router: Router, private _globalService: GlobalService) {}

  ngOnInit(): void {
    this.language = this._globalService.getCurrLanguage();
    this.isInternal = this._globalService.$isInternal;
    this.helpIndex = this._globalService.getHelpIndex();
  }

}
