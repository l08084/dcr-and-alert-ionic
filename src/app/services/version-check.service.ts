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
  private readonly appVersion = '1.0.0';
  private maintenance$: Observable<Maintenance>;
  private version$: Observable<Version>;
  private maintenanceAlert: HTMLIonAlertElement;
  private versionUpAlert: HTMLIonAlertElement;

  constructor(
    private db: AngularFireDatabase,
    private alertController: AlertController
  ) {}

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
  }

  private async checkMaintenance(maintenance: Maintenance): Promise<void> {
    if (!maintenance) {
      return;
    }

    if (!maintenance.maintenanceFlg) {
      if (this.maintenanceAlert) {
        await this.maintenanceAlert.dismiss();
        this.maintenanceAlert = undefined;
      }
      return;
    }

    this.maintenanceAlert = await this.alertController.create({
      header: maintenance.title,
      message: maintenance.message,
      backdropDismiss: false, // 背景をクリックしても閉じない
    });
    await this.maintenanceAlert.present();
  }

  private async checkVersion(appVersion: string, version: Version) {
    if (!version || !version.minimumVersion) {
      return;
    }

    if (semver.gte(appVersion, version.minimumVersion)) {
      if (this.versionUpAlert) {
        await this.versionUpAlert.dismiss();
        this.versionUpAlert = undefined;
      }
      return;
    }

    this.versionUpAlert = await this.alertController.create({
      header: version.title,
      message: version.message,
      backdropDismiss: false, // 背景をクリックしても閉じない
    });
    await this.versionUpAlert.present();
  }
}
