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
// import { GlobalsService } from './globals/globals.service';
import { VersionService } from '@hpfb/sdk/ui/';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  @Input() isInternal: boolean;
  public language :string = "en"; //GlobalsService.ENGLISH;
  appVersion: string;
  helpIndex: any;
  
  constructor(
    private translate: TranslateService,
    private _versionService: VersionService,
    public titleService: Title
  ) {

    translate.setDefaultLang(this.language);

    this.language = environment.lang;
    translate.use(this.language);

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
