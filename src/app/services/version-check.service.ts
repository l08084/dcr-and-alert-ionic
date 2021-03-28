import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  private readonly appVersion = '1.0.0';

  constructor(private db: AngularFireDatabase) {}

  public initSetting(): void {
    console.log(this.appVersion);
  }
}
