import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from './services/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private versionCheckService: VersionCheckService) {}

  public ngOnInit(): void {
    this.versionCheckService.initSetting();
  }
}
