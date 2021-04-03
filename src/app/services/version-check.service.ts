import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { Maintenance } from '../model/maintenance.model';
import { Version } from '../model/version.model';
import * as semver from 'semver';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  private readonly appVersion = '1.0.0';

  private maintenance$: Observable<Maintenance>;
  private version$: Observable<Version>;
  private maintenanceAlert: HTMLIonAlertElement;
  private versionUpAlert: HTMLIonAlertElement;

  // add this!
  private isShowVersionUpAlert = new Subject<boolean>();

  constructor(
    private db: AngularFireDatabase,
    private alertController: AlertController
  ) {}

  /**
   * 初期設定
   *
   * @memberof VersionCheckService
   */
  public initSetting(): void {
    this.maintenance$ = this.db
      .object<Maintenance>('maintenance')
      .valueChanges();
    this.version$ = this.db.object<Version>('version').valueChanges();

    this.maintenance$.subscribe(
      async (maintenance: Maintenance) =>
        await this.checkMaintenance(maintenance)
    );
    this.version$.subscribe(
      async (version: Version) =>
        await this.checkVersion(this.appVersion, version)
    );

    // add this!
    this.isShowVersionUpAlert
      .pipe(
        filter(
          (isShowVersionUp: boolean) =>
            isShowVersionUp && !!this.maintenanceAlert
        )
      )
      .subscribe(async () => {
        await this.maintenanceAlert.dismiss();
        this.maintenanceAlert = undefined;
      });
  }

  /**
   * メンテナンスポップアップを表示する。
   *
   * @private
   * @param {Maintenance} maintenance
   * @returns {Promise<void>}
   * @memberof VersionCheckService
   */
  private async checkMaintenance(maintenance: Maintenance): Promise<void> {
    if (!maintenance) {
      return;
    }

    // add conditions '|| !!this.versionUpAlert'
    if (!maintenance.maintenanceFlg || !!this.versionUpAlert) {
      if (this.maintenanceAlert) {
        await this.maintenanceAlert.dismiss();
        this.maintenanceAlert = undefined;
      }
      return;
    }

    this.maintenanceAlert = await this.alertController.create({
      header: maintenance.title,
      message: maintenance.message,
      backdropDismiss: false,
    });
    await this.maintenanceAlert.present();
  }

  /**
   * 強制バージョンアップメッセージを表示する。
   *
   * @private
   * @param {string} appVersion
   * @param {Version} version
   * @returns
   * @memberof VersionCheckService
   */
  private async checkVersion(appVersion: string, version: Version) {
    if (!version || !version.minimumVersion) {
      return;
    }

    if (semver.gte(appVersion, version.minimumVersion)) {
      if (this.versionUpAlert) {
        await this.versionUpAlert.dismiss();
        this.versionUpAlert = undefined;

        // add this!
        this.isShowVersionUpAlert.next(false);
      }
      return;
    }

    this.versionUpAlert = await this.alertController.create({
      header: version.title,
      message: version.message,
      backdropDismiss: false,
    });

    // add this!
    this.isShowVersionUpAlert.next(true);

    await this.versionUpAlert.present();
  }
}
