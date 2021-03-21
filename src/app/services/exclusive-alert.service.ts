import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ExclusiveAlertService {
  private aAlert: HTMLIonAlertElement;
  private bAlert: HTMLIonAlertElement;

  constructor(private alertController: AlertController) {}

  public async presentAAlert(): Promise<void> {
    this.aAlert = await this.alertController.create({
      header: 'アラートA',
      message: 'アラートAです。アラートBとは同時に表示されません',
    });
    await this.aAlert.present();
  }

  public async presentBAlert(): Promise<void> {
    this.bAlert = await this.alertController.create({
      header: 'アラートB',
      message: 'アラートBです。アラートAとは同時に表示されません',
    });
    await this.bAlert.present();
  }
}
