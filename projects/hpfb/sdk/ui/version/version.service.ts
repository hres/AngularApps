import { Injectable } from '@angular/core';

@Injectable()
export class VersionService {
  public getApplicationVersion(appEnvironment) {
    return appEnvironment.appVersion;
  }

  /**
   * get the major version number in the application version
   * @param appVersion format is 1.0.0
   * @returns string, major version of the application
   */
  getApplicationMajorVersion(appVersion: string): string {
    const majorVersion = appVersion.split('.', 2).join('.');
    return majorVersion;
  }

    /**
   * get the major version number in the application version using underscore as delimiter
   * @param appVersion format is 1.0.0
   * @returns string, major version of the application
   */
    getApplicationMajorVersionWithUnderscore(appVersion: string): string {
      const majorVersion = appVersion.split('.', 2).join('_');
      return majorVersion;
    }
}
