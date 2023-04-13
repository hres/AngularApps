import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class VersionService {
  public getApplicationVersion() {
    return environment.appVersion;
  }
}
