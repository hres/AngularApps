import { Injectable } from '@angular/core';

@Injectable()
export class VersionService {
    public getApplicationVersion(appEnvironment) {
        return appEnvironment.appVersion;
    }
}
