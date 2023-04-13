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
import { GlobalsService } from './globals/globals.service';
import { VersionService } from './shared/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @Input() isInternal: boolean;
  public language = GlobalsService.ENGLISH;
  appVersion: string;
  
  constructor(
    private translate: TranslateService,
    private _versionService: VersionService,
    public titleService: Title
  ) {

    translate.setDefaultLang(this.language);

    this.language = environment.lang;
    translate.use(this.language);

    this.translate.get('master.file.form.title').subscribe((res) => {
      this.setTitle(res);
    });

    this.appVersion = this._versionService.getApplicationVersion();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
