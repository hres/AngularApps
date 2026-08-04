import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { ENGLISH, InstructionService, VersionService } from '@hpfb/sdk/ui';
import { GlobalService } from './global/global.service';
import { HELP_FOOTNOTE_PREFIX, HELP_FOOTNOTE_SUFFIX, HELP_TEXT_SEQUENCE } from './app.constants';
import { ContainerComponent } from './container/container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, ContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  language :string = ENGLISH;
  appVersion: string = '0.0.0';

  constructor(
    private translate: TranslateService,
    private _versionService: VersionService,
    public titleService: Title, private _globalService: GlobalService, private _instructionService: InstructionService
  ) {

    translate.setDefaultLang(this.language);

    this.language = environment.lang;
    translate.use(this.language)
    this._globalService.currLanguage = this.language;
    this._globalService.helpIndex = this._instructionService.createHelpSequence(HELP_FOOTNOTE_PREFIX, HELP_FOOTNOTE_SUFFIX, HELP_TEXT_SEQUENCE);
    this._globalService.appVersion = this._versionService.getApplicationVersion(environment);
    this._globalService.devEnv = !environment.production;
    this._globalService.byPassChecksum = environment.byPassCheckSum;
    this._globalService.isInternal = environment.internal;

    this.translate.get('form.title').subscribe((res) => {
      this.setTitle(res);
    });
    this.appVersion = this._globalService.appVersion;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}