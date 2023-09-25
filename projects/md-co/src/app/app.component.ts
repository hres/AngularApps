import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { ENGLISH } from '@hpfb/sdk/ui';
import { GlobalService } from './global/global.service';
import { VersionService } from '@hpfb/sdk/ui/'; 
import { helpInstructionHeadings } from './app.constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  // @Input() isInternal: boolean;  //todo
  public language :string = ENGLISH;
  appVersion: string;
  helpIndex: any;
  
  constructor(
    private translate: TranslateService,
    private _versionService: VersionService,
    public titleService: Title, private _globalService: GlobalService
  ) {

    translate.setDefaultLang(this.language);

    this.language = environment.lang;
    translate.use(this.language);
    this._globalService.setCurrLanguage(this.language);
    this._globalService.setHelpIndex(helpInstructionHeadings);

    this.translate.get('form.title').subscribe((res) => {
      this.setTitle(res);
    });
    //this.appVersion = '0.0.0';
    this.appVersion = this._versionService.getApplicationVersion(environment);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
