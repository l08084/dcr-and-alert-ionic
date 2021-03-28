import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  constructor(private appVersion: AppVersion) {}

  public initSetting(): void {
    console.log(this.appVersion.getVersionNumber());
  }
}
