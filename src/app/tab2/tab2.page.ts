import { Component } from '@angular/core';
import { ExclusiveAlertService } from '../services/exclusive-alert.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  constructor(private exclusiveAlertService: ExclusiveAlertService) {}

  public async openAlertA(): Promise<void> {
    await this.exclusiveAlertService.presentAAlert();
  }

  public async openAlertB(): Promise<void> {
    await this.exclusiveAlertService.presentBAlert();
  }
}
