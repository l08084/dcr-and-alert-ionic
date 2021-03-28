import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Maintenance } from '../model/maintenance.model';
import { Version } from '../model/version.model';
import * as semver from 'semver';
@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  private readonly appVersion = '1.0.0';
  private maintenance$: Observable<Maintenance>;
  private version$: Observable<Version>;

  constructor(private db: AngularFireDatabase) {}

  public initSetting(): void {
    this.maintenance$ = this.db
      .object<Maintenance>('maintenance')
      .valueChanges();
    this.version$ = this.db.object<Version>('version').valueChanges();

    this.maintenance$.subscribe((maintenance: Maintenance) =>
      this.checkMaintenance(maintenance)
    );
    this.version$.subscribe((version: Version) =>
      this.checkVersion(this.appVersion, version)
    );
  }

  private checkMaintenance(maintenance: Maintenance) {
    if (!maintenance) {
      return;
    }
  }

  private checkVersion(appVersion: string, version: Version) {
    if (!this.isRequired(appVersion, version)) {
      return;
    }
  }

  private isRequired(appVersion: string, version: Version) {
    if (
      !version ||
      !version.minimumVersion ||
      semver.gte(appVersion, version.minimumVersion)
    ) {
      return false;
    }
    return true;
  }
}
