import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from '../app/validation.service';
import {ErrorModule} from '../app/error-msg/error-ui.module';
import {MasterFileBaseComponent} from '../app/master-file-base/master-file-base.component';
import {GlobalsService} from '../app/globals/globals.service';
import {MasterFileDetailsComponent} from '../app/master-file-details/master-file.details.component';
import {MasterFileHelpEnComponent} from '../app/master-file-help-en/master-file-help-en.component';
import {MasterFileFeeComponent} from '../app/master-file-fee/master-file.fee.component';
import {RequesterModule} from '../app/requester/requester.module';
import {AddressDetailsComponent} from '../app/address/address.details/address.details.component';
//import {ContactModule} from '../app/contact/contact.module';
import {FileIoModule} from '../app/filereader/file-io/file-io.module';
import {NumbersOnlyModule} from '../app/number-only/number-only.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from '../app/common/common-feature.module';
import {DataLoaderModule} from '../app/data-loader/data-loader.module';
import {MasterFileDataLoaderService} from '../app/data-loader/master-file-data-loader.service';
import {NgPipesModule} from './pipes/pipes.module';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    AddressDetailsComponent,
    MasterFileDetailsComponent,
    MasterFileFeeComponent,
    MasterFileBaseComponent,
    MasterFileHelpEnComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    RequesterModule,
    FileIoModule,
    HttpClientModule,
    CommonFeatureModule,
    DataLoaderModule,
    NumbersOnlyModule,
    NgPipesModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ValidationService,
    GlobalsService,
    MasterFileDataLoaderService,
    Title
  ],
  exports: [
    NumbersOnlyModule,
    NgPipesModule,
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/master-file/', '.json');
}
