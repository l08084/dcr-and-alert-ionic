import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  private readonly appVersion = '1.0.0';

  constructor() {}

  public initSetting(): void {
    console.log(this.appVersion);
  }
}
