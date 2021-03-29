import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Maintenance } from '../model/maintenance.model';
import { Version } from '../model/version.model';
import * as semver from 'semver';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  // このアプリのバージョン
  private readonly appVersion = '1.0.0';

  private maintenance$: Observable<Maintenance>;
  private version$: Observable<Version>;
  private maintenanceAlert: HTMLIonAlertElement;
  private versionUpAlert: HTMLIonAlertElement;

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
    // Realtime Databaseからデータを取得
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

    if (!maintenance.maintenanceFlg) {
      // メンテナンスフラグがOFFだったら処理を中断する
      if (this.maintenanceAlert) {
        // メンテナンスメッセージが開かれている場合は閉じる
        await this.maintenanceAlert.dismiss();
        this.maintenanceAlert = undefined;
      }
      return;
    }

    // メンテナンスメッセージを表示する
    this.maintenanceAlert = await this.alertController.create({
      header: maintenance.title,
      message: maintenance.message,
      backdropDismiss: false, // 背景をクリックしても閉じない
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
      // 最低バージョンよりもアプリのバージョンが高かったら処理を中断する
      if (this.versionUpAlert) {
        // 強制バージョンアップメッセージが開かれている場合は閉じる
        await this.versionUpAlert.dismiss();
        this.versionUpAlert = undefined;
      }
      return;
    }

    // 強制バージョンアップメッセージを表示する
    this.versionUpAlert = await this.alertController.create({
      header: version.title,
      message: version.message,
      backdropDismiss: false, // 背景をクリックしても閉じない
    });
    await this.versionUpAlert.present();
  }
}
