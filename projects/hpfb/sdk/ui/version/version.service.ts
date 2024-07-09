import { Injectable } from '@angular/core';

@Injectable()
export class VersionService {
  public getApplicationVersion(appEnvironment) {
    return appEnvironment.appVersion;
  }

  /**
   * get the major and minor version of the application concatenated with '.'
   * @param appVersion format is 1.0.0
   * @returns string
   */
  getApplicationMajorVersion(appVersion: string): string {
    const majorVersion = appVersion.split('.', 2).join('.');
    return majorVersion;
  }

   /**
   * get the major and minor version of the application concatenated with '_'
   * @param appVersion format is 1.0.0
   * @returns string
   */
  getApplicationMajorVersionWithUnderscore(appVersion: string): string {
    const majorVersion = appVersion.split('.', 2).join('_');
    return majorVersion;
  }

/**
 * Extracts the major version number from a version string.
 *
 * @param versionStr - The version string in the format "major.minor.patch", e.g., "1.0.0".
 * @returns The major version number as an integer.
 */
  getMajorVersion(versionStr: string): number {
    return parseInt(versionStr.split('.')[0], 10);
  }
}
