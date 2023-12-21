import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { ENGLISH } from '@hpfb/sdk/ui';
import { GlobalService } from './global/global.service';
import { VersionService } from '@hpfb/sdk/ui/'; 
import { helpInstructionHeadings } from './app.constants';
import { AppFormModule } from './app.form.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, AppFormModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  isInternal: boolean = false;
  language :string = ENGLISH;
  appVersion: string = '0.0.0';
  
  constructor(
    private translate: TranslateService,
    private _versionService: VersionService,
    public titleService: Title, private _globalService: GlobalService
  ) {

    translate.setDefaultLang(this.language);

    this.language = environment.lang;
    translate.use(this.language)
    this._globalService.setCurrLanguage(this.language);
    this._globalService.setHelpIndex(helpInstructionHeadings);
    this._globalService.$appVersion = this._versionService.getApplicationVersion(environment);
    this._globalService.$isInternal = environment.internal;
    this._globalService.$devEnv = !environment.production;

    this.translate.get('form.title').subscribe((res) => {
      this.setTitle(res);
    });
    this.appVersion = this._globalService.$appVersion;
    this.isInternal = this._globalService.$isInternal;    
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
